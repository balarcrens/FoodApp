const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    ingredients: { type: String },
    size: { type: String },
    orderID: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        default: "Processing"
    },
    cancelRequested: { type: Boolean, default: false },
    cancelApproved: { type: Boolean, default: false },
    date: {
        type: Date,
        default: Date.now,
    }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order