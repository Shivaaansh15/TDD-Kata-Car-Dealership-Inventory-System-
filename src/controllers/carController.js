const carService = require("../services/carService");

const createCar = async (req, res) => {
  try {
    const car = await carService.createCar(req.body);

    res.status(201).json({
      success: true,
      car,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCars = async (req, res) => {
  try {
    const cars = await carService.getCars();

    res.status(200).json({
      success: true,
      cars,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await carService.deleteCar(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const purchaseCar = async (req, res) => {
  try {
    const car = await carService.purchaseCar(req.params.id);

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const restockCar = async (req, res) => {
  try {
    const car = await carService.restockCar(
      req.params.id,
      req.body.quantity
    );

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
};