import { z } from 'zod';

export const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
}); 