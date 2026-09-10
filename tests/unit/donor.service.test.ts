import { describe, expect, it, vi} from "vitest";
import { createDonor, findDonorByEmail } from "../../src/repositories/donor.repository";
import { createDonorService} from "../../src/services/donor.service";

vi.mock("../../src/repositories/donor.repository.js", () => ({
  createDonor: vi.fn(),
  findDonorByEmail: vi.fn(),
}));

describe("Donor Service", () => {
  it("deve criar um doador quando o e-mail não existe", async () => {
    vi.mocked(findDonorByEmail).mockResolvedValue(undefined);

    const donor = {
      id: "123",
      name: "Novo Doador",
      email: "novo@email.com",
    };
    vi.mocked(createDonor).mockResolvedValue(donor);

    const result = await createDonorService(
      "Novo Doador",
      "novo@email.com"
    );
    
    expect(result).toEqual(donor);
    expect(findDonorByEmail).toHaveBeenCalledWith("novo@email.com");
    expect(createDonor).toHaveBeenCalledWith(
      "Novo Doador",
      "novo@email.com"
    )
  });

  it("não deve criar um doador quando o e-mail já existe", async () => {
  const existingDonor = {
    id: "123",
    name: "Doador Existente",
    email: "existente@email.com",
  };

  vi.mocked(findDonorByEmail).mockResolvedValue(existingDonor);

  await expect(
    createDonorService(
      "Novo Doador",
      "existente@email.com"
    )
  ).rejects.toThrow("E-mail já cadastrado");

  expect(createDonor).not.toHaveBeenCalled();
});
});