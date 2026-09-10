import { Request, Response } from 'express';
import { createDonorSchema, updateDonorSchema, paginationSchema } from '../schemas/donor.schema.js';
import {
  createDonorService,
  findAllDonorsService,
  findDonorByIdService,
  updateDonorService,
} from '../services/donor.service.js';
import { updateDonor } from '../repositories/donor.repository.js';

export async function createDonorController(req: Request, res: Response) {
  const data = createDonorSchema.parse(req.body);
  const donor = await createDonorService(data.name, data.email);

  return res.status(201).json(donor);
}

export async function findAllDonorsController(req: Request, res: Response) {
  const { page, limit } = paginationSchema.parse(req.query);
  const donors = await findAllDonorsService(page, limit);

  return res.status(200).json(donors);
}

export async function findDonorByIdController(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({
      message: 'ID inválido!',
    });
  }
  const donor = await findDonorByIdService(id);

  return res.status(200).json(donor);
}

export async function updateDonorController(req: Request, res: Response) {
  const { id } = req.params;

  if (typeof id !== 'string') {
    return res.status(400).json({
      message: 'ID inválido!',
    });
  }

  const data = updateDonorSchema.parse(req.body);
  const donor = await updateDonorService(id, data);
  return res.status(200).json(donor);
}
