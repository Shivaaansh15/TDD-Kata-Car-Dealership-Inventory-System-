const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
  purchaseCar,
  restockCar,
} = require("../controllers/carController");

router.post("/", protect, createCar);

router.get("/", getCars);

router.get("/:id", getCarById);

router.put("/:id", protect, updateCar);

router.delete("/:id", protect, deleteCar);

router.patch("/:id/purchase", protect, purchaseCar);

router.patch("/:id/restock", protect, restockCar);

module.exports = router;