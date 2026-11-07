import Link from 'next/link';
import { Sprout, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="text-center py-12 px-6 bg-emerald-50 rounded-3xl mb-12 border border-emerald-100 shadow-sm">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
        <Sprout className="w-4 h-4 text-emerald-600" />
        Comunidad de Huerta & Ecología Urbana
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-950 mb-4 tracking-tight">
        Cultivá tu propio espacio verde en la ciudad
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        Conectate con otros huerteros, compartí consejos en el blog comunitario,
        gestioná el riego de tus plantas y participá de nuestros talleres.
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
  );
}