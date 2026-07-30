const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const connectDB = require("../config/db");
const Car = require("../models/Car");

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  await Car.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Vehicle CRUD", () => {

  test("should create a vehicle", async () => {
    const response = await request(app)
      .post("/api/cars")
      .send({
        brand: "Toyota",
        model: "Camry",
        year: 2024,
        price: 3500000,
        quantity: 10,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test("should get all vehicles", async () => {
    await Car.create({
      brand: "Toyota",
      model: "Camry",
      year: 2024,
      price: 3500000,
      quantity: 10,
    });

    const response = await request(app).get("/api/cars");

    expect(response.statusCode).toBe(200);
    expect(response.body.cars.length).toBe(1);
  });

  test("should update a vehicle", async () => {
    const car = await Car.create({
      brand: "Toyota",
      model: "Camry",
      year: 2024,
      price: 3500000,
      quantity: 10,
    });

    const response = await request(app)
      .put(`/api/cars/${car._id}`)
      .send({
        price: 4000000,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.car.price).toBe(4000000);
  });

  test("should delete a vehicle", async () => {
    const car = await Car.create({
      brand: "Toyota",
      model: "Camry",
      year: 2024,
      price: 3500000,
      quantity: 10,
    });

    const response = await request(app)
      .delete(`/api/cars/${car._id}`);

    expect(response.statusCode).toBe(200);
  });

});