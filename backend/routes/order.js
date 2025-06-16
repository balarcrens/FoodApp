const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser.js');

router.post('/order', fetchuser, async (req, res) => {
    try {
        const newOrder = new Order({
            user: req.user.id,
            email: req.body.email,
            items: req.body.items,
            orderID: req.body.orderID,
            paymentID: req.body.paymentID,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            date: new Date()
        });
        await newOrder.save();
        res.json({ status: "ok", message: "Order stored" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

router.get('/fetchallorder', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        if (!orders) return res.status(404).json({ error: "Orders not found" });
        res.json(orders);
    } catch (err) {
        res.status(500).send({ err: "Server error" });
    }
});

router.post('/request-cancel/:id', fetchuser, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (order.status === "Cancelled" || order.status === "Delivered" || order.status === "Out for Delivery") {
            return res.status(400).json({ error: "Order cannot be Cancelled" });
        }

        order.cancelRequested = true;
        await order.save();
        res.json({ success: "Cancel request submitted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ err: "Server error" });
    }
})

module.exports = router;