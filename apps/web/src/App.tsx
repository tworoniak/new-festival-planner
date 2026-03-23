import { AppRouter } from '@/routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors position='bottom-center' />
    </>
  );
}
