import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { FestivalDetailPage } from '@/pages/FestivalDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Protected — authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<LandingPage />} />
          <Route path='/festival/:slug' element={<FestivalDetailPage />} />
        </Route>

        {/* Protected — admin only */}
        <Route element={<ProtectedRoute requiredRole='admin' />}>
          <Route
            path='/admin/*'
            element={<div>Admin panel coming in Phase 5</div>}
          />
        </Route>

        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}
