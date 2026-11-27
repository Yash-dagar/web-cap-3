const mongoose = require('mongoose');
const Pet = require('../models/pet.model.js');
const Application = require('../models/application.model.js');
const User = require('../models/user.model.js');

// GET /api/reports/shelter  (shelter dashboard)
const getShelterReport = async (req, res, next) => {
    try {
        // aggregate needs a real ObjectId, not a string
        const shelterId = new mongoose.Types.ObjectId(req.user.id);

        // 1. adoptions per month
        const adoptionsPerMonth = await Pet.aggregate([
            { $match: { shelter: shelterId, status: 'adopted' } },
            {
                $group: {
                    _id: { year: { $year: '$adoptedAt' }, month: { $month: '$adoptedAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // 2. pets by species (total and how many still available)
        const petsBySpecies = await Pet.aggregate([
            { $match: { shelter: shelterId } },
            {
                $group: {
                    _id: '$species',
                    total: { $sum: 1 },
                    available: { $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } }
                }
            },
            { $sort: { total: -1 } }
        ]);

        // 3. applications by status
        const applicationsByStatus = await Application.aggregate([
            { $match: { shelter: shelterId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const totalPets = await Pet.countDocuments({ shelter: shelterId });
        const adoptedPets = await Pet.countDocuments({ shelter: shelterId, status: 'adopted' });

        res.json({
            success: true,
            totalPets,
            adoptedPets,
            availablePets: totalPets - adoptedPets,
            adoptionsPerMonth,
            petsBySpecies,
            applicationsByStatus
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/reports/admin  (admin overview)
const getAdminReport = async (req, res, next) => {
    try {
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const petsBySpecies = await Pet.aggregate([
            {
                $group: {
                    _id: '$species',
                    total: { $sum: 1 },
                    adopted: { $sum: { $cond: [{ $eq: ['$status', 'adopted'] }, 1, 0] } }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const adoptionsPerMonth = await Pet.aggregate([
            { $match: { status: 'adopted' } },
            {
                $group: {
                    _id: { year: { $year: '$adoptedAt' }, month: { $month: '$adoptedAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // shelters with the most adoptions
        const topShelters = await Pet.aggregate([
            { $match: { status: 'adopted' } },
            { $group: { _id: '$shelter', adoptions: { $sum: 1 } } },
            { $sort: { adoptions: -1 } },
            { $limit: 5 }
        ]);

        // add the shelter name to each row
        for (let i = 0; i < topShelters.length; i++) {
            const shelter = await User.findById(topShelters[i]._id).select('name city');
            topShelters[i].name = shelter ? shelter.name : 'Deleted shelter';
            topShelters[i].city = shelter ? shelter.city : '';
        }

        const totalPets = await Pet.countDocuments();
        const totalApplications = await Application.countDocuments();
        const pendingApplications = await Application.countDocuments({ status: 'pending' });

        res.json({
            success: true,
            totalPets,
            totalApplications,
            pendingApplications,
            usersByRole,
            petsBySpecies,
            adoptionsPerMonth,
            topShelters
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getShelterReport, getAdminReport };
