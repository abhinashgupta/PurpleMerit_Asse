const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", routeController.getAllRoutes);
router.post("/", routeController.createRoute);

module.exports = router;
