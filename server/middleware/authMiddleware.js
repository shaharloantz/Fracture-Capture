const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
};

module.exports = requireAuth;
