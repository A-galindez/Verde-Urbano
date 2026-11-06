import { Loader2, Sprout } from 'lucide-react';

export default function LoadingHuerta() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Sprout className="w-12 h-12 text-emerald-700" />

      <div className="flex items-center gap-3 text-emerald-800">
        <Loader2 className="w-6 h-6 animate-spin" />

        <p className="font-semibold">
          Cargando Mi Huerta...
        </p>
      </div>
    </main>
  );
}