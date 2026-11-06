'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, User, Lock, Leaf } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchAPI } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'Ingresá tu usuario'),
  password: z.string().min(1, 'Ingresá tu contraseña'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUsername } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');

    try {
      const res = await fetchAPI('/token/', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (res.access && res.refresh) {
        localStorage.setItem('token', res.access);
        localStorage.setItem('refreshToken', res.refresh);
        localStorage.setItem('username', data.username);

        setUsername(data.username);

        router.push('/');
        router.refresh();
      } else {
        setError('Respuesta inválida del servidor.');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Usuario o contraseña incorrectos.'
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl text-emerald-800 mb-3">
            <Leaf className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-emerald-950">
            ¡Hola de nuevo!
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Ingresá a tu cuenta de VerdeUrbano
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Usuario
            </label>

            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username')}
                aria-invalid={!!errors.username}
                placeholder="Nombre de usuario"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {errors.username && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Contraseña
            </label>

            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                aria-invalid={!!errors.password}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {errors.password && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          ¿Todavía no tenés cuenta?{' '}
          <Link
            href="/registro"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Registrate acá
          </Link>
        </div>
      </div>
    </div>
  );
}