import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';

interface ProtectedRouteProps {
  requiredRole?: 'admin';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) return null; // or a loading spinner

  if (!session) return <Navigate to='/login' replace />;

  if (requiredRole && session.user?.role !== requiredRole) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
