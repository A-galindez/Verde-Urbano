import Link from 'next/link';
import { Sprout, BookOpen, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-6 bg-emerald-50 rounded-3xl mb-12 border border-emerald-100 shadow-sm">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
          <Sprout className="w-4 h-4 text-emerald-600" />
          Comunidad de Huerta & Ecología Urbana
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">
          Cultivá tu propio espacio verde en la ciudad
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Conectate con otros huerteros, compartí consejos en el blog comunitario, gestioná el riego de tus plantas y participá de nuestros talleres.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Explorar el Blog <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/huerta"
            className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold px-6 py-3 rounded-xl border border-emerald-200 transition-all shadow-sm"
          >
            Ir a Mi Huerta
          </Link>
        </div>
      </section>

      {/* Grid de Acceso Rápido */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Blog Multiusuario</h2>
          <p className="text-gray-600 text-sm mb-4">
            Publicá tus experiencias, descubrí artículos sobre siembra y dejá tus comentarios a la comunidad.
          </p>
          <Link href="/blog" className="text-emerald-700 font-semibold text-sm hover:underline inline-flex items-center gap-1">
            Ver publicaciones <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mi Huerta</h2>
          <p className="text-gray-600 text-sm mb-4">
            Seguí de cerca el crecimiento de tus cultivos y consultá tu calendario personalizado de riego.
          </p>
          <Link href="/huerta" className="text-emerald-700 font-semibold text-sm hover:underline inline-flex items-center gap-1">
            Gestionar plantas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Insumos & Talleres</h2>
          <p className="text-gray-600 text-sm mb-4">
            Encontrá semillas, herramientas orgánicas e inscribite a eventos y talleres de capacitación.
          </p>
          <Link href="/tienda" className="text-emerald-700 font-semibold text-sm hover:underline inline-flex items-center gap-1">
            Ver catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}