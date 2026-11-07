'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Package,
  Loader2,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import InsumoCard from '@/components/InsumoCard';

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

interface RespuestaProductos {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: Producto[];
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
  const [busquedaAplicada, setBusquedaAplicada] = useState('');
  const [categoria, setCategoria] = useState('TODAS');

  const [pagina, setPagina] = useState(1);
  const [totalProductos, setTotalProductos] = useState(0);
  const [haySiguiente, setHaySiguiente] = useState(false);
  const [hayAnterior, setHayAnterior] = useState(false);

  const [esAdministrador, setEsAdministrador] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Esperar un momento antes de buscar para evitar
  // una consulta al backend por cada tecla.
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setBusquedaAplicada(busqueda.trim());
      setPagina(1);
    }, 400);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  // Consultar productos usando los filtros de Django.
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError('');

    try {
      const parametros = new URLSearchParams();

      if (busquedaAplicada) {
        parametros.set('search', busquedaAplicada);
      }

      if (categoria !== 'TODAS') {
        parametros.set('categoria', categoria);
      }

      parametros.set('page', String(pagina));

      const datos: Producto[] | RespuestaProductos = await fetchAPI(
        `/productos/?${parametros.toString()}`
      );

      if (Array.isArray(datos)) {
        setProductos(datos);
        setTotalProductos(datos.length);
        setHaySiguiente(false);
        setHayAnterior(false);
      } else {
        const resultados = datos.results ?? [];

        setProductos(resultados);
        setTotalProductos(datos.count ?? resultados.length);
        setHaySiguiente(Boolean(datos.next));
        setHayAnterior(Boolean(datos.previous));
      }
    } catch (err) {
      setProductos([]);
      setTotalProductos(0);
      setHaySiguiente(false);
      setHayAnterior(false);

      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los productos.'
      );
    } finally {
      setCargando(false);
    }
  }, [busquedaAplicada, categoria, pagina]);

  // Cargar productos cada vez que cambian los filtros
  // o la página seleccionada.
  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  // Verificar los permisos del usuario una sola vez.
  useEffect(() => {
    async function verificarAdministrador() {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token && !refreshToken) {
        setEsAdministrador(false);
        return;
      }

      try {
        const usuario: Usuario = await fetchAPI('/mi-usuario/');
        setEsAdministrador(usuario.is_staff === true);
      } catch {
        setEsAdministrador(false);
      }
    }

    void verificarAdministrador();
  }, []);

  // Eliminar productos solamente si el usuario
  // tiene permisos de administrador.
  const eliminarProducto = async (producto: Producto) => {
    if (!esAdministrador || eliminando !== null) {
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    setEliminando(producto.id);
    setError('');

    try {
      await fetchAPI(`/productos/${producto.id}/`, {
        method: 'DELETE',
      });

      // Si eliminamos el último producto de una página,
      // volvemos a la página anterior.
      if (productos.length === 1 && pagina > 1) {
        setPagina((paginaActual) => paginaActual - 1);
      } else {
        await cargarProductos();
      }
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

  // Cambiar la categoría y volver a la primera página.
  const cambiarCategoria = (nuevaCategoria: string) => {
    setCategoria(nuevaCategoria);
    setPagina(1);
  };

  const formatearPrecio = (precio: string | number) => {
    return Number(precio).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
    });
  };

  const nombreCategoria = (valor: string) => {
    return (
      categorias.find((item) => item.valor === valor)?.nombre ??
      valor
    );
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

      {/* Buscador y filtros */}
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
              onChange={(e) => cambiarCategoria(e.target.value)}
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

      {/* Indicador de carga */}
      {cargando && (
        <div className="flex items-center justify-center gap-3 py-16 text-emerald-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando insumos...
        </div>
      )}

      {/* Mensajes de error */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-6"
        >
          <AlertCircle className="w-6 h-6" />
          {error}
        </div>
      )}

      {/* Listado de productos */}
      {!cargando && !error && (
        <>
          <p className="text-sm text-gray-500 mb-5">
            {totalProductos}{' '}
            {totalProductos === 1
              ? 'producto encontrado'
              : 'productos encontrados'}
          </p>

          {productos.length === 0 ? (
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
              {productos.map((producto) => (
                <InsumoCard
                  key={producto.id}
                  producto={producto}
                  esAdministrador={esAdministrador}
                  eliminando={eliminando}
                  eliminarProducto={eliminarProducto}
                  nombreCategoria={nombreCategoria}
                  formatearPrecio={formatearPrecio}
                />
              ))}
            </section>
          )}

          {/* Paginación */}
          {(hayAnterior || haySiguiente) && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
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