require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require("./config/db");
connectDB();

const cors = require("cors");


app.use(cors());
app.use(express.json());

const driverRoutes = require("./routes/driversRoutes");
const routeRoutes = require("./routes/routesRoutes");
const orderRoutes = require("./routes/ordersRoutes");
const authRoutes = require("./routes/authRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

app.use("/api/drivers", driverRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/simulation", simulationRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error connecting to server ", err);
  }
  console.log("Server is running on PORT", PORT);
});
