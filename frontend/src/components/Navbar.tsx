'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, BookOpen, ShoppingBag, Calendar, User, UserPlus, LogOut } from 'lucide-react';

export default function Navbar() {
  const [usuario, setUsuario] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userStored = localStorage.getItem('username');
    setUsuario(userStored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsuario(null);
    router.push('/login');
  };

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-wide hover:text-emerald-200 transition-colors">
          <Sprout className="w-7 h-7 text-emerald-400" />
          <span>VerdeUrbano</span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6 font-medium text-sm md:text-base">
          <Link href="/blog" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
            <BookOpen className="w-4 h-4" /> Blog
          </Link>
          <Link href="/huerta" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
            <Sprout className="w-4 h-4" /> Mi Huerta
          </Link>
          <Link href="/tienda" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
            <ShoppingBag className="w-4 h-4" /> Insumos
          </Link>
          <Link href="/talleres" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
            <Calendar className="w-4 h-4" /> Talleres
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-emerald-200">Hola, @{usuario}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" /> Salir
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <User className="w-4 h-4" /> Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-1 bg-white text-emerald-800 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}