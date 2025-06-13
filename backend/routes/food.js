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

router.post('/favtoggle/:id', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send("User not found");

        const index = user.favourites.findIndex(fav => fav.toString() === req.params.id);
        if (index === -1) {
            user.favourites.push(req.params.id); // Add to favorites
        } else {
            user.favourites.splice(index, 1); // Remove from favorites
        }

        await user.save();
        res.json({ success: true, favourites: user.favourites });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.get('/favlist', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("favourites");
        res.json(user.favourites);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.post('/favfoods', fetchuser, async (req, res) => {
    try {
        const { ids } = req.body;
        const foods = await Food.find({ _id: { $in: ids } });
        res.json(foods);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Internal Server Error" });
    }
});

router.delete('/removefav/:id', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send("User not found");

        const index = user.favourites.indexOf(req.params.id);
        if (index !== -1) {
            user.favourites.splice(index, 1);
            await user.save();
        }

        res.json({ success: true, favourites: user.favourites });
    } catch (error) {
        console.error(error.message);
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
