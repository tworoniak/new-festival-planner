import { z } from 'zod';

export const CreateSetSchema = z.object({
  stageId: z.string().uuid(),
  artistId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  day: z.number().int().min(1),
});

export const UpdateSetSchema = CreateSetSchema.partial();
export type CreateSetInput = z.infer<typeof CreateSetSchema>;
export type UpdateSetInput = z.infer<typeof UpdateSetSchema>;
