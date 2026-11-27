const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getProfile
} = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

router.post('/api/auth/register', registerUser);
router.post('/api/auth/login', loginUser);
router.post('/api/auth/refresh', refreshAccessToken);
router.post('/api/auth/logout', logoutUser);
router.get('/api/auth/profile', protect, getProfile);

module.exports = router;
