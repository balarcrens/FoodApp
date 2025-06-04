const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser.js');

router.post('/order', fetchuser, [
    body('email', 'Email is required').isEmail(),
    body('name', 'Name is required').notEmpty(),
    body('img', 'Image is required').notEmpty(),
    body('orderID', 'OrderID is required').notEmpty(),
    body('paymentID', 'Payment is required').notEmpty(),
    body('quantity', 'Quantity is required').notEmpty(),
    body('status', 'Status is required').notEmpty(),
    body('price', 'Price must be a number').isFloat({ min: 0 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const order = new Order({ ...req.body, user: req.user.id });
        const savedOrder = await order.save();
        res.json(savedOrder);
    } catch (error) {
        res.status(500).json({ error: "error" })
    }
})

router.get('/fetchallorder', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id });
        res.json(orders);
    } catch (err) {
        res.status(500).send({err: "Server error"});
    }
});

module.exports = router;