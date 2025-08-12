const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shift_hours: {
    type: Number,
    required: true,
  },
  past_week_hours: {
    type: [Number],
    required: true,
  },
});

module.exports = mongoose.model("Driver", DriverSchema);
