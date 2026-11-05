'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAPI } from '../../lib/api';
import Link from 'next/link';
import { Heart, PlusCircle, Search, User, Calendar, Tag, ArrowLeft, Pencil, Trash2, MessageSquare } from 'lucide-react';

interface Comentario {
  id: number;
  autor?: {
    username: string;
  };
  contenido: string;
  fecha_creacion: string;
}

interface Articulo {
  id: number;
  titulo: string;
  contenido: string;
  autor?: {
    username: string;
  };
  categoria_nombre?: string;
  fecha_creacion: string;
  me_gusta: number;
  comentarios?: Comentario[];
}

export default function BlogPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Estados para controlar si el usuario está autenticado y su nombre
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<string | null>(null);

  // Estado para guardar el texto del comentario que se está escribiendo por cada artículo
  const [comentariosTexto, setComentariosTexto] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    setEstaAutenticado(!!token);
    if (storedUsername) {
      setUsuarioActual(storedUsername);
    } else if (token) {
      // Petición de respaldo a /mi_usuario/ por si el localStorage no lo tenía
      fetchAPI('/mi_usuario/')
        .then((data) => {
          if (data && data.username) {
            setUsuarioActual(data.username);
            localStorage.setItem('username', data.username);
          }
        })
        .catch(() => setUsuarioActual(null));
    }
  }, []);

  const cargarArticulos = useCallback(async (mostrarCarga = true) => {
    try {
      if (mostrarCarga) {
        setCargando(true);
      }

      setError('');

      const data = await fetchAPI('/articulos/');

      setArticulos(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al conectar con la API del blog'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const iniciarCarga = async () => {
      await cargarArticulos();
    };

    void iniciarCarga();
  }, [cargarArticulos]);

  const handleLike = async (id: number) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para dar "Me Gusta".');
      return;
    }

    try {
      const res = await fetchAPI(`/articulos/${id}/like/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setArticulos((prev) =>
        prev.map((art) =>
          art.id === id
            ? { ...art, me_gusta: res.me_gusta }
            : art
        )
      );
    } catch {
      alert('Hubo un problema al registrar el Me Gusta.');
    }
  };

  // Enviar comentario a la API
  const handleEnviarComentario = async (articuloId: number) => {
    const texto = comentariosTexto[articuloId];
    if (!texto || !texto.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para comentar.');
      return;
    }

    try {
      await fetchAPI('/comentarios/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          articulo: articuloId,
          contenido: texto,
        }),
      });

      // Limpiar input de este artículo y recargar artículos para ver el nuevo comentario
      setComentariosTexto({ ...comentariosTexto, [articuloId]: '' });
      await cargarArticulos(false);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'Error al enviar el comentario.'
      );
    }
  };

  // Eliminar un comentario propio
  const handleEliminarComentario = async (comentarioId: number) => {
    if (!confirm('¿Estás segura de que deseas eliminar este comentario?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetchAPI(`/comentarios/${comentarioId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await cargarArticulos(false);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'No tienes permiso para eliminar este comentario.'
      );
    }
  };

  // Preparar el formulario para editar un artículo existente
  const iniciarEdicion = (art: Articulo) => {
    setEditandoId(art.id);
    setTitulo(art.titulo);
    setContenido(art.contenido);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Eliminar un artículo mediante DELETE
  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás segura de que deseas eliminar esta publicación?')) {
      return;
    }

    try {
      await fetchAPI(`/articulos/${id}/`, {
        method: 'DELETE',
      });

      setArticulos((prev) => prev.filter((art) => art.id !== id));
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'Error al eliminar la publicación.'
      );
    }
  };

  const handleSubmitArticulo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para publicar.');
      return;
    }

    setEnviando(true);

    try {
      if (editandoId) {
        // Petición PUT para actualizar
        await fetchAPI(`/articulos/${editandoId}/`, {
          method: 'PUT',
          body: JSON.stringify({
            titulo,
            contenido,
          }),
        });
      } else {
        // Petición POST para crear
        await fetchAPI('/articulos/', {
          method: 'POST',
          body: JSON.stringify({
            titulo,
            contenido,
          }),
        });
      }

      setTitulo('');
      setContenido('');
      setEditandoId(null);
      setMostrarFormulario(false);

      await cargarArticulos(false);
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : 'Error al guardar la publicación.'
      );
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
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-emerald-700 hover:text-emerald-800 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver atrás
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Blog Comunitario
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Espacio de aprendizaje, consejos de siembra y experiencias huerteras.
          </p>
        </div>

       <button
          onClick={() => {
            if (!estaAutenticado) {
              alert('Debes iniciar sesión para poder crear una publicación.');
              return;
            }
            if (mostrarFormulario && editandoId) {
              setEditandoId(null);
              setTitulo('');
              setContenido('');
            }
            setMostrarFormulario(!mostrarFormulario);
          }}
          disabled={!estaAutenticado}
          title="Debes iniciar sesión para crear una publicación"
          className={`inline-flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl shadow transition-colors text-sm self-start md:self-auto ${
            !estaAutenticado
              ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 shadow-none"
              : "bg-emerald-700 hover:bg-emerald-800 text-white"
          }`}
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
          <h2 className="text-lg font-bold text-emerald-900">
            {editandoId ? 'Editar publicación' : 'Crear una nueva publicación'}
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Título
            </label>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contenido
            </label>
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
              onClick={() => {
                setMostrarFormulario(false);
                setEditandoId(null);
                setTitulo('');
                setContenido('');
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={enviando}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {enviando ? 'Guardando...' : editandoId ? 'Actualizar cambios' : 'Publicar'}
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

      {!cargando && !error && articulosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-gray-500 text-sm">
          No se encontraron publicaciones. ¡Sé el primero en compartir algo!
        </div>
      )}

      <div className="space-y-6">
        {articulosFiltrados.map((art) => {
          return (
            <article
              key={art.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                    <User className="w-3.5 h-3.5" />
                    @{art.autor?.username || 'Anónimo'} 
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
                      <Tag className="w-3.5 h-3.5" />
                      {art.categoria_nombre}
                    </span>
                  )}
                </div>

                {/* Botones de Editar y Eliminar (Blindado y dinámico) */}
                {(usuarioActual === art.autor?.username || art.autor?.username === localStorage.getItem('username')) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => iniciarEdicion(art)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md transition-colors"
                      title="Editar publicación"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>

                    <button
                      onClick={() => handleEliminar(art.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-md transition-colors"
                      title="Eliminar publicación"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {art.titulo}
              </h2>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                {art.contenido}
              </p>

              {/* Botón Me Gusta */}
              <div className="flex items-center gap-4 pt-3 border-t border-gray-100 mb-4">
                <button
                  onClick={() => handleLike(art.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-rose-600 transition-colors bg-gray-50 hover:bg-rose-50 px-3 py-1.5 rounded-lg"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{art.me_gusta} Me gusta</span>
                </button>
              </div>

              {/* SECCIÓN DE COMENTARIOS */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Comentarios
                </h4>

                {/* Listado de comentarios */}
                <div className="space-y-2 mb-3">
                  {art.comentarios && art.comentarios.length > 0 ? (
                    art.comentarios.map((c) => {
                      // Verificamos si el usuario actual es el autor del comentario
                      const esDueñoComentario = usuarioActual && c.autor?.username === usuarioActual;

                      return (
                        <div key={c.id} className="bg-gray-50 p-2.5 rounded-lg text-xs border border-gray-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-emerald-800">@{c.autor?.username || 'Anónimo'}</span>: {c.contenido}
                          </div>

                          {/* Botón para eliminar el comentario propio */}
                          {esDueñoComentario && (
                            <button
                              onClick={() => handleEliminarComentario(c.id)}
                              className="text-rose-600 hover:text-rose-800 p-1 rounded transition-colors"
                              title="Eliminar mi comentario"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                  )}
                </div>

                {/* Formulario para agregar comentario */}
                {estaAutenticado ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={comentariosTexto[art.id] || ''}
                      onChange={(e) => setComentariosTexto({ ...comentariosTexto, [art.id]: e.target.value })}
                      className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      onClick={() => handleEnviarComentario(art.id)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-2 rounded-lg transition-colors font-medium shadow-sm"
                    >
                      Comentar
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Inicia sesión para dejar un comentario.</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}