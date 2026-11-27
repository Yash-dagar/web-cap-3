const express = require('express');
const router = express.Router();
const {
    getPets,
    getPet,
    getMyPets,
    createPet,
    updatePet,
    deletePet
} = require('../controllers/pet.controller.js');
const { protect, shelterOnly, shelterOrAdmin } = require('../middleware/auth.middleware.js');

// public - anyone can browse pets
router.get('/api/pets', getPets);
router.get('/api/pets/:id', getPet);

// shelter routes
router.get('/api/shelter/pets', protect, shelterOnly, getMyPets);
router.post('/api/pets', protect, shelterOnly, createPet);
router.put('/api/pets/:id', protect, shelterOrAdmin, updatePet);
router.delete('/api/pets/:id', protect, shelterOrAdmin, deletePet);

module.exports = router;
