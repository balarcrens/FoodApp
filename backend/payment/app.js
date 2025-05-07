const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const cors = require('cors');
const Order = require('../models/Order');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
    key_id: 'rzp_test_YDl1mSfAIgmAz6',
    key_secret: 'LJbfYTbCLYj0WO5PtguBV9Wu',
});


// Route to handle order creation
app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt, notes, name, email, foodname } = req.body;

        const options = {
            amount, // Convert amount to paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);

        // Read current orders, add new order, and write back to the file
        const newOrder = new Order({
            name,
            email,
            foodname,
            order_id: order.id,
            amount: order.amount,
            status: 'created'
        });

        await newOrder.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating order" });
    }
});

// Route to handle payment verification
app.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
        if (isValidSignature) {
            await Order.findOneAndUpdate(
                { order_id: razorpay_order_id },
                {
                    status: 'paid',
                    $set: { payment_id: razorpay_payment_id }
                }
            );
            res.status(200).json({ status: 'ok' });
        } else {
            res.status(400).json({ status: 'verification_failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error verifying payment' });
    }
});

app.listen(5000, () => console.log('Payment Server running on http://localhost:5000'));
