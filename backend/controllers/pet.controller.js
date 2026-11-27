const Pet = require('../models/pet.model.js');
const Application = require('../models/application.model.js');
const Favourite = require('../models/favourite.model.js');

// GET /api/pets  (public)
// example: /api/pets?species=Dog&breed=lab&minAge=1&maxAge=5&page=1&limit=6
const getPets = async (req, res, next) => {
    try {
        const { species, breed, minAge, maxAge, search, gender, vaccinated } = req.query;

        // only show pets that are still available
        const query = { status: 'available' };

        if (species) {
            query.species = species;
        }
        if (breed) {
            query.breed = { $regex: breed, $options: 'i' };
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (gender) {
            query.gender = gender;
        }
        if (vaccinated === 'true') {
            query.vaccinated = true;
        }
        if (minAge || maxAge) {
            query.age = {};
            if (minAge) {
                query.age.$gte = Number(minAge);
            }
            if (maxAge) {
                query.age.$lte = Number(maxAge);
            }
        }

        // sort: newest (default), age_asc, age_desc
        let sortBy = { createdAt: -1 };
        if (req.query.sort === 'age_asc') {
            sortBy = { age: 1 };
        } else if (req.query.sort === 'age_desc') {
            sortBy = { age: -1 };
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const total = await Pet.countDocuments(query);
        const pets = await Pet.find(query)
            .populate('shelter', 'name city')
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            pets
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/pets/:id  (public)
const getPet = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id).populate('shelter', 'name city phone email');
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        res.json({ success: true, pet });
    } catch (error) {
        next(error);
    }
};

// GET /api/shelter/pets  (shelter) - all pets of the logged in shelter
const getMyPets = async (req, res, next) => {
    try {
        const pets = await Pet.find({ shelter: req.user.id })
            .populate('adoptedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: pets.length, pets });
    } catch (error) {
        next(error);
    }
};

// POST /api/pets  (shelter)
const createPet = async (req, res, next) => {
    try {
        const { name, species, breed, age, gender, vaccinated, description, photoUrl } = req.body || {};

        const pet = await Pet.create({
            name,
            species,
            breed,
            age,
            gender,
            vaccinated,
            description,
            photoUrl,
            shelter: req.user.id
        });

        res.status(201).json({ success: true, message: 'Pet added', pet });
    } catch (error) {
        next(error);
    }
};

// PUT /api/pets/:id  (shelter who posted it, or admin)
const updatePet = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        if (req.user.role !== 'admin' && pet.shelter.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You can only edit your own pets' });
        }

        const { name, species, breed, age, gender, vaccinated, description, photoUrl } = req.body || {};
        if (name !== undefined) pet.name = name;
        if (species !== undefined) pet.species = species;
        if (breed !== undefined) pet.breed = breed;
        if (age !== undefined) pet.age = age;
        if (gender !== undefined) pet.gender = gender;
        if (vaccinated !== undefined) pet.vaccinated = vaccinated;
        if (description !== undefined) pet.description = description;
        if (photoUrl !== undefined) pet.photoUrl = photoUrl;

        await pet.save();

        res.json({ success: true, message: 'Pet updated', pet });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/pets/:id  (shelter who posted it, or admin)
const deletePet = async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }

        if (req.user.role !== 'admin' && pet.shelter.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You can only delete your own pets' });
        }

        if (pet.status === 'adopted') {
            return res.status(400).json({ success: false, message: 'Adopted pets are kept for records and cannot be deleted' });
        }

        // also remove applications and favourites of this pet
        await Application.deleteMany({ pet: pet._id });
        await Favourite.deleteMany({ pet: pet._id });
        await pet.deleteOne();

        res.json({ success: true, message: 'Pet deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPets, getPet, getMyPets, createPet, updatePet, deletePet };
