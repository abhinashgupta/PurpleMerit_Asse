const express = require("express");
const router = express.Router();
const {
  runSimulation,
  getSimulationHistory,
} = require("../controllers/simulationController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/run", runSimulation);

router.get("/history", getSimulationHistory);

module.exports = router;
