import { redirect } from 'next/navigation';
import { getSession } from '@/app/lib/model';
import AdminShell from './AdminShell';
import './wordpress.css';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');
  return <AdminShell username={session.username}>{children}</AdminShell>;
}
