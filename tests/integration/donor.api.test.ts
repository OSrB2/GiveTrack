import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { pool } from '../../src/config/database';
import app from '../../src/app';

// Todos os e-mails usados neste arquivo, centralizados num só lugar.
// Assim a limpeza do banco não depende de cada teste "lembrar" de apagar
// o que criou, e novos testes só precisam adicionar o e-mail aqui.
const TEST_EMAILS = [
  'doador.api@email.com',
  'jo@email.com',
  'duplicado@email.com',
  'doador1@email.com',
  'doador2@email.com',
  'teste-get-id@email.com',
  'patch-donor@email.com',
];

async function cleanupDonors() {
  await pool.query('DELETE FROM donors WHERE email = ANY($1)', [TEST_EMAILS]);
}

describe('POST /donors', () => {
  // Remove qualquer sobra de uma execução anterior que tenha falhado
  // antes de terminar de limpar.
  beforeAll(cleanupDonors);

  // Roda depois de CADA teste (não só do primeiro), então uma falha no
  // meio do arquivo não deixa dado "sujo" para os testes seguintes.
  afterEach(cleanupDonors);

  afterAll(async () => {
    await pool.end();
  });

  it('deve criar um novo doador', async () => {
    const response = await request(app).post('/donors').send({
      name: 'Doador API',
      email: 'doador.api@email.com',
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Doador API',
      email: 'doador.api@email.com',
    });
  });

  it('deve retornar 400 quando o nome for inválido', async () => {
    const response = await request(app).post('/donors').send({
      name: 'Jo',
      email: 'jo@email.com',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
  });

  it('deve retornar 400 quando o e-mail for inválido', async () => {
    const response = await request(app).post('/donors').send({
      name: 'Doador Teste',
      email: 'email-invalido',
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Dados inválidos');
  });

  it('deve retornar 400 quando o e-mail já estiver cadastrado', async () => {
    const email = 'duplicado@email.com';

    await request(app).post('/donors').send({
      name: 'Primeiro Doador',
      email,
    });

    const response = await request(app).post('/donors').send({
      name: 'Segundo Doador',
      email,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('E-mail já cadastrado');
  });

  it('deve retornar um array contendo todos os donors', async () => {
    const donor1 = await pool.query(
      `INSERT INTO donors (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ['Doador Primeiro', 'doador1@email.com'],
    );

    const donor2 = await pool.query(
      `INSERT INTO donors (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ['Doador Segundo', 'doador2@email.com'],
    );

    const response = await request(app).get('/donors');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: donor1.rows[0].id,
          name: donor1.rows[0].name,
          email: donor1.rows[0].email,
        }),
        expect.objectContaining({
          id: donor2.rows[0].id,
          name: donor2.rows[0].name,
          email: donor2.rows[0].email,
        }),
      ]),
    );
  });

  it('deve retornar um donor buscado pelo ID', async () => {
    const donor = await pool.query(
      `INSERT INTO donors (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ['Doador Primeiro', 'teste-get-id@email.com'],
    );

    const id = donor.rows[0].id;

    const response = await request(app).get(`/donors/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: donor.rows[0].id,
      name: donor.rows[0].name,
      email: donor.rows[0].email,
    });
  });

  it('deve atualizar o nome de um donor', async () => {
    const donor = await pool.query(
      `INSERT INTO donors (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      ['Doador Original', 'patch-donor@email.com'],
    );

    const id = donor.rows[0].id;

    const response = await request(app).patch(`/donors/${id}`).send({
      name: 'Doador Atualizado',
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id,
      name: 'Doador Atualizado',
      email: 'patch-donor@email.com',
    });
  });
});
