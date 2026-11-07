'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Loader2, ShieldAlert } from 'lucide-react';
import { fetchAPI } from '@/lib/api';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    async function verificarPermisos() {
      try {
        const usuario = await fetchAPI('/mi-usuario/');
        setAutorizado(usuario.is_staff === true);
      } catch {
        setAutorizado(false);
      } finally {
        setVerificando(false);
      }
    }

    void verificarPermisos();
  }, []);

  if (verificando) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center gap-3 text-emerald-700">
        <Loader2 className="w-6 h-6 animate-spin" />
        Verificando permisos...
      </main>
    );
  }

  if (!autorizado) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto mb-4" />

          <h1 className="text-xl font-bold text-red-800 mb-3">
            Acceso restringido
          </h1>

          <p className="text-gray-700 mb-6">
            Esta sección está disponible solamente para administradores.
          </p>

          <Link
            href="/talleres"
            className="inline-block bg-emerald-700 text-white px-6 py-3 rounded-xl hover:bg-emerald-800"
          >
            Volver a talleres
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}