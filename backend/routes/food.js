/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Food = require('../models/Food');
const fetchuser = require('../middleware/fetchUser');

router.get('/fetchallfood', fetchuser, async (req, res) => {
    try {
        const food = await Food.find();
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/addfood', fetchuser, [
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
        res.json(savedFood);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:id', fetchuser, async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ error: "Food not found" });
        res.json({ food });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.put('/update/:id', fetchuser, async (req, res) => {
    try {
        const updated = await Food.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updated) return res.status(404).send("Food not found");
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        const deleted = await Food.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).send("Food not found");
        res.json({ success: "Food deleted", deleted });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
