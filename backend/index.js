const express = require('express');
const mongodb = require('./db.js');
const cors = require('cors');
const app = express();

mongodb();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.use('/api/food', require('./routes/food'));

app.get('/', (req, res) => {
    res.send('API is running 🚀');
});


app.listen(1234);