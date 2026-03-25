import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Music,
  CalendarDays,
  Users,
  ArrowLeft,
  LayoutDashboard,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/festivals', label: 'Festivals', icon: CalendarDays },
  { to: '/admin/artists', label: 'Artists', icon: Users },
];

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-background flex'>
      {/* Sidebar */}
      <aside className='w-56 border-r border-border bg-sidebar flex flex-col fixed top-0 bottom-0 left-0 z-10'>
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
            onClick={() => navigate('/')}
            className='flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full'
          >
            <ArrowLeft className='w-3.5 h-3.5' />
            Back to SetList
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className='flex-1 ml-56 flex flex-col min-h-screen'>
        {/* Top bar */}
        <header className='h-14 border-b border-border bg-background sticky top-0 z-10 flex items-center justify-between px-6'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <LayoutDashboard className='w-4 h-4' />
            Admin Panel
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
