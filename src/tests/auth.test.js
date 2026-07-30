const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/register", () => {
  test("should register a new user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Narendra Modi",
        email: "modi@example.com",
        password: "password123",
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.name).toBe("Narendra Modi");
    expect(response.body.user.email).toBe("modi@example.com");
  });
});