const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const fetchuser = require('../middleware/fetchuser.js');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT_SECRET = 'food_store@446';
const client = new OAuth2Client("226449432488-s5r459b5ovor76lfupd8npfo07t91lgi.apps.googleusercontent.com");

router.post('/createuser', [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('address').notEmpty(),
    body('phone').isLength(10),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, password, address, phone } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        const userRole = (email === 'admin@crens.com' && password === 'crens@446') ? 'admin' : 'user';

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user = new User({
            name: name,
            email: email,
            password: hash,
            address: address,
            phone: phone,
            role: userRole
        });

        await user.save();

        const data = {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };

        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({ token, name: user.name, role: user.role });
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
        if (!user) return res.status(400).json({ error: "User can't exists" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Password" });

        const data = {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };

        const token = jwt.sign(data, JWT_SECRET, {
            expiresIn: '7d'
        });
        res.json({ token, name: user.name });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ error: "Server Error" });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "balarcrens@gmail.com",
        pass: "iuga amnl rpvj xuwh",
    },
});

const otpStore = new Map();
const otpGenerator = () => Math.floor(100000 + Math.random() * 900000);

router.post('/forgot-password', [
    body('email').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User can't exists. Please Login first" });

        const otp = otpGenerator();
        otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

        await transporter.sendMail({
            from: "balarcrens@gmail.com",
            to: user.email,
            subject: 'Password Reset',
            html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>Password Reset OTP</h2>
                <p>Hello ${user.name || ''},</p>
                <p>Your OTP for password reset is:</p>
                <h1 style="color: #007BFF;">${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thanks,<br>The FoodApp Support Team</p>
            </div>`,
        });

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).send({ error: "Server Error", message: error.message });
    }
});

router.post('/verify-otp', [
    body('email').isEmail(),
    body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, otp } = req.body;

        const record = otpStore.get(email);
        if (!record) return res.status(400).json({ error: "OTP not found or expired." });

        if (Date.now() > record.expires) {
            otpStore.delete(email);
            return res.status(400).json({ error: "OTP expired." });
        }

        if (parseInt(otp) !== record.otp) return res.status(400).json({ error: "Invalid OTP." });

        const verificationToken = crypto.randomBytes(20).toString('hex');
        otpStore.set(email, { ...record, verified: true, otptoken: verificationToken });

        res.json({ message: "OTP verified", otptoken: verificationToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/reset-password', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('otptoken').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password, otptoken } = req.body;
        const record = otpStore.get(email);

        if (!record || !record.verified || record.otptoken !== otptoken) {
            return res.status(400).json({ error: "Unauthorized or expired token." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found." });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        otpStore.delete(email);
        res.json({ message: "Password reset successful." });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/verify-google-token', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "226449432488-s5r459b5ovor76lfupd8npfo07t91lgi.apps.googleusercontent.com"
        });

        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not registered. Please sign up first."
            });
        }

        const data = {
            user: {
                id: user._id
            }
        };
        const jwtToken = jwt.sign(data, JWT_SECRET);

        res.json({
            success: true,
            token: jwtToken,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Google Token verification error:", error);
        res.status(401).json({ success: false, message: "Invalid Google token" });
    }
});

router.get('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.send({ user });
    } catch (err) {
        console.error("err" + err);
        res.status(500).send({ error: "Server Error" });
    }
});

module.exports = router;