import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import {
  useAdminArtist,
  useCreateArtist,
  useUpdateArtist,
} from '@/hooks/useAdminArtists';
import { cn } from '@/lib/utils';

const ArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  genre: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  bio: z.string().optional(),
});

type ArtistInput = z.infer<typeof ArtistSchema>;

export function ArtistFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing } = useAdminArtist(id ?? '');
  const createArtist = useCreateArtist();
  const updateArtist = useUpdateArtist();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArtistInput>({ resolver: zodResolver(ArtistSchema) });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        genre: existing.genre ?? '',
        imageUrl: existing.imageUrl ?? '',
        bio: existing.bio ?? '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (data: ArtistInput) => {
    const payload = {
      ...data,
      genre: data.genre || undefined,
      imageUrl: data.imageUrl || undefined,
      bio: data.bio || undefined,
    };
    try {
      if (isEdit) {
        await updateArtist.mutateAsync({ id: id!, data: payload });
        toast.success('Artist updated');
      } else {
        await createArtist.mutateAsync(payload);
        toast.success('Artist created');
      }
      navigate('/admin/artists');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className='max-w-lg'>
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={() => navigate('/admin/artists')}
          aria-label='Back to artists'
          className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
        >
          <ArrowLeft aria-hidden='true' className='w-4 h-4' />
        </button>
        <div>
          <h1 className='text-xl font-medium'>
            {isEdit ? 'Edit Artist' : 'New Artist'}
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            {isEdit ? 'Update artist details' : 'Add a new artist to SetList'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        <div className='space-y-1.5'>
          <label className='text-sm font-medium'>Name</label>
          <input
            {...register('name')}
            placeholder='Artist name'
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors',
              errors.name && 'border-destructive',
            )}
          />
          {errors.name && (
            <p className='text-xs text-destructive'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium'>Genre</label>
          <input
            {...register('genre')}
            placeholder='e.g. Indie Rock, Techno, Jazz'
            className='w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium'>Image URL</label>
          <input
            {...register('imageUrl')}
            placeholder='https://...'
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors',
              errors.imageUrl && 'border-destructive',
            )}
          />
          {errors.imageUrl && (
            <p className='text-xs text-destructive'>
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className='space-y-1.5'>
          <label className='text-sm font-medium'>Bio</label>
          <textarea
            {...register('bio')}
            rows={4}
            placeholder='Short artist biography...'
            className='w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition-colors resize-none'
          />
        </div>

        <div className='flex items-center gap-3 pt-2'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='h-9 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity'
          >
            {isSubmitting
              ? isEdit
                ? 'Saving...'
                : 'Creating...'
              : isEdit
                ? 'Save changes'
                : 'Create artist'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/admin/artists')}
            className='h-9 px-4 rounded-md border border-border text-sm hover:bg-muted transition-colors'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
