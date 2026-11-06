import Link from 'next/link';
import { Sprout, ArrowLeft } from 'lucide-react';

export default function NotFoundHuerta() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <Sprout className="w-14 h-14 text-emerald-700 mb-4" />

      <h1 className="text-3xl font-bold text-emerald-950 mb-3">
        Página no encontrada
      </h1>

      <p className="text-gray-600 mb-6">
        La página que buscás no existe o ya no está disponible.
      </p>

      <Link
        href="/huerta"
        className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Mi Huerta
      </Link>
    </main>
  );
}