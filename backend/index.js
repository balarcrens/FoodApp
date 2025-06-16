const express = require('express');
const mongodb = require('./db.js');
const cors = require('cors');
const app = express();

mongodb();

app.use(cors());
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://foodapp-c382.onrender.com'],
    credentials: true
}));

app.use('/api/auth', require('./routes/auth'));

app.use('/api/admin', require('./routes/admin'));

app.use('/api/food', require('./routes/food'));

app.use('/api', require('./routes/contact'));

app.use('/api', require('./routes/order'));

app.use('/api', require('./routes/cart'));

app.get('/', (req, res) => {
    res.send('API is running 🚀');
});


app.listen(1234);