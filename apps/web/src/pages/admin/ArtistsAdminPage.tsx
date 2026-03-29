import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Music } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminArtists, useDeleteArtist } from '@/hooks/useAdminArtists';

export function ArtistsAdminPage() {
  const navigate = useNavigate();
  const { data: artists, isPending, isError } = useAdminArtists();
  const deleteArtist = useDeleteArtist();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteArtist.mutateAsync(id);
      toast.success('Artist deleted');
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete artist');
    }
  };

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
        <div>
          <h1 className='text-xl font-medium'>Artists</h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            Manage the artist roster
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/artists/new')}
          className='flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity'
        >
          <Plus className='w-4 h-4' />
          Add Artist
        </button>
      </div>

      {isPending && (
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='h-14 rounded-lg border border-border bg-muted animate-pulse'
            />
          ))}
        </div>
      )}

      {isError && (
        <div className='text-sm text-muted-foreground text-center py-12'>
          Failed to load artists.
        </div>
      )}

      {artists && (
        <div className='border border-border rounded-lg overflow-hidden'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-muted/50'>
                <th className='text-left px-4 py-3 font-medium text-muted-foreground'>
                  Artist
                </th>
                <th className='text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell'>
                  Genre
                </th>
                <th className='text-right px-4 py-3 font-medium text-muted-foreground'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {artists.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className='px-4 py-12 text-center text-muted-foreground'
                  >
                    No artists yet. Add your first one.
                  </td>
                </tr>
              )}
              {artists.map((artist) => (
                <tr
                  key={artist.id}
                  className='border-b border-border last:border-0 hover:bg-muted/30 transition-colors'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      {artist.imageUrl ? (
                        <img
                          src={artist.imageUrl}
                          alt={artist.name}
                          className='w-8 h-8 rounded-full object-cover shrink-0'
                        />
                      ) : (
                        <div className='w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0'>
                          <Music className='w-3.5 h-3.5 text-muted-foreground' />
                        </div>
                      )}
                      <span className='font-medium'>{artist.name}</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground hidden md:table-cell'>
                    {artist.genre ?? '—'}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-1'>
                      <button
                        onClick={() =>
                          navigate(`/admin/artists/${artist.id}/edit`)
                        }
                        aria-label={`Edit ${artist.name}`}
                        className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
                      >
                        <Pencil aria-hidden='true' className='w-3.5 h-3.5' />
                      </button>
                      {confirmDelete === artist.id ? (
                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => handleDelete(artist.id)}
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
                          onClick={() => setConfirmDelete(artist.id)}
                          aria-label={`Delete ${artist.name}`}
                          className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors'
                        >
                          <Trash2 aria-hidden='true' className='w-3.5 h-3.5' />
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
