import { z } from 'zod';

export const createDonorSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().max(50),
});

export const updateDonorSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().max(50).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
