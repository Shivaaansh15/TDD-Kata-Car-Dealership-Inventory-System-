require("dotenv").config();
const connectDB=require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();
const carRoutes = require("./routes/carRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/cars", carRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Car Dealership Inventory API is running!"
  });
});
connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚗 Lets Go! Server running on port ${PORT}`);
});