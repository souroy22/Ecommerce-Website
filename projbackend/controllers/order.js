const { Order, ProductCart } = require("../models/order");
const User = require("../models/user");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.json({ err: "Can't find any User!!!" });
      }
      const { order } = req.body;
      order.user = user;
      const newOrder = new Order(order);
      await newOrder.save();
      return res.json(newOrder);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { orderId } = req.params;
      const findOrder = await Order.findById(orderId);
      if (!findOrder) {
        return res.json({ err: "Not found this Category" });
      }
      return res.json(findOrder);
    } catch (error) {
      return res.status(500).json({ error: "error from Here" });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find().populate("user", "_id name");
      if (!orders) {
        return res.json({ err: "Can't find any Order!!!" });
      }
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getAllStatus: async (req, res) => {
    return res.json(Order.schema.path("status").enumValues);
  },

  updateStatus: async (req, res) => {
    const { orderId } = req.params;
    const updatedDate = new Date();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { $set: req.body, updated: updatedDate.toDateString() },
      { new: true, useFindAndModify: false }
    );
    return res.json(updatedOrder);
  },
};

module.exports = orderController;
