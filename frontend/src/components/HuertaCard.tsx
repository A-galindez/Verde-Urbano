import Link from 'next/link';
import {
  Sprout,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';

export interface Planta {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  frecuencia_riego_dias: number;
}

export interface Huerta {
  id: number;
  planta: number;
  planta_detalle: Planta;
  cantidad: number;
  fecha_plantacion: string;
  notas: string;
}

interface HuertaCardProps {
  huerta: Huerta;
  eliminando: number | null;
  eliminarPlanta: (id: number, nombre: string) => void;
}

export default function HuertaCard({
  huerta,
  eliminando,
  eliminarPlanta,
}: HuertaCardProps) {
  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
      <Sprout className="w-10 h-10 text-emerald-600 mb-4" />

      <h2 className="text-xl font-bold text-gray-900">
        {huerta.planta_detalle.nombre_comun}
      </h2>

      <p className="text-sm italic text-gray-500 mb-4">
        {huerta.planta_detalle.nombre_cientifico}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Cantidad:</strong> {huerta.cantidad}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Plantación:</strong> {huerta.fecha_plantacion}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Riego:</strong> cada{' '}
        {huerta.planta_detalle.frecuencia_riego_dias} días
      </p>

      {huerta.notas && (
        <p className="text-gray-600 text-sm mt-3">
          {huerta.notas}
        </p>
      )}

      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
        <Link
          href={`/huerta/${huerta.id}/editar`}
          className="inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-4 py-2 rounded-xl text-sm"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </Link>

        <button
          type="button"
          onClick={() =>
            eliminarPlanta(
              huerta.id,
              huerta.planta_detalle.nombre_comun
            )
          }
          disabled={eliminando !== null}
          className="inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-4 py-2 rounded-xl text-sm disabled:opacity-50"
        >
          {eliminando === huerta.id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}

          {eliminando === huerta.id
            ? 'Eliminando...'
            : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}