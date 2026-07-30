const Car = require("../models/Car");

const createCar = async (carData) => {
  return await Car.create(carData);
};

const getCars = async () => {
  return await Car.find();
};

const getCarById = async (id) => {
  return await Car.findById(id);
};

const updateCar = async (id, data) => {
  return await Car.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteCar = async (id) => {
  return await Car.findByIdAndDelete(id);
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};