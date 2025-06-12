const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const fetchuser = require('../middleware/fetchuser.js');
const User = require('../models/User.js');

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

router.post('/favtoggle/:id', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const foodId = req.params.id;

        const index = user.favourites.indexOf(foodId);
        if (index === -1) {
            user.favourites.push(foodId); // Add to favorites
        } else {
            user.favourites.splice(index, 1); // Remove from favorites
        }

        await user.save();
        res.json({ success: true, favourites: user.favourites });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
})

router.get('/favlist', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favourites");
        res.json(user.favourites);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
})

module.exports = router;
