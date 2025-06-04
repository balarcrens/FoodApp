/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAdmin = require('../middleware/requireAdmin');
const Order = require('../models/Order');
const fetchuser = require('../middleware/fetchuser');
const Food = require('../models/Food');

const JWT_SECRET = 'food_store@446';

router.post('/login', [
    body('email').notEmpty(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ error: "Invalid email or Password" });

        if (user.role !== 'admin') {
            console.error("Access denied.")
            return res.status(403).json({ error: "Access denied." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid email or password" });

        const payload = {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        }

        const token = jwt.sign(payload, JWT_SECRET);

        res.json({ token, name: user.name, role: user.role });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Server error" });
    }
});

router.get('/fetchuserdata', fetchuser, requireAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: "Server Error" });
    }
})

router.post('/addfood', fetchuser, requireAdmin, [
    body('name', 'Name is required').notEmpty(),
    body('img', 'Image URL is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('category', 'Category is required').notEmpty(),
    body('price', 'Price must be a number').isFloat({ min: 0 }),
    body('isAvailable', 'isAvailable is required').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const food = new Food({ ...req.body });
        const savedFood = await food.save();
        res.json({ success: true, savedFood });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/fetchorderdata', fetchuser, requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Server Error" });
    }
})

router.put('/updatefood/:id', fetchuser, requireAdmin, async (req, res) => {
    try {
        const updated = await Food.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updated) return res.status(404).send("Food not found");
        res.json({ success: "Food updated", updated });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});


router.delete('/deletefood/:id', fetchuser, requireAdmin, async (req, res) => {
    try {
        const deleted = await Food.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send("Food not found");
        res.json({ success: "Food deleted", deleted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put('/updateorderstatus/:id', fetchuser, requireAdmin, async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        order.status = status;
        await order.save();

        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;