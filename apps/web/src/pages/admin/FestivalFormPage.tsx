import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import {
  useAdminFestival,
  useCreateFestival,
  useUpdateFestival,
} from '@/hooks/useAdminFestivals';
import { cn } from '@/lib/utils';

const FestivalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().min(1, 'Location is required'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  heroImageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

type FestivalInput = z.infer<typeof FestivalSchema>;

export function FestivalFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existing } = useAdminFestival(id ?? '');
  const createFestival = useCreateFestival();
  const updateFestival = useUpdateFestival();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FestivalInput>({ resolver: zodResolver(FestivalSchema) });

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        slug: existing.slug,
        description: existing.description ?? '',
        shortDescription: existing.shortDescription ?? '',
        startDate: existing.startDate?.slice(0, 10) ?? '',
        endDate: existing.endDate?.slice(0, 10) ?? '',
        location: existing.location,
        imageUrl: existing.imageUrl ?? '',
        heroImageUrl: existing.heroImageUrl ?? '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (data: FestivalInput) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || undefined,
      heroImageUrl: data.heroImageUrl || undefined,
    };
    try {
      if (isEdit) {
        await updateFestival.mutateAsync({ id: id!, data: payload });
        toast.success('Festival updated');
      } else {
        await createFestival.mutateAsync(payload);
        toast.success('Festival created');
      }
      navigate('/admin/festivals');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className='max-w-2xl'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={() => navigate('/admin/festivals')}
          aria-label='Back to festivals'
          className='w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors'
        >
          <ArrowLeft aria-hidden='true' className='w-4 h-4' />
        </button>
        <div>
          <h1 className='text-xl font-medium'>
            {isEdit ? 'Edit Festival' : 'New Festival'}
          </h1>
          <p className='text-sm text-muted-foreground mt-0.5'>
            {isEdit
              ? 'Update festival details'
              : 'Add a new festival to SetList'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Name + Slug */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='festival-name' className='text-sm font-medium'>Name</label>
            <input
              id='festival-name'
              {...register('name')}
              placeholder='Primavera Sound'
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
            <label htmlFor='festival-slug' className='text-sm font-medium'>Slug</label>
            <input
              id='festival-slug'
              {...register('slug')}
              placeholder='primavera-sound-2026'
              className={cn(
                'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring transition-colors font-mono',
                errors.slug && 'border-destructive',
              )}
            />
            {errors.slug && (
              <p className='text-xs text-destructive'>{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Short description */}
        <div className='space-y-1.5'>
          <label htmlFor='festival-short-desc' className='text-sm font-medium'>Short description</label>
          <input
            id='festival-short-desc'
            {...register('shortDescription')}
            placeholder='Indie, electronic & experimental sounds...'
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors',
              errors.shortDescription && 'border-destructive',
            )}
          />
          {errors.shortDescription && (
            <p className='text-xs text-destructive'>
              {errors.shortDescription.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div className='space-y-1.5'>
          <label htmlFor='festival-desc' className='text-sm font-medium'>Description</label>
          <textarea
            id='festival-desc'
            {...register('description')}
            rows={3}
            placeholder='Full description shown on the festival detail page...'
            className={cn(
              'w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors resize-none',
              errors.description && 'border-destructive',
            )}
          />
          {errors.description && (
            <p className='text-xs text-destructive'>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='festival-start-date' className='text-sm font-medium'>Start date</label>
            <input
              id='festival-start-date'
              type='date'
              {...register('startDate')}
              className={cn(
                'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring transition-colors',
                errors.startDate && 'border-destructive',
              )}
            />
            {errors.startDate && (
              <p className='text-xs text-destructive'>
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='festival-end-date' className='text-sm font-medium'>End date</label>
            <input
              id='festival-end-date'
              type='date'
              {...register('endDate')}
              className={cn(
                'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
                'focus:ring-2 focus:ring-ring transition-colors',
                errors.endDate && 'border-destructive',
              )}
            />
            {errors.endDate && (
              <p className='text-xs text-destructive'>
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className='space-y-1.5'>
          <label htmlFor='festival-location' className='text-sm font-medium'>Location</label>
          <input
            id='festival-location'
            {...register('location')}
            placeholder='Barcelona, Spain'
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors',
              errors.location && 'border-destructive',
            )}
          />
          {errors.location && (
            <p className='text-xs text-destructive'>
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Images */}
        <div className='space-y-1.5'>
          <label htmlFor='festival-image-url' className='text-sm font-medium'>Card image URL</label>
          <input
            id='festival-image-url'
            {...register('imageUrl')}
            placeholder='https://images.unsplash.com/...'
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
          <label htmlFor='festival-hero-image-url' className='text-sm font-medium'>Hero image URL</label>
          <input
            id='festival-hero-image-url'
            {...register('heroImageUrl')}
            placeholder='https://images.unsplash.com/...'
            className={cn(
              'w-full h-9 rounded-md border border-border bg-background px-3 text-sm outline-none',
              'focus:ring-2 focus:ring-ring transition-colors',
              errors.heroImageUrl && 'border-destructive',
            )}
          />
          {errors.heroImageUrl && (
            <p className='text-xs text-destructive'>
              {errors.heroImageUrl.message}
            </p>
          )}
        </div>

        {/* Actions */}
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
                : 'Create festival'}
          </button>
          <button
            type='button'
            onClick={() => navigate('/admin/festivals')}
            className='h-9 px-4 rounded-md border border-border text-sm hover:bg-muted transition-colors'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
