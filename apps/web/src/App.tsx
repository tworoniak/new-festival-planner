import { BrowserRouter, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { AnimatedRoutes } from '@/routes';

function Inner() {
  const location = useLocation();
  return (
    <div style={{ overflow: 'hidden' }}>
      <AnimatePresence mode='wait' initial={false}>
        <AnimatedRoutes key={location.pathname} />
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
