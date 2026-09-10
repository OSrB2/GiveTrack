import { z } from "zod";

export const createDonorSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email().max(50),
});

export const updateDonorSchema = z.object({
  name: z.string().min(3).max(50).optional(),
  email: z.string().email().max(50).optional(),
})