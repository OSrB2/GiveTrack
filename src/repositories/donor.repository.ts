import { pool } from '../config/database.js';

export async function findDonorByEmail(email: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM donors
    WHERE email = $1
      AND deleted_at IS NULL`,
    [email],
  );

  return result.rows[0];
}

export async function createDonor(name: string, email: string) {
  const result = await pool.query(
    `
      INSERT INTO donors (name, email)
      VALUES ($1, $2)
      RETURNING *
    `,
    [name, email],
  );

  return result.rows[0];
}

export async function getAllDonors(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `
    SELECT * FROM donors 
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT $1
    OFFSET $2
    `,
    [limit, offset],
  );

  return result.rows;
}

export async function findDonorById(id: string) {
  const result = await pool.query(
    `
    SELECT * FROM donors 
    WHERE id = $1
      AND deleted_at IS NULL`,
      [id]
  );
  return result.rows[0];
}

export async function updateDonor(
  id: string,
  name: string,
  email: string
) {
  const result = await pool.query(
    `
      UPDATE donors
      SET name = $1,
          email = $2,
          updated_at = NOW()
      WHERE id = $3
        AND deleted_at IS NULL
      RETURNING *
    `,
    [name, email, id]
  );
  return result.rows[0];
}
