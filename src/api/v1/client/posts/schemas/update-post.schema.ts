import { z } from 'zod';

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  published: z.boolean().optional(),
}); 