'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorHuerta({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle className="w-14 h-14 text-red-600 mb-4" />

      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        Ocurrió un error
      </h1>

      <p className="text-gray-600 mb-6">
        No pudimos cargar esta sección de Mi Huerta.
        Intentá nuevamente.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-3 rounded-xl"
      >
        <RefreshCw className="w-5 h-5" />
        Reintentar
      </button>
    </main>
  );
}