const Route = require("../models/Route");

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoute = async (req, res) => {
  const route = new Route({
    route_id: req.body.route_id,
    distance_km: req.body.distance_km,
    traffic_level: req.body.traffic_level,
    base_time_min: req.body.base_time_min,
  });

  try {
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
