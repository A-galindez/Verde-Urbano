'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';
import { Heart, PlusCircle, Search, User, Calendar, Tag } from 'lucide-react';

interface Articulo {
  id: number;
  titulo: string;
  contenido: string;
  autor_username: string;
  categoria_nombre?: string;
  fecha_creacion: string;
  me_gusta: number;
}

export default function BlogPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargarArticulos = async () => {
    try {
      setCargando(true);
      const data = await fetchAPI('/articulos/');
      setArticulos(Array.isArray(data) ? data : data.results || []);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con la API del blog');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  const handleLike = async (id: number) => {
    try {
      const res = await fetchAPI(`/articulos/${id}/like/`, { method: 'POST' });
      setArticulos((prev) =>
        prev.map((art) => (art.id === id ? { ...art, me_gusta: res.me_gusta } : art))
      );
    } catch (err: any) {
      alert('Debes iniciar sesión para dar me gusta o hubo un problema en el servidor.');
    }
  };

  const handleSubmitArticulo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;

    setEnviando(true);
    try {
      await fetchAPI('/articulos/', {
        method: 'POST',
        body: JSON.stringify({ titulo, contenido }),
      });
      setTitulo('');
      setContenido('');
      setMostrarFormulario(false);
      await cargarArticulos();
    } catch (err: any) {
      alert(err.message || 'Error al publicar. Asegúrate de haber iniciado sesión.');
    } finally {
      setEnviando(false);
    }
  };

  const articulosFiltrados = articulos.filter(
    (art) =>
      art.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      art.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950">Blog Comunitario</h1>
          <p className="text-gray-600 text-sm mt-1">
            Espacio de aprendizaje, consejos de siembra y experiencias huerteras.
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-2.5 rounded-xl shadow transition-colors text-sm self-start md:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          {mostrarFormulario ? 'Cancelar' : 'Nueva Publicación'}
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={handleSubmitArticulo}
          className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-md mb-8 space-y-4"
        >
          <h2 className="text-lg font-bold text-emerald-900">Crear una nueva publicación</h2>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Título</label>
            <input
              type="text"
              required
              placeholder="Ej: Consejos para cultivar tomates en maceta..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Contenido</label>
            <textarea
              required
              rows={4}
              placeholder="Compartí tus trucos, dudas o experiencias..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {enviando ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      )}

      <div className="relative mb-8">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar publicaciones por título o contenido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

      {cargando && (
        <div className="text-center py-12 text-gray-500 font-medium text-sm">
          Cargando publicaciones del blog...
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!cargando && articulosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm">
          No se encontraron publicaciones. ¡Sé el primero en compartir algo!
        </div>
      )}

      <div className="space-y-6">
        {articulosFiltrados.map((art) => (
          <article
            key={art.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                <User className="w-3.5 h-3.5" /> @{art.autor_username || 'Anónimo'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(art.fecha_creacion).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              {art.categoria_nombre && (
                <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                  <Tag className="w-3.5 h-3.5" /> {art.categoria_nombre}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">{art.titulo}</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
              {art.contenido}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleLike(art.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors bg-gray-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>{art.me_gusta} Me gusta</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}