const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    foodname: {
        type: String,
        required: true
    },
    order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true
    }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order