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
    items: {
        type: Array,
        required: true
    },
    orderID: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: true
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