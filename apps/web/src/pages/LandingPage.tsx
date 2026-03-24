import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Music } from 'lucide-react';
import { useFestivals } from '@/hooks/useFestivals';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export function LandingPage() {
  const navigate = useNavigate();
  const { data: festivals, isPending, isError } = useFestivals();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  const years = festivals
    ? [
        ...new Set(festivals.map((f) => new Date(f.startDate).getFullYear())),
      ].sort()
    : [];

  const filtered = selectedYear
    ? festivals?.filter(
        (f) => new Date(f.startDate).getFullYear() === selectedYear,
      )
    : festivals;

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b border-border sticky top-0 bg-background z-10'>
        <div className='max-w-6xl mx-auto px-4 h-14 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 bg-foreground rounded-md flex items-center justify-center'>
              <Music className='w-4 h-4 text-background' />
            </div>
            <span className='font-medium text-sm'>Festival Planner</span>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/sign-out', {
                method: 'POST',
                credentials: 'include',
              });
              navigate('/login');
            }}
            className='text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className='bg-muted border-b border-border'>
        <div className='max-w-6xl mx-auto px-4 py-12 text-center'>
          <h1 className='text-3xl font-medium'>Festival Season</h1>
          <p className='text-sm text-muted-foreground mt-3 max-w-md mx-auto'>
            Explore lineups, build your schedule, and never miss a set.
          </p>

          {/* Year filter */}
          {years.length > 1 && (
            <div className='flex items-center justify-center gap-2 mt-6'>
              <button
                onClick={() => setSelectedYear(undefined)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                  !selectedYear
                    ? 'bg-foreground text-background'
                    : 'bg-background border border-border text-muted-foreground hover:text-foreground',
                )}
              >
                All
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedYear === y
                      ? 'bg-foreground text-background'
                      : 'bg-background border border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <main className='max-w-6xl mx-auto px-4 py-8'>
        {isPending && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='rounded-lg border border-border overflow-hidden animate-pulse'
              >
                <div className='h-44 bg-muted' />
                <div className='p-4 space-y-2'>
                  <div className='h-4 bg-muted rounded w-2/3' />
                  <div className='h-3 bg-muted rounded w-full' />
                  <div className='h-3 bg-muted rounded w-4/5' />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className='text-center py-20 text-sm text-muted-foreground'>
            Failed to load festivals. Please try again.
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <div className='text-center py-20 text-sm text-muted-foreground'>
            No festivals found{selectedYear ? ` for ${selectedYear}` : ''}.
          </div>
        )}

        {filtered && filtered.length > 0 && (
          <>
            <div className='flex items-baseline justify-between mb-5'>
              <h2 className='text-lg font-medium'>Upcoming Festivals</h2>
              <span className='text-sm text-muted-foreground'>
                {filtered.length} festival{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filtered.map((festival) => (
                <div
                  key={festival.id}
                  className='rounded-lg border border-border bg-card overflow-hidden cursor-pointer group transition-shadow hover:shadow-md'
                  onClick={() => navigate(`/festival/${festival.slug}`)}
                >
                  {/* Image */}
                  <div className='h-44 bg-muted overflow-hidden'>
                    {festival.imageUrl ? (
                      <img
                        src={festival.imageUrl}
                        alt={festival.name}
                        className='w-full h-full object-cover transition-transform group-hover:scale-105'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center'>
                        <Music className='w-8 h-8 text-muted-foreground opacity-30' />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className='p-4'>
                    <h3 className='font-medium text-sm leading-tight'>
                      {festival.name}
                    </h3>
                    {festival.shortDescription && (
                      <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>
                        {festival.shortDescription}
                      </p>
                    )}

                    <div className='mt-3 space-y-1.5'>
                      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <Calendar className='w-3.5 h-3.5 shrink-0' />
                        {format(new Date(festival.startDate), 'MMM d')}
                        {' – '}
                        {format(new Date(festival.endDate), 'MMM d, yyyy')}
                      </div>
                      <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                        <MapPin className='w-3.5 h-3.5 shrink-0' />
                        {festival.location}
                      </div>
                    </div>

                    <button
                      className='mt-4 w-full h-8 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity'
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/festival/${festival.slug}`);
                      }}
                    >
                      View Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
