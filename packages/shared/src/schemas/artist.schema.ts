import { z } from 'zod';

export const CreateArtistSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().url().optional(),
  genre: z.string().optional(),
  bio: z.string().optional(),
});

export const UpdateArtistSchema = CreateArtistSchema.partial();
export type CreateArtistInput = z.infer<typeof CreateArtistSchema>;
export type UpdateArtistInput = z.infer<typeof UpdateArtistSchema>;
