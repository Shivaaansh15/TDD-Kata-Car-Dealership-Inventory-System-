const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚗 Lets Go! Server running on port ${PORT}`);
});