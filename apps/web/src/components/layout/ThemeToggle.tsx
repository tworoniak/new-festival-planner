import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className={cn(
        'w-8 h-8 rounded-md border border-border flex items-center justify-center',
        'text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
        className,
      )}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <Sun aria-hidden='true' className='w-3.5 h-3.5' />
      ) : (
        <Moon aria-hidden='true' className='w-3.5 h-3.5' />
      )}
    </button>
  );
}
