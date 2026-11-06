'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Loader2,
  AlertCircle,
  Plus,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { fetchAPI } from '@/lib/api';
import TallerCard, { type Taller } from '@/components/TallerCard';
import BuscadorTalleres from '@/components/BuscadorTalleres';

interface Usuario {
  id: number;
  username: string;
  is_staff: boolean;
}

interface Inscripcion {
  id: number;
  evento: number;
  estado: string;
}

interface RespuestaTalleres {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Taller[];
}

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  const [busqueda, setBusqueda] = useState('');
  const [busquedaAplicada, setBusquedaAplicada] = useState('');

  const [pagina, setPagina] = useState(1);
  const [totalTalleres, setTotalTalleres] = useState(0);
  const [haySiguiente, setHaySiguiente] = useState(false);
  const [hayAnterior, setHayAnterior] = useState(false);

  const [esAdministrador, setEsAdministrador] = useState(false);
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaActual, setFechaActual] = useState<number | null>(null);

  // Esperar 400 ms antes de realizar la búsqueda.
  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setBusquedaAplicada(busqueda.trim());
      setPagina(1);
    }, 400);

    return () => window.clearTimeout(temporizador);
  }, [busqueda]);

  // Obtener los talleres desde Django con búsqueda y paginación.
  const cargarTalleres = useCallback(async () => {
    const parametros = new URLSearchParams();

    if (busquedaAplicada) {
      parametros.set('search', busquedaAplicada);
    }

    parametros.set('page', String(pagina));

    const datos: Taller[] | RespuestaTalleres = await fetchAPI(
      `/talleres/?${parametros.toString()}`
    );

    if (Array.isArray(datos)) {
      setTalleres(datos);
      setTotalTalleres(datos.length);
      setHaySiguiente(false);
      setHayAnterior(false);
    } else {
      const resultados = datos.results ?? [];

      setTalleres(resultados);
      setTotalTalleres(datos.count ?? resultados.length);
      setHaySiguiente(Boolean(datos.next));
      setHayAnterior(Boolean(datos.previous));
    }
  }, [busquedaAplicada, pagina]);

  // Obtener las inscripciones del usuario.
  const cargarInscripciones = useCallback(async () => {
    const datos = await fetchAPI('/inscripciones/');

    setInscripciones(
      Array.isArray(datos)
        ? datos
        : datos.results ?? []
    );
  }, []);

  // Cargar talleres cuando cambian la búsqueda o la página.
  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      setError('');

      try {
        await cargarTalleres();
      } catch (err: unknown) {
        setTalleres([]);
        setTotalTalleres(0);
        setHaySiguiente(false);
        setHayAnterior(false);

        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los talleres.'
        );
      } finally {
        setCargando(false);
      }
    }

    void cargarDatos();
  }, [cargarTalleres]);

  // Verificar la sesión y cargar las inscripciones.
  useEffect(() => {
    async function verificarSesion() {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token && !refreshToken) {
        setEstaLogueado(false);
        setEsAdministrador(false);
        return;
      }

      try {
        const usuario: Usuario = await fetchAPI('/mi-usuario/');

        setEstaLogueado(true);
        setEsAdministrador(usuario.is_staff === true);

        await cargarInscripciones();
      } catch {
        setEstaLogueado(false);
        setEsAdministrador(false);
      }
    }

    void verificarSesion();
  }, [cargarInscripciones]);

  // Actualizar la hora para identificar talleres finalizados.
  useEffect(() => {
    const actualizarFecha = () => {
      setFechaActual(Date.now());
    };

    const timeout = window.setTimeout(actualizarFecha, 0);
    const intervalo = window.setInterval(actualizarFecha, 60000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(intervalo);
    };
  }, []);

  // Inscribir al usuario en un taller.
  const inscribirse = async (taller: Taller) => {
    if (!estaLogueado || procesando !== null) {
      return;
    }

    setProcesando(taller.id);
    setError('');
    setMensaje('');

    try {
      await fetchAPI('/inscripciones/', {
        method: 'POST',
        body: JSON.stringify({
          evento: taller.id,
        }),
      });

      await Promise.all([
        cargarTalleres(),
        cargarInscripciones(),
      ]);

      setMensaje(`¡Te inscribiste correctamente a "${taller.titulo}"!`);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo realizar la inscripción.'
      );
    } finally {
      setProcesando(null);
    }
  };

  // Eliminar talleres solamente como administrador.
  const eliminarTaller = async (taller: Taller) => {
    if (!esAdministrador || eliminando !== null) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar el taller "${taller.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    setEliminando(taller.id);
    setError('');
    setMensaje('');

    try {
      await fetchAPI(`/talleres/${taller.id}/`, {
        method: 'DELETE',
      });

      if (talleres.length === 1 && pagina > 1) {
        setPagina((paginaActual) => paginaActual - 1);
      } else {
        await cargarTalleres();
      }

      setMensaje('El taller se eliminó correctamente.');
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el taller.'
      );
    } finally {
      setEliminando(null);
    }
  };

  // Comprobar si el usuario está inscripto.
  const estaInscripto = (id: number) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.evento === id &&
        inscripcion.estado !== 'CANCELADO'
    );
  };

  // Comprobar si el taller ya finalizó.
  const tallerFinalizado = (fecha: string) => {
    if (fechaActual === null) {
      return false;
    }

    return new Date(fecha).getTime() <= fechaActual;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-700" />
            Talleres y eventos
          </h1>

          <p className="text-gray-600 mt-3">
            Descubrí talleres para aprender, compartir y mejorar tu huerta.
          </p>
        </div>

        {esAdministrador && (
          <Link
            href="/talleres/nuevo"
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar taller
          </Link>
        )}
      </div>

      <BuscadorTalleres
        busqueda={busqueda}
        setBusqueda={setBusqueda}
      />

      {mensaje && (
        <div
          role="status"
          className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-xl mb-6"
        >
          <CheckCircle2 className="w-6 h-6" />
          {mensaje}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-6"
        >
          <AlertCircle className="w-6 h-6" />
          {error}
        </div>
      )}

      {cargando ? (
        <div className="flex items-center justify-center gap-3 py-16 text-emerald-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando talleres...
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-5">
            {totalTalleres}{' '}
            {totalTalleres === 1
              ? 'taller encontrado'
              : 'talleres encontrados'}
          </p>

          {talleres.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-10 text-center">
              <CalendarDays className="w-12 h-12 text-emerald-600 mx-auto mb-4" />

              <h2 className="text-xl font-bold text-emerald-950 mb-2">
                No se encontraron talleres
              </h2>

              <p className="text-gray-600">
                Todavía no hay talleres registrados o ninguno coincide con la búsqueda.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talleres.map((taller) => (
                <TallerCard
                  key={taller.id}
                  taller={taller}
                  inscripto={estaInscripto(taller.id)}
                  finalizado={tallerFinalizado(taller.fecha_evento)}
                  estaLogueado={estaLogueado}
                  esAdministrador={esAdministrador}
                  procesando={procesando}
                  eliminando={eliminando}
                  fechaActual={fechaActual}
                  onInscribirse={inscribirse}
                  onEliminar={eliminarTaller}
                />
              ))}
            </section>
          )}

          {(hayAnterior || haySiguiente) && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                onClick={() =>
                  setPagina((actual) => Math.max(1, actual - 1))
                }
                disabled={!hayAnterior || cargando}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-xl text-emerald-800 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <span className="text-sm font-medium text-gray-600">
                Página {pagina}
              </span>

              <button
                type="button"
                onClick={() => setPagina((actual) => actual + 1)}
                disabled={!haySiguiente || cargando}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-xl text-emerald-800 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}