'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Save,
  Loader2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

export default function NuevoTaller() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [profesor, setProfesor] = useState('');
  const [fechaEvento, setFechaEvento] = useState('');
  const [cupoMaximo, setCupoMaximo] = useState('');
  const [precio, setPrecio] = useState('0');
  const [lugar, setLugar] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const guardarTaller = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (
      !titulo.trim() ||
      !profesor.trim() ||
      !fechaEvento ||
      !cupoMaximo ||
      !lugar.trim() ||
      !descripcion.trim()
    ) {
      setError('Completá todos los campos obligatorios.');
      return;
    }

    const cupo = Number(cupoMaximo);
    const precioNumero = Number(precio);

    if (!Number.isInteger(cupo) || cupo <= 0) {
      setError('El cupo máximo debe ser mayor a cero.');
      return;
    }

    if (!Number.isFinite(precioNumero) || precioNumero < 0) {
      setError('El precio no puede ser negativo.');
      return;
    }

    const fecha = new Date(fechaEvento);

    if (Number.isNaN(fecha.getTime())) {
      setError('Ingresá una fecha válida.');
      return;
    }

    if (fecha.getTime() <= Date.now()) {
      setError('La fecha del taller debe ser futura.');
      return;
    }

    setGuardando(true);

    try {
      await fetchAPI('/talleres/', {
        method: 'POST',
        body: JSON.stringify({
          titulo: titulo.trim(),
          facilitador: profesor.trim(),
          fecha_evento: fecha.toISOString(),
          cupo_maximo: cupo,
          precio: precioNumero.toFixed(2),
          lugar: lugar.trim(),
          descripcion: descripcion.trim(),
        }),
      });

      router.push('/talleres');
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el taller.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/talleres"
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a talleres
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-100 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <CalendarDays className="w-7 h-7 text-emerald-700" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-emerald-950">
                Agregar taller
              </h1>

              <p className="text-gray-600 text-sm">
                Completá los datos para publicar un nuevo taller.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={guardarTaller} className="p-6 space-y-6">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nombre del taller
            </label>

            <input
              id="titulo"
              type="text"
              maxLength={200}
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Taller de huerta urbana"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="profesor"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Profesor
            </label>

            <input
              id="profesor"
              type="text"
              maxLength={100}
              required
              value={profesor}
              onChange={(e) => setProfesor(e.target.value)}
              placeholder="Nombre y apellido del profesor"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="fechaEvento"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Fecha y hora
              </label>

              <input
                id="fechaEvento"
                type="datetime-local"
                required
                value={fechaEvento}
                onChange={(e) => setFechaEvento(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="cupoMaximo"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Cupo máximo
              </label>

              <input
                id="cupoMaximo"
                type="number"
                min="1"
                step="1"
                required
                value={cupoMaximo}
                onChange={(e) => setCupoMaximo(e.target.value)}
                placeholder="Ej: 20"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="precio"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Precio
            </label>

            <input
              id="precio"
              type="number"
              min="0"
              step="0.01"
              required
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <p className="text-xs text-gray-500 mt-1">
              Ingresá 0 si el taller es gratuito.
            </p>
          </div>

          <div>
            <label
              htmlFor="lugar"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Lugar
            </label>

            <input
              id="lugar"
              type="text"
              maxLength={200}
              required
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Dirección o enlace de reunión virtual"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Descripción
            </label>

            <textarea
              id="descripcion"
              rows={5}
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contá de qué se trata el taller..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/talleres"
              className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={guardando}
              className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar taller
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
        <BookOpen className="w-4 h-4" />
        Los talleres publicados aparecerán en el listado general.
      </div>
    </main>
  );
}