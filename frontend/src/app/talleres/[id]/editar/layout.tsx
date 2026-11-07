import type { ReactNode } from 'react';
import AdminGuard from '@/components/AdminGuard';

export default function EditarTallerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}