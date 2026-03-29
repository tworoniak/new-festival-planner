import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, CalendarDays, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  useAdminFestivals,
  useDeleteFestival,
} from '@/hooks/useAdminFestivals';
// import { cn } from '@/lib/utils';

export function FestivalsAdminPage() {
  const navigate = useNavigate();
  const { data: festivals, isPending, isError } = useAdminFestivals();
  const deleteFestival = useDeleteFestival();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteFestival.mutateAsync(id);
      toast.success('Festival deleted');
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete festival');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
        <div>
          <h1 className='text-xl font-medium'>Festivals</h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Manage festival listings
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/festivals/new')}
          className='flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity'
        >
          <Plus className='w-4 h-4' />
          Add Festival
        </button>
      </div>

      {/* Loading */}
      {isPending && (
        <div className='space-y-3'>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className='h-20 rounded-lg border border-border bg-muted animate-pulse'
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className='text-sm text-muted-foreground text-center py-12'>
          Failed to load festivals.
        </div>
      )}

      {/* Table */}
      {festivals && (
        <div className='border border-border rounded-lg overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-muted/50'>
                <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                  Festival
                </th>
                <th className='text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell'>
                  Location
                </th>
                <th className='text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell'>
                  Dates
                </th>
                <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {festivals.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className='px-4 py-12 text-center text-muted-foreground'
                  >
                    No festivals yet. Add your first one.
                  </td>
                </tr>
              )}
              {festivals.map((festival) => (
                <tr
                  key={festival.id}
                  className='border-b border-border last:border-0 hover:bg-muted/30 transition-colors'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      {festival.imageUrl ? (
                        <img
                          src={festival.imageUrl}
                          alt={festival.name}
                          className='w-10 h-10 rounded-md object-cover shrink-0'
                        />
                      ) : (
                        <div className='w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0'>
                          <CalendarDays className='w-4 h-4 text-muted-foreground' />
                        </div>
                      )}
                      <div>
                        <div className='font-medium'>{festival.name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {festival.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground hidden md:table-cell'>
                    <div className='flex items-center gap-1.5'>
                      <MapPin className='w-3.5 h-3.5 shrink-0' />
                      {festival.location}
                    </div>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground hidden md:table-cell'>
                    <div className='flex items-center gap-1.5'>
                      <CalendarDays className='w-3.5 h-3.5 shrink-0' />
                      {format(new Date(festival.startDate), 'MMM d')}
                      {' – '}
                      {format(new Date(festival.endDate), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      <button
                        onClick={() =>
                          navigate(`/admin/festivals/${festival.id}/schedule`)
                        }
                        className='h-8 px-3 rounded-md text-xs font-medium border border-border hover:bg-muted transition-colors'
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/festivals/${festival.id}/edit`)
                        }
                        className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
                        title='Edit'
                      >
                        <Pencil className='w-3.5 h-3.5' />
                      </button>
                      {confirmDelete === festival.id ? (
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => handleDelete(festival.id)}
                            className='h-8 px-3 rounded-md text-xs font-medium bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity'
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className='h-8 px-3 rounded-md text-xs border border-border hover:bg-muted transition-colors'
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(festival.id)}
                          className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors'
                          title='Delete'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
