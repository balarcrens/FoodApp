const mongoose = require('mongoose');
const URI = 'mongodb+srv://balarcrens188:crens446@cluster0.xzu7dp3.mongodb.net/food';

const mongodb = async () => {
    try {
        await mongoose.connect(URI);
        console.log("mongoDb connected Successfully");
    } catch (err) {
        console.log(err);
    }
}

module.exports = mongodb;