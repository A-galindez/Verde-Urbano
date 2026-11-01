'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string | number;
  stock: number;
}

const categorias = [
  { valor: 'SEMILLAS', nombre: 'Semillas' },
  { valor: 'HERRAMIENTAS', nombre: 'Herramientas' },
  { valor: 'SUSTRATO', nombre: 'Sustratos' },
  { valor: 'MACETAS', nombre: 'Macetas' },
];

export default function EditarInsumoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('SEMILLAS');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      try {
        const usuario = await fetchAPI('/mi-usuario/');

        if (!usuario.is_staff) {
          setAutorizado(false);
          return;
        }

        setAutorizado(true);

        const producto: Producto = await fetchAPI(`/productos/${id}/`);

        setNombre(producto.nombre);
        setCategoria(producto.categoria);
        setDescripcion(producto.descripcion ?? '');
        setPrecio(String(producto.precio));
        setStock(String(producto.stock));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el producto.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, [id]);

  async function guardarCambios(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!autorizado || guardando) return;

    const precioNumero = Number(precio);
    const stockNumero = Number(stock);

    if (
      !nombre.trim() ||
      precio.trim() === '' ||
      stock.trim() === '' ||
      !Number.isFinite(precioNumero) ||
      precioNumero < 0 ||
      !Number.isInteger(stockNumero) ||
      stockNumero < 0
    ) {
      setError('Revisá los datos ingresados.');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      await fetchAPI(`/productos/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: nombre.trim(),
          categoria,
          descripcion: descripcion.trim(),
          precio: precioNumero,
          stock: stockNumero,
        }),
      });

      router.push('/insumos');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron guardar los cambios.'
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-emerald-700">
        <Loader2 className="w-6 h-6 animate-spin" />
        Cargando producto...
      </main>
    );
  }

  if (!autorizado) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-red-800 mb-3">
            Acceso restringido
          </h1>

          <p className="text-red-700 mb-6">
            Solamente los administradores pueden editar insumos.
          </p>

          <Link
            href="/insumos"
            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Insumos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/insumos"
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Insumos
      </Link>

      <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Pencil className="w-7 h-7 text-emerald-700" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-emerald-950">
              Editar insumo
            </h1>

            <p className="text-gray-600 mt-1">
              Modificá los datos del producto y guardá los cambios.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={guardarCambios} className="space-y-6">
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nombre del producto
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={200}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Categoría
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {categorias.map((item) => (
                <option key={item.valor} value={item.valor}>
                  {item.nombre}
                </option>
              ))}
            </select>
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="precio"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Precio ($)
              </label>

              <input
                id="precio"
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Stock disponible
              </label>

              <input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50"
            >
              {guardando ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <Link
              href="/insumos"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}