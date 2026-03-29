import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Music,
  CalendarDays,
  Users,
  ArrowLeft,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { pageVariants, pageTransition } from '@/lib/animations';

const navItems = [
  { to: '/admin/festivals', label: 'Festivals', icon: CalendarDays },
  { to: '/admin/artists', label: 'Artists', icon: Users },
];

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Logo */}
      <div className='h-14 flex items-center gap-2 px-4 border-b border-sidebar-border'>
        <div className='w-7 h-7 bg-foreground rounded-md flex items-center justify-center'>
          <Music className='w-4 h-4 text-background' />
        </div>
        <div>
          <div className='text-sm font-medium leading-tight'>SetList</div>
          <div className='text-xs text-muted-foreground leading-tight'>
            Admin
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 px-2 py-3 space-y-0.5'>
        <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1'>
          Content
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-2 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )
            }
          >
            <Icon className='w-4 h-4 shrink-0' />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className='px-4 py-3 border-t border-sidebar-border space-y-2'>
        <button
          onClick={() => {
            onNavigate?.();
            navigate('/');
          }}
          className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full'
        >
          <ArrowLeft className='w-3.5 h-3.5' />
          Back to SetList
        </button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className='hidden lg:flex w-56 border-r border-border bg-sidebar flex-col fixed top-0 bottom-0 left-0 z-10'>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar + backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className='fixed inset-0 bg-black/40 z-40 lg:hidden'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className='fixed top-0 bottom-0 left-0 z-50 w-56 bg-sidebar border-r border-sidebar-border flex flex-col lg:hidden'
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className='absolute top-3.5 right-3 w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
              >
                <X className='w-4 h-4' />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className='flex-1 lg:ml-56 flex flex-col min-h-screen'>
        {/* Top bar */}
        <header className='h-14 border-b border-border bg-background sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-3'>
            <button
              className='lg:hidden w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
              onClick={() => setMobileOpen(true)}
            >
              <Menu className='w-4 h-4' />
            </button>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <LayoutDashboard className='w-4 h-4' />
              <span className='hidden sm:inline'>Admin Panel</span>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <AnimatePresence mode='wait' initial={false}>
          <motion.main
            key={location.pathname}
            className='flex-1 p-4 sm:p-6'
            variants={pageVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={pageTransition}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
