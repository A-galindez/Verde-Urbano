'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sprout, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface Planta {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
}

export default function NuevaPlantaPage() {
  const router = useRouter();

  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [planta, setPlanta] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [fechaPlantacion, setFechaPlantacion] = useState(
    new Date().toLocaleDateString('en-CA')
  );
  const [notas, setNotas] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPlantas() {
      try {
        const datos = await fetchAPI('/plantas/');

        setPlantas(
          Array.isArray(datos)
            ? datos
            : datos.results ?? []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el catálogo de plantas.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPlantas();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!planta) {
      setError('Seleccioná una planta.');
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setError('La cantidad debe ser un número entero mayor a cero.');
      return;
    }

    if (!fechaPlantacion) {
      setError('Seleccioná una fecha de plantación.');
      return;
    }

    setGuardando(true);

    try {
      await fetchAPI('/huerta-usuario/', {
        method: 'POST',
        body: JSON.stringify({
          planta: Number(planta),
          cantidad,
          fecha_plantacion: fechaPlantacion,
          notas,
        }),
      });

      router.push('/huerta');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo agregar la planta.'
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/huerta"
        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-semibold mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver a Mi Huerta
      </Link>

      <div className="bg-white border border-emerald-100 rounded-3xl shadow-sm p-6 md:p-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-100 p-3 rounded-xl">
            <Sprout className="w-7 h-7 text-emerald-700" />
          </div>

          <h1 className="text-3xl font-bold text-emerald-950">
            Agregar planta
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Registrá una planta para comenzar a gestionar tu huerta.
        </p>

        {error && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6"
          >
            {error}
          </div>
        )}

        {cargando ? (
          <div className="flex items-center justify-center gap-3 py-10 text-emerald-700">
            <Loader2 className="w-6 h-6 animate-spin" />
            Cargando plantas...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="planta"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Planta
              </label>

              <select
                id="planta"
                value={planta}
                onChange={(e) => setPlanta(e.target.value)}
                required
                disabled={plantas.length === 0}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">Seleccioná una planta</option>

                {plantas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre_comun}
                    {item.nombre_cientifico
                      ? ` (${item.nombre_cientifico})`
                      : ''}
                  </option>
                ))}
              </select>

              {plantas.length === 0 && (
                <p className="text-sm text-amber-700 mt-2">
                  Todavía no hay plantas disponibles en el catálogo.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="cantidad"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Cantidad
              </label>

              <input
                id="cantidad"
                type="number"
                min="1"
                step="1"
                required
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="fechaPlantacion"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Fecha de plantación
              </label>

              <input
                id="fechaPlantacion"
                type="date"
                required
                value={fechaPlantacion}
                onChange={(e) => setFechaPlantacion(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label
                htmlFor="notas"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Notas
              </label>

              <textarea
                id="notas"
                rows={4}
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Por ejemplo: plantada en una maceta grande..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={guardando || plantas.length === 0}
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {guardando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}

                {guardando ? 'Guardando...' : 'Guardar planta'}
              </button>

              <Link
                href="/huerta"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}