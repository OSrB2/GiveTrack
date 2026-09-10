import { Request, Response } from 'express';
import { describe, expect, it, vi} from "vitest";
import { createDonorController } from "../../src/controllers/donor.controller";
import { createDonorService } from "../../src/services/donor.service";

vi.mock("../../src/services/donor.service.ts", () => ({
  createDonorService: vi.fn(),
}));

describe("Donor Controller", () => {
  it("deve criar um doador e retornar 201", async () => {
    const donor = {
      id: "123",
      name: "Novo Doador",
      email: "novo@email.com",
    }

    vi.mocked(createDonorService).mockResolvedValue(donor);

    const req = {
      body: {
        name: "Novo Doador",
        email: "novo@email.com",
      },
    } as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;

    await createDonorController(req, res);

    expect(createDonorService).toHaveBeenCalledWith(
      "Novo Doador",
      "novo@email.com"
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(donor);
  })
})