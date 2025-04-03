import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  age: z.number().optional(),
});

export const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const paramsSchema = z.object({
  id: z.string().uuid(),
}); 