const express = require('express');
const router = express.Router();
const { getFavourites, addFavourite, removeFavourite } = require('../controllers/favourite.controller.js');
const { protect, adopterOnly } = require('../middleware/auth.middleware.js');

router.get('/api/favourites', protect, adopterOnly, getFavourites);
router.post('/api/favourites', protect, adopterOnly, addFavourite);
router.delete('/api/favourites/:petId', protect, adopterOnly, removeFavourite);

module.exports = router;
