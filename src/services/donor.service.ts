import { AppError } from '../errors/app-error.js';
import {
  createDonor,
  findDonorByEmail,
  findDonorById,
  getAllDonors,
  updateDonor,
} from '../repositories/donor.repository.js';

export async function createDonorService(name: string, email: string) {
  const existingDonor = await findDonorByEmail(email);

  if (existingDonor) {
    throw new AppError('E-mail já cadastrado', 400);
  }

  return createDonor(name, email);
}

export async function findAllDonorsService() {
  const donors = await getAllDonors();

  return donors;
}

export async function findDonorByIdService(id: string) {
  const existingDonor = await findDonorById(id);

  if (!existingDonor) {
    throw new AppError('Usuário não encontrado', 404);
  }
  return existingDonor;
}

export async function updateDonorService(
  id: string,
  data: {
    name?: string;
    email?: string;
  },
) {
  const existingDonor = await findDonorById(id);

  if (!existingDonor) {
    throw new AppError('Usuário não encontrado', 404);
  }

  const name = data.name ?? existingDonor.name;
  const email = data.email ?? existingDonor.email;
  return updateDonor(id, name, email);
}
