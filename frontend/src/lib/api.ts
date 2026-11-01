const API_BASE_URL = 'http://127.0.0.1:8000/api';

let renovacionEnCurso: Promise<string | null> | null = null;

async function renovarToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return null;
  }

  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        if (!data.access) {
          return null;
        }

        localStorage.setItem('token', data.access);

        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }

        return data.access as string;
      } catch {
        return null;
      }
    })().finally(() => {
      renovacionEnCurso = null;
    });
  }

  return renovacionEnCurso;
}

function limpiarSesion() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }
}

export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    const nuevoToken = await renovarToken();

    if (nuevoToken) {
      headers.set('Authorization', `Bearer ${nuevoToken}`);

      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      limpiarSesion();
      throw new Error(
        'Tu sesión venció. Iniciá sesión nuevamente.'
      );
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      typeof errorData.detail === 'string'
        ? errorData.detail
        : typeof errorData.message === 'string'
          ? errorData.message
          : 'Error en la petición a la API'
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}