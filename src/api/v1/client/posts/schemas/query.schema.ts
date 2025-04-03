import { z } from 'zod';

export const querySchema = z.object({
  author_id: z.string().optional(),
  published: z.boolean().optional(),
}); 