const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const fetchuser = require('../middleware/fetchuser.js');

router.get('/fetchallfood', async (req, res) => {
    try {
        const food = await Food.find();
        res.json(food);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.get('/:id', fetchuser, async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) return res.status(404).json({ error: "Food not found" });
        res.json({ food });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

module.exports = router;
