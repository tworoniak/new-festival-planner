// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { ProtectedRoute } from './ProtectedRoute';
// // import { LandingPage } from '@/pages/LandingPage';
// // import { FestivalDetailPage } from '@/pages/FestivalDetailPage';
// // import { LoginPage } from '@/pages/LoginPage';
// // import { RegisterPage } from '@/pages/RegisterPage';

// // export function AppRouter() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         {/* Public */}
// //         <Route path='/login' element={<LoginPage />} />
// //         <Route path='/register' element={<RegisterPage />} />

// //         {/* Protected — authenticated users */}
// //         <Route element={<ProtectedRoute />}>
// //           <Route path='/' element={<LandingPage />} />
// //           <Route path='/festival/:slug' element={<FestivalDetailPage />} />
// //         </Route>

// //         {/* Protected — admin only */}
// //         <Route element={<ProtectedRoute requiredRole='admin' />}>
// //           <Route
// //             path='/admin/*'
// //             element={<div>Admin panel coming in Phase 5</div>}
// //           />
// //         </Route>

// //         <Route path='*' element={<Navigate to='/' replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ProtectedRoute } from './ProtectedRoute';
// import { LandingPage } from '@/pages/LandingPage';
// import { FestivalDetailPage } from '@/pages/FestivalDetailPage';
// import { LoginPage } from '@/pages/LoginPage';
// import { RegisterPage } from '@/pages/RegisterPage';
// import { AdminLayout } from '@/pages/admin/AdminLayout';
// import { FestivalsAdminPage } from '@/pages/admin/FestivalsAdminPage';
// import { FestivalFormPage } from '@/pages/admin/FestivalFormPage';
// import { ArtistsAdminPage } from '@/pages/admin/ArtistsAdminPage';
// import { ArtistFormPage } from '@/pages/admin/ArtistFormPage';
// import { ScheduleAdminPage } from '@/pages/admin/ScheduleAdminPage';

// export function AppRouter() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public */}
//         <Route path='/login' element={<LoginPage />} />
//         <Route path='/register' element={<RegisterPage />} />

//         {/* Protected — authenticated users */}
//         <Route element={<ProtectedRoute />}>
//           <Route path='/' element={<LandingPage />} />
//           <Route path='/festival/:slug' element={<FestivalDetailPage />} />
//         </Route>

//         {/* Protected — admin only */}
//         <Route element={<ProtectedRoute requiredRole='admin' />}>
//           <Route path='/admin' element={<AdminLayout />}>
//             <Route index element={<Navigate to='/admin/festivals' replace />} />
//             <Route path='festivals' element={<FestivalsAdminPage />} />
//             <Route path='festivals/new' element={<FestivalFormPage />} />
//             <Route path='festivals/:id/edit' element={<FestivalFormPage />} />
//             <Route
//               path='festivals/:id/schedule'
//               element={<ScheduleAdminPage />}
//             />
//             <Route path='artists' element={<ArtistsAdminPage />} />
//             <Route path='artists/new' element={<ArtistFormPage />} />
//             <Route path='artists/:id/edit' element={<ArtistFormPage />} />
//           </Route>
//         </Route>

//         <Route path='*' element={<Navigate to='/' replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { FestivalDetailPage } from '@/pages/FestivalDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { FestivalsAdminPage } from '@/pages/admin/FestivalsAdminPage';
import { FestivalFormPage } from '@/pages/admin/FestivalFormPage';
import { ArtistsAdminPage } from '@/pages/admin/ArtistsAdminPage';
import { ArtistFormPage } from '@/pages/admin/ArtistFormPage';
import { ScheduleAdminPage } from '@/pages/admin/ScheduleAdminPage';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
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
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Navigate to='/admin/festivals' replace />} />
          <Route path='festivals' element={<FestivalsAdminPage />} />
          <Route path='festivals/new' element={<FestivalFormPage />} />
          <Route path='festivals/:id/edit' element={<FestivalFormPage />} />
          <Route
            path='festivals/:id/schedule'
            element={<ScheduleAdminPage />}
          />
          <Route path='artists' element={<ArtistsAdminPage />} />
          <Route path='artists/new' element={<ArtistFormPage />} />
          <Route path='artists/:id/edit' element={<ArtistFormPage />} />
        </Route>
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
