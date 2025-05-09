const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const fetchuser = require('../middleware/fetchuser.js');
const { body, validationResult } = require('express-validator');


router.post('/contactus', fetchuser, [
    body('firstname').notEmpty(),
    body('lastname').notEmpty(),
    body('email').isEmail(),
    body('phone').isLength(10),
    body('message'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { firstname, lastname, email, phone, message } = req.body;

        const Contactdata = new Contact({
            firstname,
            lastname,
            email,
            phone,
            message
        });

        await Contactdata.save();
        res.status(200).json({ success: true, message: "Contact form submitted successfully." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;