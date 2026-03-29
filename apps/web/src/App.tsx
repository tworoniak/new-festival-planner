import { BrowserRouter, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AnimatedRoutes } from '@/routes';

function Inner() {
  const location = useLocation();
  // Admin sub-routes share a key so only the inner Outlet animates, not the whole AdminLayout
  const routeKey = location.pathname.startsWith('/admin')
    ? '/admin'
    : location.pathname;
  return (
    <div style={{ overflow: 'hidden' }}>
      <AnimatePresence mode='wait' initial={false}>
        <AnimatedRoutes key={routeKey} />
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Inner />
      <Toaster richColors position='bottom-center' />
    </BrowserRouter>
  );
}
