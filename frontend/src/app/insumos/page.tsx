'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Package,
  Loader2,
  Sprout,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: string | number;
  stock: number;
  descripcion: string;
}

interface Usuario {
  id: number;
  username: string;
  is_staff: boolean;
}

const categorias = [
  { valor: 'TODAS', nombre: 'Todas las categorías' },
  { valor: 'SEMILLAS', nombre: 'Semillas' },
  { valor: 'HERRAMIENTAS', nombre: 'Herramientas' },
  { valor: 'SUSTRATO', nombre: 'Sustratos' },
  { valor: 'MACETAS', nombre: 'Macetas' },
];

export default function InsumosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('TODAS');
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [error, setError] = useState('');

  const cargarProductos = useCallback(async () => {
    try {
      const datos = await fetchAPI('/productos/');

      setProductos(
        Array.isArray(datos)
          ? datos
          : datos.results ?? []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los productos.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    async function cargarDatos() {
      await cargarProductos();

      if (!localStorage.getItem('token')) {
        setEsAdministrador(false);
        return;
      }

      try {
        const usuario: Usuario = await fetchAPI('/mi-usuario/');
        setEsAdministrador(usuario.is_staff);
      } catch {
        setEsAdministrador(false);
      }
    }

    cargarDatos();
  }, [cargarProductos]);

  const eliminarProducto = async (producto: Producto) => {
    if (!esAdministrador) return;

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar "${producto.nombre}"?`
    );

    if (!confirmar) return;

    setEliminando(producto.id);
    setError('');

    try {
      await fetchAPI(`/productos/${producto.id}/`, {
        method: 'DELETE',
      });

      await cargarProductos();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el producto.'
      );
    } finally {
      setEliminando(null);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (producto.descripcion ?? '')
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === 'TODAS' || producto.categoria === categoria;

    return coincideBusqueda && coincideCategoria;
  });

  const formatearPrecio = (precio: string | number) => {
    return Number(precio).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    });
  };

  const nombreCategoria = (valor: string) => {
    return categorias.find((item) => item.valor === valor)?.nombre ?? valor;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-700" />
            Insumos para tu huerta
          </h1>

          <p className="text-gray-600 mt-3">
            Explorá los productos disponibles para cuidar y mejorar tu huerta.
          </p>
        </div>

        {esAdministrador && (
          <Link
            href="/insumos/nuevo"
            className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar insumo
          </Link>
        )}
      </div>

      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="busqueda"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Buscar insumos
            </label>

            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Filtrar por categoría
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {categorias.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="flex items-center justify-center gap-3 py-16 text-emerald-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando insumos...
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

      {!cargando && !error && (
        <>
          <p className="text-sm text-gray-500 mb-5">
            {productosFiltrados.length}{' '}
            {productosFiltrados.length === 1
              ? 'producto encontrado'
              : 'productos encontrados'}
          </p>

          {productosFiltrados.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-10 text-center">
              <Package className="w-12 h-12 text-emerald-600 mx-auto mb-4" />

              <h2 className="text-xl font-bold text-emerald-950 mb-2">
                No se encontraron insumos
              </h2>

              <p className="text-gray-600">
                Todavía no hay productos registrados o ninguno coincide con los filtros.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosFiltrados.map((producto) => (
                <article
                  key={producto.id}
                  className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col"
                >
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
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}