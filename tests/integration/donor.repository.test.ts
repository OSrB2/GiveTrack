import { beforeEach, describe, expect, it } from 'vitest';
import { pool } from '../../src/config/database';
import {
  findDonorByEmail,
  createDonor,
} from '../../src/repositories/donor.repository';

describe('Donor Repository', () => {
  beforeEach(async () => {
    await pool.query(
      'DELETE FROM donors WHERE email IN ($1, $2)',

      ['teste.repository@email.com', 'novo.doador@email.com'],
    );
  });

  it('deve encontrar um doador pelo e-mail', async () => {
    const email = 'teste.repository@email.com';

    await pool.query(
      `
        INSERT INTO donors (name, email)
        VALUES ($1, $2)
      `,
      ['Doador Teste', email],
    );

    const donor = await findDonorByEmail(email);

    expect(donor).toBeDefined();
    expect(donor.email).toBe(email);
  });

  it('deve criar um novo doador', async () => {
    const donor = await createDonor('Novo Doador', 'novo.doador@email.com');

    expect(donor).toBeDefined();
    expect(donor.name).toBe('Novo Doador');
    expect(donor.email).toBe('novo.doador@email.com');
  });
});
