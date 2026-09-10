import { describe, expect, it } from "vitest";
import { pool } from "../../src/config/database.js";

describe("Database", () => {
  it("deve conectar ao PostgreSQL", async () => {
    const result = await pool.query("SELECT 1 AS connected");

    expect(result.rows[0].connected).toBe(1);
  });
});