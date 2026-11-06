'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  Droplets,
  Plus,
  Loader2,
} from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import HuertaCard from '@/components/HuertaCard';
import RecordatorioCard from '@/components/RecordatorioCard';

interface Planta {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  frecuencia_riego_dias: number;
}

interface Huerta {
  id: number;
  planta: number;
  planta_detalle: Planta;
  cantidad: number;
  fecha_plantacion: string;
  notas: string;
}

interface Recordatorio {
  planta: string;
  frecuencia_dias: number;
  fecha_plantacion: string;
  consejo: string;
}

export default function MiHuertaPage() {
  const [huertas, setHuertas] = useState<Huerta[]>([]);
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [error, setError] = useState('');

  const cargarHuerta = useCallback(async () => {
    try {
      setError('');

      const [datosHuerta, datosCalendario] = await Promise.all([
        fetchAPI('/huerta-usuario/'),
        fetchAPI('/huerta-usuario/mi_calendario/'),
      ]);

      setHuertas(
        Array.isArray(datosHuerta)
          ? datosHuerta
          : datosHuerta.results ?? []
      );

      setRecordatorios(datosCalendario.calendario ?? []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar la huerta.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    const iniciarCarga = async () => {
      await cargarHuerta();
    };

    void iniciarCarga();
  }, [cargarHuerta]);

  const eliminarPlanta = async (id: number, nombre: string) => {
    const confirmar = window.confirm(
      `¿Estás segura de que querés eliminar ${nombre} de tu huerta?`
    );

    if (!confirmar) {
      return;
    }

    setEliminando(id);
    setError('');

    try {
      await fetchAPI(`/huerta-usuario/${id}/`, {
        method: 'DELETE',
      });

      await cargarHuerta();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar la planta.'
      );
    } finally {
      setEliminando(null);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-950 flex items-center gap-3">
            <Sprout className="w-8 h-8 text-emerald-700" />
            Mi Huerta
          </h1>

          <p className="text-gray-600 mt-2">
            Administrá tus plantas y consultá sus cuidados.
          </p>
        </div>

        <Link
          href="/huerta/nueva"
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          Agregar planta
        </Link>
      </div>

      {cargando && (
        <div className="flex justify-center items-center gap-3 py-16 text-emerald-700">
          <Loader2 className="w-6 h-6 animate-spin" />
          Cargando mi huerta...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl mb-6"
        >
          <p>{error}</p>
        </div>
      )}

      {!cargando && (
        <>
          {huertas.length === 0 && !error ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-10 text-center">
              <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-4" />

              <h2 className="text-xl font-bold text-emerald-950 mb-2">
                Todavía no agregaste plantas
              </h2>

              <p className="text-gray-600">
                Comenzá registrando tu primera planta.
              </p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {huertas.map((huerta) => (
                <HuertaCard
                  key={huerta.id}
                  huerta={huerta}
                  eliminando={eliminando}
                  eliminarPlanta={eliminarPlanta}
                />
              ))}
            </section>
          )}

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-emerald-950 flex items-center gap-2 mb-6">
              <Droplets className="w-7 h-7 text-blue-500" />
              Calendario de riego
            </h2>

            {recordatorios.length === 0 ? (
              <p className="text-gray-600">
                Todavía no hay recordatorios de riego.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recordatorios.map((recordatorio, index) => (
                  <RecordatorioCard
                    key={index}
                    recordatorio={recordatorio}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}