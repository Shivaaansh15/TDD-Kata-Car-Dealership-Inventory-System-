const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/User");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

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

  test("should save the user in the database", async () => {
    const userData = {
      name: "Narendra Modi",
      email: "modi@example.com",
      password: "password123",
    };

    await request(app)
      .post("/api/auth/register")
      .send(userData);

    const savedUser = await User.findOne({
      email: userData.email,
    });

    expect(savedUser).not.toBeNull();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

});