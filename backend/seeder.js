const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const csv = require("csv-parser");

dotenv.config(); 

const Driver = require("./models/Driver");
const Route = require("./models/Route");
const Order = require("./models/Order");

const parseCsv = (filePath) => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");

    await Driver.deleteMany();
    await Route.deleteMany();
    await Order.deleteMany();
    console.log("Old data destroyed...");

    const driversData = await parseCsv(
      path.join(__dirname, "data", "drivers.csv")
    );
    const routesData = await parseCsv(
      path.join(__dirname, "data", "routes.csv")
    );
    const ordersData = await parseCsv(
      path.join(__dirname, "data", "orders.csv")
    );


    const driversToInsert = driversData.map((row) => ({
      name: row.name,
      shift_hours: parseInt(row.shift_hours, 10),
      past_week_hours: row.past_week_hours.split("|").map(Number),
    }));

    const routesToInsert = routesData.map((row) => ({
      route_id: parseInt(row.route_id, 10),
      distance_km: parseFloat(row.distance_km),
      traffic_level: row.traffic_level,
      base_time_min: parseInt(row.base_time_min, 10),
    }));

    const ordersToInsert = ordersData.map((row) => ({
      order_id: parseInt(row.order_id, 10),
      value_rs: parseFloat(row.value_rs),
      route_id: parseInt(row.route_id, 10),
      delivery_time: row.delivery_time,
    }));

    await Driver.insertMany(driversToInsert);
    await Route.insertMany(routesToInsert);
    await Order.insertMany(ordersToInsert);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (err) {
    console.error("Error during data import:", err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected...");

    await Driver.deleteMany();
    await Route.deleteMany();
    await Order.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (err) {
    console.error("Error during data deletion:", err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log(
    "Please use the '-i' flag to import data or '-d' to delete data."
  );
}
