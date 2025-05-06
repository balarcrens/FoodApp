const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/food?directConnection=true';

const mongodb = async () => {
    try {
        await mongoose.connect(URI);
    } catch(err) {
        console.log(err);
    }
}

module.exports = mongodb;