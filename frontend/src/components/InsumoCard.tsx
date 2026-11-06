import Link from 'next/link';
import {
  Sprout,
  Package,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string | number;
  stock: number;
  descripcion: string;
}

interface InsumoCardProps {
  producto: Producto;
  esAdministrador: boolean;
  eliminando: number | null;
  eliminarProducto: (producto: Producto) => void;
  nombreCategoria: (valor: string) => string;
  formatearPrecio: (precio: string | number) => string;
}

export default function InsumoCard({
  producto,
  esAdministrador,
  eliminando,
  eliminarProducto,
  nombreCategoria,
  formatearPrecio,
}: InsumoCardProps) {
  return (
    <article className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="bg-emerald-100 rounded-xl p-3">
          <Sprout className="w-8 h-8 text-emerald-700" />
        </div>

        <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full">
          {nombreCategoria(producto.categoria)}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-3">
        {producto.nombre}
      </h2>

      <p className="text-gray-600 text-sm mb-6 flex-1">
        {producto.descripcion || 'Sin descripción disponible.'}
      </p>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-2xl font-bold text-emerald-800 mb-3">
          {formatearPrecio(producto.precio)}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-gray-500" />

          {producto.stock > 0 ? (
            <span className="text-gray-700">
              Stock disponible: <strong>{producto.stock}</strong>
            </span>
          ) : (
            <span className="text-red-600 font-semibold">
              Sin stock
            </span>
          )}
        </div>
      </div>

      {esAdministrador && (
        <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
          <Link
            href={`/insumos/${producto.id}/editar`}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-3 py-2.5 rounded-xl transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>

          <button
            type="button"
            onClick={() => eliminarProducto(producto)}
            disabled={eliminando === producto.id}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {eliminando === producto.id ? (
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