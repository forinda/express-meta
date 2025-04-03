import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  author_id: z.string().min(1, 'Author ID is required'),
  published: z.boolean().default(false),
}); 