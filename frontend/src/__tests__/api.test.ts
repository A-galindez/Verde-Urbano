import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchAPI } from '../lib/api';

describe('API de Verde-Urbano', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('debe obtener correctamente el listado de plantas', async () => {
    const plantas = [
      {
        id: 1,
        nombre_comun: 'Tomate',
        nombre_cientifico: 'Solanum lycopersicum',
      },
    ];

    const fetchSimulado = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => plantas,
    });

    vi.stubGlobal('fetch', fetchSimulado);

    const resultado = await fetchAPI('/plantas/');

    expect(resultado).toEqual(plantas);

    expect(fetchSimulado).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/plantas/',
      expect.objectContaining({
        headers: expect.any(Headers),
      })
    );
  });

  it('debe mostrar un error cuando falla la petición', async () => {
    const fetchSimulado = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        detail: 'Error del servidor',
      }),
    });

    vi.stubGlobal('fetch', fetchSimulado);

    await expect(fetchAPI('/plantas/')).rejects.toThrow(
      'Error del servidor'
    );
  });

  it('debe enviar correctamente los datos de una planta', async () => {
    const nuevaPlanta = {
      nombre_comun: 'Lechuga',
      nombre_cientifico: 'Lactuca sativa',
    };

    const fetchSimulado = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 2,
        ...nuevaPlanta,
      }),
    });

    vi.stubGlobal('fetch', fetchSimulado);

    const resultado = await fetchAPI('/plantas/', {
      method: 'POST',
      body: JSON.stringify(nuevaPlanta),
    });

    expect(resultado).toEqual({
      id: 2,
      ...nuevaPlanta,
    });

    expect(fetchSimulado).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/plantas/',
      expect.objectContaining({
        method: 'POST',
        headers: expect.any(Headers),
        body: JSON.stringify(nuevaPlanta),
      })
    );

    const headers = fetchSimulado.mock.calls[0][1].headers;
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('debe manejar correctamente una respuesta sin contenido', async () => {
    const fetchSimulado = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
    });

    vi.stubGlobal('fetch', fetchSimulado);

    const resultado = await fetchAPI('/plantas/1/', {
      method: 'DELETE',
    });

    expect(resultado).toBeNull();

    expect(fetchSimulado).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/plantas/1/',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
  });
});