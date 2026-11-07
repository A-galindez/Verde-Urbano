'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HuertaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!token && !refreshToken) {
      router.replace('/login');
      return;
    }

    setAutorizado(true);
    setVerificando(false);
  }, [router]);

  if (verificando || !autorizado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center gap-3 text-emerald-700">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30">
      {children}
    </div>
  );
}