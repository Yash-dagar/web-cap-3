const express = require('express');
const router = express.Router();
const { getShelterReport, getAdminReport } = require('../controllers/report.controller.js');
const { protect, shelterOnly, adminOnly } = require('../middleware/auth.middleware.js');

router.get('/api/reports/shelter', protect, shelterOnly, getShelterReport);
router.get('/api/reports/admin', protect, adminOnly, getAdminReport);

module.exports = router;
