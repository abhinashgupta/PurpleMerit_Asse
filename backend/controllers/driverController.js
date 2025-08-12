const Driver = require("../models/Driver");

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDriver = async (req, res) => {
  const driver = new Driver({
    name: req.body.name,
    shift_hours: req.body.shift_hours,
    past_week_hours: req.body.past_week_hours,
  });

  try {
    const newDriver = await driver.save();
    res.status(201).json(newDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (driver == null) {
      return res.status(404).json({ message: "Cannot find driver" });
    }
    res.json(driver);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDriver);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Driver" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
