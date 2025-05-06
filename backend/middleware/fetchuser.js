const jwt = require('jsonwebtoken');
const JWT_SECRET = 'food_store@446';

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send({ error: "Access denied. No token provided." });

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user; // make sure this includes id AND role
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid token" });
    }
};

module.exports = fetchuser;
