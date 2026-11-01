'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sprout,
  BookOpen,
  ShoppingBag,
  Calendar,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('username');
    setUsername(user);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    setUsername(null);

    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="bg-emerald-900 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-100"
        >
          <Sprout className="w-6 h-6 text-emerald-400" />
          <span>VerdeUrbano</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-emerald-100">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Blog
          </Link>

          <Link
            href="/huerta"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Sprout className="w-4 h-4" />
            Mi Huerta
          </Link>

          <Link
            href="/insumos"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Insumos
          </Link>

          <Link
            href="/talleres"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Talleres
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {username ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold bg-emerald-800 px-3 py-1.5 rounded-lg text-emerald-200 border border-emerald-700 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Hola, @{username}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow"
              >
                <LogOut className="w-3.5 h-3.5" />
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-700"
              >
                <LogIn className="w-3.5 h-3.5" />
                Ingresar
              </Link>

              <Link
                href="/registro"
                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-3 py-1.5 rounded-lg transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}