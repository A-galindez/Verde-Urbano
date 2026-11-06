'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, User, Mail, Lock, Sprout } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchAPI } from '../../lib/api';

const registroSchema = z.object({
  username: z.string()
    .trim()
    .min(3, 'El usuario debe tener al menos 3 caracteres'),

  email: z.email('Ingresá un correo electrónico válido'),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type RegistroForm = z.infer<typeof registroSchema>;

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroForm>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegistroForm) => {
    setError('');

    try {
      await fetchAPI('/registro/', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      router.push('/login');

    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al registrar el usuario.'
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-2xl text-emerald-800 mb-3">
            <Sprout className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-emerald-950">
            Creá tu cuenta
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Sumate a la comunidad huertera de VerdeUrbano
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Nombre de Usuario
            </label>

            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register('username')}
                aria-invalid={!!errors.username}
                placeholder="Tu usuario"
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
              htmlFor="email"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Correo Electrónico
            </label>

            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                aria-invalid={!!errors.email}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            {errors.email && (
              <p className="text-rose-600 text-xs mt-1">
                {errors.email.message}
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
                autoComplete="new-password"
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
            className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors shadow-md disabled:opacity-50 mt-2"
          >
            <UserPlus className="w-4 h-4" />

            {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
          </button>

        </form>

        <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
          ¿Ya tenés una cuenta?{' '}

          <Link
            href="/login"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Iniciá sesión
          </Link>
        </div>

      </div>
    </div>
  );
}