import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';

interface ProtectedRouteProps {
  requiredRole?: 'admin';
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-sm text-muted-foreground'>Loading...</div>
      </div>
    );
  }

  if (!session) return <Navigate to='/login' replace />;

  if (requiredRole) {
    const user = session.user as { role?: string };
    if (user.role !== requiredRole) {
      return <Navigate to='/' replace />;
    }
  }

  return <Outlet />;
}
