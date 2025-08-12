const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("route_id");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  const order = new Order({
    order_id: req.body.order_id,
    value_rs: req.body.value_rs,
    route_id: req.body.route_id,
    delivery_time: req.body.delivery_time,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
