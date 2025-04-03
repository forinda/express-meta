import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  age: z.number().min(18).optional()
});

export const querySchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional()
});

export const paramsSchema = z.object({
  id: z.string().uuid()
}); 