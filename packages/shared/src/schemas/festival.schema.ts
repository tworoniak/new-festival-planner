import { z } from 'zod';

export const CreateFestivalSchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  startDate: z.string().date(),
  endDate: z.string().date(),
  location: z.string().min(1),
  imageUrl: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
});

export const UpdateFestivalSchema = CreateFestivalSchema.partial();
export type CreateFestivalInput = z.infer<typeof CreateFestivalSchema>;
export type UpdateFestivalInput = z.infer<typeof UpdateFestivalSchema>;
