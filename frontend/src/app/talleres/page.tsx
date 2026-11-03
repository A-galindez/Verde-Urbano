'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  Users,
  Search,
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Taller {
  id: number;
  titulo: string;
  facilitador: string;
  fecha_evento: string;
  cupo_maximo: number;
  cupos_disponibles: number;
  precio: string | number;
  lugar: string;
  descripcion: string;
}

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

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [fechaActual, setFechaActual] = useState<number | null>(null);

  const cargarTalleres = useCallback(async () => {
    const datos = await fetchAPI('/talleres/');

    setTalleres(
      Array.isArray(datos)
        ? datos
        : datos.results ?? []
    );
  }, []);

  const cargarInscripciones = useCallback(async () => {
    const datos = await fetchAPI('/inscripciones/');

    setInscripciones(
      Array.isArray(datos)
        ? datos
        : datos.results ?? []
    );
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      try {
        await cargarTalleres();

        const token = localStorage.getItem('token');

        if (token) {
          try {
            const usuario: Usuario = await fetchAPI('/mi-usuario/');

            setEstaLogueado(true);
            setEsAdministrador(usuario.is_staff);

            await cargarInscripciones();
          } catch {
            setEstaLogueado(false);
            setEsAdministrador(false);
          }
        }
      } catch (err: unknown) {
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
  }, [cargarTalleres, cargarInscripciones]);

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

  const formatearPrecio = (precio: string | number) => {
    const valor = Number(precio);

    if (valor === 0) {
      return 'Gratuito';
    }

    return valor.toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    });
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const inscribirse = async (taller: Taller) => {
    if (!estaLogueado || procesando !== null) return;

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

  const eliminarTaller = async (taller: Taller) => {
    if (!esAdministrador) return;

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar el taller "${taller.titulo}"?`
    );

    if (!confirmar) return;

    setEliminando(taller.id);
    setError('');
    setMensaje('');

    try {
      await fetchAPI(`/talleres/${taller.id}/`, {
        method: 'DELETE',
      });

      await cargarTalleres();

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

  const talleresFiltrados = talleres.filter((taller) => {
    const texto = busqueda.toLowerCase();

    return (
      taller.titulo.toLowerCase().includes(texto) ||
      taller.facilitador.toLowerCase().includes(texto) ||
      taller.descripcion.toLowerCase().includes(texto) ||
      taller.lugar.toLowerCase().includes(texto)
    );
  });

  const estaInscripto = (id: number) => {
    return inscripciones.some(
      (inscripcion) =>
        inscripcion.evento === id &&
        inscripcion.estado !== 'CANCELADO'
    );
  };

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

      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm mb-8">
        <label
          htmlFor="busqueda"
          className="block text-sm font-semibold text-gray-700 mb-2"
        >
          Buscar talleres
        </label>

        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            id="busqueda"
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, profesor, lugar o descripción..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

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
            {talleresFiltrados.length}{' '}
            {talleresFiltrados.length === 1
              ? 'taller encontrado'
              : 'talleres encontrados'}
          </p>

          {talleresFiltrados.length === 0 ? (
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
              {talleresFiltrados.map((taller) => {
                const inscripto = estaInscripto(taller.id);
                const finalizado = tallerFinalizado(taller.fecha_evento);
                const sinCupos = taller.cupos_disponibles <= 0;

                return (
                  <article
                    key={taller.id}
                    className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <div className="bg-emerald-100 rounded-xl p-3">
                        <BookOpen className="w-8 h-8 text-emerald-700" />
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                          finalizado
                            ? 'bg-gray-100 text-gray-700'
                            : sinCupos
                              ? 'bg-red-50 text-red-700'
                              : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {finalizado
                          ? 'Finalizado'
                          : sinCupos
                            ? 'Sin cupos'
                            : 'Inscripciones abiertas'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      {taller.titulo}
                    </h2>

                    <p className="text-gray-600 text-sm mb-5 flex-1">
                      {taller.descripcion || 'Sin descripción disponible.'}
                    </p>

                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <UserRound className="w-4 h-4 text-emerald-700" />
                        <span>{taller.facilitador}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-emerald-700" />
                        <span>{formatearFecha(taller.fecha_evento)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-700" />
                        <span>{formatearHora(taller.fecha_evento)} hs.</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        <span>{taller.lugar}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-700" />
                        <span>
                          Cupos disponibles:{' '}
                          <strong>{taller.cupos_disponibles}</strong>
                          {' / '}
                          {taller.cupo_maximo}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mt-5 pt-4">
                      <p className="text-2xl font-bold text-emerald-800 mb-4">
                        {formatearPrecio(taller.precio)}
                      </p>

                      {inscripto ? (
                        <div className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-800 font-semibold px-4 py-3 rounded-xl">
                          <CheckCircle2 className="w-5 h-5" />
                          Ya estás inscripto
                        </div>
                      ) : !estaLogueado ? (
                        <Link
                          href="/login"
                          className="block text-center bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
                        >
                          Iniciá sesión para inscribirte
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => inscribirse(taller)}
                          disabled={
                            fechaActual === null ||
                            finalizado ||
                            sinCupos ||
                            procesando !== null
                          }
                          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-3 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          {procesando === taller.id ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Inscribiendo...
                            </>
                          ) : finalizado ? (
                            'Taller finalizado'
                          ) : sinCupos ? (
                            'Sin cupos disponibles'
                          ) : (
                            'Inscribirme'
                          )}
                        </button>
                      )}
                    </div>

                    {esAdministrador && (
                      <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                        <Link
                          href={`/talleres/${taller.id}/editar`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-3 py-2.5 rounded-xl transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => eliminarTaller(taller)}
                          disabled={eliminando === taller.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {eliminando === taller.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Eliminar
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
}