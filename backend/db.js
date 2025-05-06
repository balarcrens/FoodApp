const mongoose = require('mongoose');
const URI = 'mongodb+srv://balarcrens:crens446@cluster0.tepwhhp.mongodb.net/';

const mongodb = async () => {
    try {
        await mongoose.connect(URI);
    } catch(err) {
        console.log(err);
    }
}

module.exports = mongodb;