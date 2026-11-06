'use client';

import { Search } from 'lucide-react';

interface BuscadorTalleresProps {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export default function BuscadorTalleres({
  busqueda,
  setBusqueda,
}: BuscadorTalleresProps) {
  return (
    <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm mb-8">
      <label
        htmlFor="busqueda"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Buscar talleres
      </label>

      <div className="relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

        <input
          id="busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por título, profesor, lugar o descripción..."
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>
    </div>
  );
}