const express = require("express");

const router = express.Router();

const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
} = require("../controllers/carController");

router.post("/", createCar);

router.get("/", getCars);

router.get("/:id", getCarById);

router.put("/:id", updateCar);

router.delete("/:id", deleteCar);
router.patch("/:id/purchase", purchaseCar);

router.patch("/:id/restock", restockCar);

module.exports = router;