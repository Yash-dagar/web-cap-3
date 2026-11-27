const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/user.controller.js');
const { protect, adminOnly } = require('../middleware/auth.middleware.js');

// RBAC: only admin
router.get('/api/users', protect, adminOnly, getAllUsers);
router.delete('/api/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
