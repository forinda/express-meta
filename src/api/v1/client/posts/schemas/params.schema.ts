import { z } from 'zod';

export const paramsSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
}); 