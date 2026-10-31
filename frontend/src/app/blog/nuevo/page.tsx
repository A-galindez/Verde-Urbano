'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { fetchAPI } from '../../../lib/api';

interface Categoria {
  id: number;
  nombre: string;
}

export default function NuevaPublicacionPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Cargar las categorías del Backend al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchAPI('/categorias/')
      .then((data) => {
        if (Array.isArray(data)) {
          setCategorias(data);
          if (data.length > 0) setCategoria(String(data[0].id));
        }
      })
      .catch((err) => console.error('Error al cargar categorías:', err));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para publicar.');
      setCargando(false);
      return;
    }

    try {
      await fetchAPI('/articulos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          contenido,
          categoria: categoria ? parseInt(categoria) : null,
        }),
      });

      // Redirigir al blog para ver la publicación recién creada
      router.push('/blog');
    } catch (err: any) {
      setError(err.message || 'Error al guardar la publicación.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Blog
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-emerald-950">Nueva Publicación</h1>
            <p className="text-sm text-gray-500">Compartí tus consejos, dudas o experiencias con la comunidad</p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Título de la publicación</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Consejos para sembrar tomates en balcón"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            >
              {categorias.length === 0 && <option value="">Sin categoría disponible</option>}
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contenido</label>
            <textarea
              required
              rows={6}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribí detalladamente tu artículo..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/blog"
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={cargando}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {cargando ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}