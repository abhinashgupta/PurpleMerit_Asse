const Order = require("../models/Order");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "route_id", 
      model: "Route", 
      foreignField: "route_id", 
    });

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


exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Deleted Order" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};