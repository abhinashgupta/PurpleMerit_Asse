const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");
const SimulationResult = require("../models/SimulationResult");

exports.runSimulation = async (req, res) => {
  const { num_drivers, max_hours_per_driver } = req.body;

  if (!num_drivers || !max_hours_per_driver) {
    return res
      .status(400)
      .json({ msg: "Please provide all simulation inputs." });
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
        .json({ msg: "No orders or routes available to run a simulation." });
    }

    const routeMap = new Map(allRoutes.map((route) => [route.route_id, route]));
    const selectedDrivers = allDrivers.slice(0, num_drivers);

    const driverStates = selectedDrivers.map((driver) => ({
      driverInfo: driver,
      is_fatigued:
        (driver.past_week_hours[driver.past_week_hours.length - 1] || 0) > 8,
      assigned_orders: [],
      total_work_minutes: 0,
    }));

    allOrders.forEach((order, index) => {
      driverStates[index % num_drivers].assigned_orders.push(order);
    });

    let total_penalties = 0;
    let total_bonuses = 0;
    let on_time_count = 0;
    let late_count = 0;
    let total_base_fuel_cost = 0;
    let total_surcharge_cost = 0;

    for (const driverState of driverStates) {
      for (const order of driverState.assigned_orders) {
        const route = routeMap.get(order.route_id);
        if (!route) continue;

        let calculated_time_min = route.base_time_min;
        if (driverState.is_fatigued) {
          calculated_time_min *= 1.3;
        }

        const is_late = calculated_time_min > route.base_time_min + 10;
        const penalty = is_late ? 50 : 0;
        const bonus =
          !is_late && order.value_rs > 1000 ? order.value_rs * 0.1 : 0;

        if (is_late) late_count++;
        else on_time_count++;


        const base_fuel = route.distance_km * 5;
        const surcharge =
          route.traffic_level === "High" ? route.distance_km * 2 : 0;

        total_base_fuel_cost += base_fuel;
        total_surcharge_cost += surcharge;
        total_penalties += penalty;
        total_bonuses += bonus;
      }
    }

    const total_order_value = allOrders.reduce(
      (sum, order) => sum + order.value_rs,
      0
    );

    const final_fuel_cost = total_base_fuel_cost + total_surcharge_cost;
    const total_profit =
      total_order_value + total_bonuses - total_penalties - final_fuel_cost;
    const efficiency_score = (on_time_count / allOrders.length) * 100;

    const newResult = new SimulationResult({
      total_profit,
      efficiency_score,
      on_time_deliveries: on_time_count,
      late_deliveries: late_count,
      fuel_cost: final_fuel_cost,
      fuel_cost_breakdown: {
        base: total_base_fuel_cost,
        surcharge: total_surcharge_cost,
      },
    });

    await newResult.save();


    res.json({
      total_profit: total_profit.toFixed(2),
      efficiency_score: efficiency_score.toFixed(2),
      on_time_deliveries: on_time_count,
      late_deliveries: late_count,
      fuel_cost: final_fuel_cost.toFixed(2),
      fuel_cost_breakdown: {
        base: total_base_fuel_cost,
        surcharge: total_surcharge_cost,
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
