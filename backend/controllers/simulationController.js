const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");
const SimulationResult = require("../models/SimulationResult");

exports.runSimulation = async (req, res) => {
  const { num_drivers, max_hours_per_driver } = req.body;

  if (!num_drivers || !max_hours_per_driver) {
    return res
      .status(400)
      .json({
        msg: "Please provide all simulation inputs: num_drivers, max_hours_per_driver",
      });
  }
  if (num_drivers <= 0 || max_hours_per_driver <= 0) {
    return res.status(400).json({ msg: "Inputs must be positive numbers." });
  }

  try {
    const allDrivers = await Driver.find();
    const allRoutes = await Route.find();
    const allOrders = await Order.find();

    if (num_drivers > allDrivers.length) {
      return res
        .status(400)
        .json({
          msg: `Input for drivers exceeds available drivers (${allDrivers.length})`,
        });
    }
    if (allOrders.length === 0 || allRoutes.length === 0) {
      return res
        .status(400)
        .json({
          msg: "No orders or routes available in the database to run a simulation.",
        });
    }

    const routeMap = new Map(allRoutes.map((route) => [route.route_id, route]));

      const selectedDrivers = allDrivers.slice(0, num_drivers);
      
    const driverStates = selectedDrivers.map((driver) => {
      const lastDayHours =
        driver.past_week_hours[driver.past_week_hours.length - 1] || 0;
      return {
        driverInfo: driver,
        is_fatigued: lastDayHours > 8,
        assigned_orders: [],
        total_work_minutes: 0,
      };
    });


    allOrders.forEach((order, index) => {
      driverStates[index % num_drivers].assigned_orders.push(order);
    });
      
    let total_penalties = 0;
    let total_bonuses = 0;
    let total_fuel_cost = 0;
    let on_time_count = 0;
    let late_count = 0;

    for (const driverState of driverStates) {
      for (const order of driverState.assigned_orders) {
        const route = routeMap.get(order.route_id);
        if (!route) continue; 


        let calculated_time_min = route.base_time_min;
        if (driverState.is_fatigued) {
          calculated_time_min *= 1.3; // 30% speed decrease
        }

        driverState.total_work_minutes += calculated_time_min;

        const late_threshold = route.base_time_min + 10;
        const is_late = calculated_time_min > late_threshold;

        let penalty = 0;
        if (is_late) {
          late_count++;
          penalty = 50; 
        } else {
          on_time_count++;
        }

        let bonus = 0;
        if (order.value_rs > 1000 && !is_late) {
          bonus = order.value_rs * 0.1;
        }

        let fuel_cost = route.distance_km * 5; 
        if (route.traffic_level === "High") {
          fuel_cost += route.distance_km * 2; 
        }

        total_penalties += penalty;
        total_bonuses += bonus;
        total_fuel_cost += fuel_cost;
      }
    }

    const total_order_value = allOrders.reduce(
      (sum, order) => sum + order.value_rs,
      0
    );
    const total_profit =
      total_order_value + total_bonuses - total_penalties - total_fuel_cost;
    const efficiency_score = (on_time_count / allOrders.length) * 100;

   
    const newResult = new SimulationResult({
      total_profit,
      efficiency_score,
      on_time_deliveries: on_time_count,
      late_deliveries: late_count,
      fuel_cost: total_fuel_cost,
    });

    await newResult.save();

    res.json({
      total_profit: total_profit.toFixed(2),
      efficiency_score: efficiency_score.toFixed(2),
      on_time_deliveries: on_time_count,
      late_deliveries: late_count,
      fuel_cost_breakdown: {

        total: total_fuel_cost.toFixed(2),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


exports.getSimulationHistory = async (req, res) => {
  try {
    const history = await SimulationResult.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
