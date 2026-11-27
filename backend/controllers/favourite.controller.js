const Favourite = require('../models/favourite.model.js');
const Pet = require('../models/pet.model.js');

// GET /api/favourites  (adopter)
const getFavourites = async (req, res, next) => {
    try {
        const favourites = await Favourite.find({ user: req.user.id })
            .populate({
                path: 'pet',
                select: 'name species breed age gender photoUrl status',
                populate: { path: 'shelter', select: 'name city' }
            })
            .sort({ createdAt: -1 });

        // if a pet was deleted, pet will be null, so skip it
        const list = favourites.filter((fav) => fav.pet !== null);

        res.json({ success: true, count: list.length, favourites: list });
    } catch (error) {
        next(error);
    }
};

// POST /api/favourites  (adopter)  body: { petId }
const addFavourite = async (req, res, next) => {
    try {
        const { petId } = req.body || {};

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        const favourite = await Favourite.create({ user: req.user.id, pet: petId });
        res.status(201).json({ success: true, message: 'Added to favourites', favourite });
    } catch (error) {
        // duplicate is caught by the unique index -> 409 from error middleware
        next(error);
    }
};

// DELETE /api/favourites/:petId  (adopter)
const removeFavourite = async (req, res, next) => {
    try {
        const deleted = await Favourite.findOneAndDelete({ user: req.user.id, pet: req.params.petId });
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'This pet is not in your favourites' });
        }
        res.json({ success: true, message: 'Removed from favourites' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getFavourites, addFavourite, removeFavourite };
