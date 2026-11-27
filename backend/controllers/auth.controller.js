const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    });
};

// user details we send to the frontend (never send password)
const userData = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        city: user.city,
        phone: user.phone
    };
};

// POST /api/auth/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, city } = req.body || {};

        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password should be at least 6 characters' });
        }

        // people can sign up as adopter or shelter, admin is never allowed here
        let userRole = 'adopter';
        if (role === 'shelter') {
            userRole = 'shelter';
        }

        const existing = await User.findOne({ email: email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'This email is already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role: userRole,
            phone,
            city
        });

        res.status(201).json({ success: true, message: 'Account created', user: userData(user) });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Wrong email or password' });
        }

        const correct = await bcrypt.compare(password, user.password);
        if (!correct) {
            return res.status(401).json({ success: false, message: 'Wrong email or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // keep the refresh token in DB, logout will remove it
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: userData(user)
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/refresh  -> gives a new access token
const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body || {};

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token missing' });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ success: false, message: 'Invalid refresh token, please login again' });
        }

        const accessToken = generateAccessToken(user);
        res.json({ success: true, accessToken });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout
const logoutUser = async (req, res, next) => {
    try {
        const { refreshToken } = req.body || {};

        if (refreshToken) {
            await User.updateOne({ refreshToken: refreshToken }, { refreshToken: null });
        }

        res.json({ success: true, message: 'Logged out' });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/profile (protected)
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password -refreshToken');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser, getProfile };
