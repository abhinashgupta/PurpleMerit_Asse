const mongoose = require("mongoose");

const SimulationResultSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  total_profit: {
    type: Number,
    required: true,
  },
  efficiency_score: {
    type: Number,
    required: true,
  },
  on_time_deliveries: {
    type: Number,
    required: true,
  },
  late_deliveries: {
    type: Number,
    required: true,
  },
  fuel_cost: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SimulationResult", SimulationResultSchema);
