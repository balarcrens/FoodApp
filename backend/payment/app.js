const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const cors = require('cors');
const nodemailer = require('nodemailer');

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

// Function to read data from JSON file
const readData = () => {
    if (fs.existsSync('orders.json')) {
        const data = fs.readFileSync('orders.json');
        return JSON.parse(data);
    }
    return [];
};

// Function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync('orders.json')) {
    writeData([]);
}

// Route to handle order creation
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

        // Read current orders, add new order, and write back to the file
        const orders = readData();
        orders.push({
            order_id: order.id,
            amount: order.amount / 100,
            currency: order.currency,
            receipt: order.receipt,
            status: 'created',
        });
        writeData(orders);

        res.json(order); // Send order details to frontend, including order ID
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating order" });
    }
});

// Route to handle payment verification
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

app.post('/send-receipt-email', async (req, res) => {
    const { email, receipt } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use SendGrid/Mailgun/etc.
            auth: {
                user: 'balarcrens@gmail.com',
                pass: 'kpxh dhll ebqx ijjg',
            },
        });

        const html = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f8f8f8;
                        margin: 0;
                        padding: 20px;
                    }
                    .receipt-container {
                        text-align: center;
                        max-width: 600px;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        margin: auto;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    h2 {
                        color: #2c3e50;
                    }
                    .highlight {
                        color: #27ae60;
                        font-weight: bold;
                    }
                    .food-image {
                        width: 100%;
                        max-height: 250px;
                        object-fit: cover;
                        border-radius: 6px;
                        margin-bottom: 20px;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 0.9em;
                        color: #888;
                    }
                    p {
                        font-size: large;
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <h2>🧾 Payment Receipt</h2>

                    <p><strong>Order ID:</strong> <span class="highlight">${receipt.orderId}</span></p>
                    <p><strong>Payment ID:</strong> <span class="highlight">${receipt.paymentId}</span></p>

                    <img class="food-image" src="https://foodapp-c382.onrender.com${receipt.img}" alt="Food Image" />

                    <p><strong>Food:</strong> ${receipt.foodName} </p>
                    <p><strong>Quantity:</strong> ${receipt.quantity} </p>
                    <p><strong>Size:</strong> ${receipt.size} </p>
                    <p><strong>Total Paid:</strong> <span class="highlight"> ₹${receipt.totalPrice} </span></p>
                    <p><strong>Date:</strong> ${receipt.time} </p>

                    <p style="margin-top: 30px;">🍽️ Thank you for ordering with <strong>Food Adda</strong>!</p>

                    <div class="footer">
                        <p>Need help? Contact us at <a href="mailto:support@foodadda.com">support@foodadda.com</a></p>
                        <p>© 2025 Food Adda</p>
                    </div>
                </div>
            </body>
        </html>
`

        const mailOptions = {
            from: `"Food Adda" <balarcrens@gmail.com>`,
            to: email,
            subject: 'Your Food Adda Receipt',
            html: html
        };

        await transporter.sendMail(mailOptions);
        res.json({ status: 'ok', message: 'Email sent' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send email' });
    }
});

app.listen(5000, () => console.log('Payment Server running on http://localhost:5000'));
