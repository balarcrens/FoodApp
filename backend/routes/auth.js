
/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser.js');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'food_store@446';

router.post('/createuser', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('phone').isLength(10),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, password, phone } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user = new User({
            name: name,
            email: email,
            password: hash,
            phone: phone
        });

        await user.save();

        const data = {
            user: {
                id: user._id,
            }
        };

        const token = jwt.sign(data, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Server Error" });
    }
});


router.post('/login', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

        const data = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        const token = jwt.sign(data, JWT_SECRET);
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Server Error" });
    }
});

router.put('/updateuser', fetchuser, [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('phone').isLength(10)
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, phone, password } = req.body;

    try {
        const updatedData = {};
        if (name) updatedData.name = name;
        if (phone) updatedData.phone = phone;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updatedData.password = hash;
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedData },
            { new: true }
        ).select("-password");

        res.json({ user });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ error: "Server Error" });
    }
});

router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send({ user });
    } catch (err) {
        console.error("err" + err);
        res.status(500).send({ error: "Server Error" });
    }
});

module.exports = router;