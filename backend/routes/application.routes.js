const express = require('express');
const router = express.Router();
const {
    applyForPet,
    getMyApplications,
    getShelterApplications,
    updateApplicationStatus,
    withdrawApplication
} = require('../controllers/application.controller.js');
const { protect, adopterOnly, shelterOnly } = require('../middleware/auth.middleware.js');

// adopter
router.post('/api/applications', protect, adopterOnly, applyForPet);
router.get('/api/applications/my', protect, adopterOnly, getMyApplications);
router.delete('/api/applications/:id', protect, adopterOnly, withdrawApplication);

// shelter
router.get('/api/applications/shelter', protect, shelterOnly, getShelterApplications);
router.patch('/api/applications/:id/status', protect, shelterOnly, updateApplicationStatus);

module.exports = router;
