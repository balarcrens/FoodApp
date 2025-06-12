const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    date: {
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User