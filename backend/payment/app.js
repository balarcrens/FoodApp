const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const cors = require('cors');

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

const readData = () => {
    if (fs.existsSync('orders.json')) {
        const data = fs.readFileSync('orders.json');
        return JSON.parse(data);
    }
    return [];
};

const writeData = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

if (!fs.existsSync('orders.json')) {
    writeData([]);
}

app.post('/create-order', async (req, res) => {
    try {
        const { amount, currency, receipt, notes } = req.body;

        const options = {
            amount: amount,
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);

        const orders = readData();
        orders.push({
            order_id: order.id,
            amount: order.amount / 100,
            currency: order.currency,
            receipt: order.receipt,
            status: 'created',
        });
        writeData(orders);

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating order" });
    }
});


app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
        if (isValidSignature) {
            const orders = readData();
            const order = orders.find(o => o.order_id === razorpay_order_id);
            if (order) {
                order.status = 'paid';
                order.payment_id = razorpay_payment_id;
                writeData(orders);
            }
            res.status(200).json({ status: 'ok' });
        } else {
            res.status(400).json({ status: 'verification_failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: 'Error verifying payment' });
    }
});

app.listen(5000);
