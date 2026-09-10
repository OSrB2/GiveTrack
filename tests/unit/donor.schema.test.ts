import { createDonorSchema } from './../../src/schemas/donor.schema';
import { describe, expect, it } from 'vitest';

describe("Create Donor Schema", () => {
  it("deve aceitar dados válidos", () => {
    const donor = {
      name: "Pedro Oliveira",
      email: "pedro@email.com"
    };
    const result = createDonorSchema.safeParse(donor);

    expect(result.success).toBe(true);
  });
});

it("não deve aceitar nome com mais de 50 caracteres", () => {

  const donor = {

    name: "A".repeat(51),

    email: "teste@email.com",

  };

  const result = createDonorSchema.safeParse(donor);

  expect(result.success).toBe(false);

});

it("não deve aceitar e-mail inválido", () => {

  const donor = {

    name: "João Silva",

    email: "email-invalido",

  };

  const result = createDonorSchema.safeParse(donor);

  expect(result.success).toBe(false);

});

it("não deve aceitar e-mail com mais de 50 caracteres", () => {

  const donor = {

    name: "João Silva",

    email: `${"a".repeat(42)}@email.com`,

  };

  const result = createDonorSchema.safeParse(donor);

  expect(result.success).toBe(false);

});