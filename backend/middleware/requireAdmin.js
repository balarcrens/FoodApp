const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.error('Access denied. Admins only.')
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
};

module.exports = requireAdmin;
