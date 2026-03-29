import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Music, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { staggerContainer, staggerItem, heroContent } from '@/lib/animations';
import { useFestivals } from '@/hooks/useFestivals';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1600&q=80';

export function LandingPage() {
  const navigate = useNavigate();
  const { data: festivals, isPending, isError } = useFestivals();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [search, setSearch] = useState('');

  const years = useMemo(() => {
    if (!festivals) return [];
    return [
      ...new Set(festivals.map((f) => new Date(f.startDate).getFullYear())),
    ].sort();
  }, [festivals]);

  const filtered = useMemo(() => {
    if (!festivals) return [];
    return festivals.filter((f) => {
      const matchesYear = selectedYear
        ? new Date(f.startDate).getFullYear() === selectedYear
        : true;
      const matchesSearch = search
        ? f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.location.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesYear && matchesSearch;
    });
  }, [festivals, selectedYear, search]);

  return (
    <PageTransition>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='absolute top-0 left-0 right-0 z-20'>
          <div className='max-w-6xl mx-auto px-4 h-14 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='w-7 h-7 bg-white/15 backdrop-blur-sm rounded-md flex items-center justify-center border border-white/20'>
                <Music className='w-4 h-4 text-white' />
              </div>
              <span className='font-medium text-sm text-white'>
                <span className='hidden sm:inline'>
                  SetList - Festival Planner
                </span>
                <span className='sm:hidden'>SetList</span>
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <ThemeToggle className='border-white/20 text-white hover:bg-white/10' />
              <button
                onClick={async () => {
                  await fetch('/api/auth/sign-out', {
                    method: 'POST',
                    credentials: 'include',
                  });
                  navigate('/login');
                }}
                className='text-sm text-white/70 hover:text-white transition-colors'
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className='relative h-90 sm:h-96 md:h-120 overflow-hidden'>
          <img
            src={HERO_IMAGE}
            alt='Festival crowd'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/70' />

          <motion.div
            className='absolute inset-0 flex flex-col items-center justify-center px-4 text-center'
            variants={staggerContainer}
            initial='initial'
            animate='animate'
          >
            <motion.div variants={heroContent} className='flex items-center gap-2 mb-4'>
              <span className='logo-text animated-gradient-text tracking-wide'>
                SetList
              </span>
            </motion.div>
            <motion.h1
              variants={staggerItem}
              className='text-2xl md:text-4xl font-medium text-white leading-tight'
            >
              Your festival,
              <br className='block md:hidden' /> your schedule.
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className='text-white/70 text-sm md:text-base mt-4 max-w-md'
            >
              Explore lineups, build your schedule, and never miss a set.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={staggerItem} className='relative mt-8 w-full max-w-md'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50' />
              <input
                type='text'
                placeholder='Search festivals or locations...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full h-11 pl-10 pr-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/20 focus:border-white/40 transition-colors'
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Filters + Grid */}
        <main className='max-w-6xl mx-auto px-4 py-8'>
          {/* Year filter + results count */}
          <div className='flex items-center justify-between flex-wrap gap-3 mb-6'>
            <div className='flex items-center gap-2'>
              {years.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedYear(undefined)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                      !selectedYear
                        ? 'bg-foreground text-background'
                        : 'border border-border text-muted-foreground hover:text-foreground',
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
                          : 'border border-border text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {y}
                    </button>
                  ))}
                </>
              )}
            </div>
            {!isPending && (
              <span className='text-sm text-muted-foreground'>
                {filtered.length} festival{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Loading skeletons */}
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

          {!isPending && filtered.length === 0 && (
            <div className='text-center py-20 text-sm text-muted-foreground'>
              No festivals found
              {search
                ? ` for "${search}"`
                : selectedYear
                  ? ` in ${selectedYear}`
                  : ''}
              .
            </div>
          )}

          {/* Festival grid */}
          {!isPending && filtered.length > 0 && (
            <motion.div
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              variants={staggerContainer}
              initial='initial'
              animate='animate'
            >
              {filtered.map((festival) => (
                <motion.div
                  key={festival.id}
                  variants={staggerItem}
                  className='rounded-lg border border-border bg-card overflow-hidden cursor-pointer group transition-shadow hover:shadow-md flex flex-col'
                  onClick={() => navigate(`/festival/${festival.slug}`)}
                >
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
                  <div className='p-4 flex flex-col flex-1'>
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
                    <div className='mt-auto pt-4'>
                      <button
                        className='w-full h-8 rounded-md bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/festival/${festival.slug}`);
                        }}
                      >
                        View Schedule
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
