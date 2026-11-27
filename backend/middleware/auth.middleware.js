const jwt = require('jsonwebtoken');

// protect: user must send "Authorization: Bearer <accessToken>"
const protect = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not logged in. Token missing' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // decoded = { id, role }
        req.user = decoded;
        next();
    } catch (error) {
        // expired or wrong token, error middleware will send 401
        next(error);
    }
};

// RBAC middlewares (use after protect)
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admin only' });
    }
    next();
};

const shelterOnly = (req, res, next) => {
    if (req.user.role !== 'shelter') {
        return res.status(403).json({ success: false, message: 'Access denied. Shelters only' });
    }
    next();
};

const adopterOnly = (req, res, next) => {
    if (req.user.role !== 'adopter') {
        return res.status(403).json({ success: false, message: 'Access denied. Adopters only' });
    }
    next();
};

// shelter or admin (for editing / deleting pets)
const shelterOrAdmin = (req, res, next) => {
    if (req.user.role !== 'shelter' && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }
    next();
};

module.exports = { protect, adminOnly, shelterOnly, adopterOnly, shelterOrAdmin };
