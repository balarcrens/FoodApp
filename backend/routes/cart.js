const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const fetchuser = require('../middleware/fetchuser.js');

router.post('/addcartitem', fetchuser, [
    body('email', 'Email is required').isEmail(),
    body('name', 'Name is required').notEmpty(),
    body('img', 'Image is required').notEmpty(),
    body('quantity', 'Quantity is required').notEmpty(),
    body('price', 'Price must be a number').isFloat({ min: 0 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const cart = new Cart({ ...req.body, user: req.user.id });
        const savedCart = await cart.save();
        res.json(savedCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})

router.get('/fetchcartitem', fetchuser, async (req, res) => {
    try {
        const carts = await Cart.find({ user: req.user.id });
        if (!carts) return res.status(404).json({ error: "Cart is Empty" });
        res.json(carts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/removecartitem/:id', fetchuser, async (req, res) => {
    try {
        const deleted = await Cart.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send("Item not found in Cart");
        res.json({ success: "item removed from cart", deleted });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;