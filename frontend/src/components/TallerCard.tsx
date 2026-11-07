'use client';

import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  Users,
  CheckCircle2,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react';

export interface Taller {
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

interface TallerCardProps {
  taller: Taller;
  inscripto: boolean;
  finalizado: boolean;
  estaLogueado: boolean;
  esAdministrador: boolean;
  procesando: number | null;
  eliminando: number | null;
  fechaActual: number | null;
  onInscribirse: (taller: Taller) => void;
  onEliminar: (taller: Taller) => void;
}

export default function TallerCard({
  taller,
  inscripto,
  finalizado,
  estaLogueado,
  esAdministrador,
  procesando,
  eliminando,
  fechaActual,
  onInscribirse,
  onEliminar,
}: TallerCardProps) {
  const sinCupos = taller.cupos_disponibles <= 0;

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

  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col">
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
            onClick={() => onInscribirse(taller)}
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
            onClick={() => onEliminar(taller)}
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
}