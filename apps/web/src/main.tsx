// import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// import { QueryClientProvider } from '@tanstack/react-query';
// import { queryClient } from '@/lib/queryClient';
// import App from './App';
// import '@/styles/theme.css';

// // Apply persisted theme before first render to avoid flash
// const stored = localStorage.getItem('fp-theme');
// const dark = stored ? (JSON.parse(stored)?.state?.dark ?? true) : true;
// document.documentElement.classList.toggle('dark', dark);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <App />
//     </QueryClientProvider>
//   </StrictMode>,
// );

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import App from './App';
import './styles/theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
