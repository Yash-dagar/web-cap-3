const Application = require('../models/application.model.js');
const Pet = require('../models/pet.model.js');

// POST /api/applications  (adopter)  body: { petId, message }
const applyForPet = async (req, res, next) => {
    try {
        const { petId, message } = req.body || {};

        if (!petId) {
            return res.status(400).json({ success: false, message: 'petId is required' });
        }

        const pet = await Pet.findById(petId);
        if (!pet) {
            return res.status(404).json({ success: false, message: 'Pet not found' });
        }
        if (pet.status === 'adopted') {
            return res.status(400).json({ success: false, message: 'This pet is already adopted' });
        }

        const already = await Application.findOne({ pet: petId, adopter: req.user.id });
        if (already) {
            return res.status(409).json({ success: false, message: 'You have already applied for this pet' });
        }

        const application = await Application.create({
            pet: petId,
            adopter: req.user.id,
            shelter: pet.shelter,
            message
        });

        res.status(201).json({ success: true, message: 'Application sent to the shelter', application });
    } catch (error) {
        next(error);
    }
};

// GET /api/applications/my  (adopter)
const getMyApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({ adopter: req.user.id })
            .populate('pet', 'name species breed photoUrl status')
            .populate('shelter', 'name city phone')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: applications.length, applications });
    } catch (error) {
        next(error);
    }
};

// GET /api/applications/shelter?status=pending  (shelter)
const getShelterApplications = async (req, res, next) => {
    try {
        const query = { shelter: req.user.id };
        if (req.query.status) {
            query.status = req.query.status;
        }

        const applications = await Application.find(query)
            .populate('pet', 'name species breed photoUrl status')
            .populate('adopter', 'name email phone city')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: applications.length, applications });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/applications/:id/status  (shelter)  body: { status: 'approved' or 'rejected' }
const updateApplicationStatus = async (req, res, next) => {
    try {
        const { status } = req.body || {};

        if (status !== 'approved' && status !== 'rejected') {
            return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
        }

        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.shelter.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'This application is not for your shelter' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'This application is already ' + application.status });
        }

        if (status === 'approved') {
            const pet = await Pet.findById(application.pet);
            if (!pet || pet.status === 'adopted') {
                return res.status(400).json({ success: false, message: 'This pet is already adopted' });
            }

            // mark the pet as adopted
            pet.status = 'adopted';
            pet.adoptedBy = application.adopter;
            pet.adoptedAt = new Date();
            await pet.save();

            // other people who applied for the same pet get rejected
            await Application.updateMany(
                { pet: pet._id, status: 'pending', _id: { $ne: application._id } },
                { status: 'rejected', decidedAt: new Date() }
            );
        }

        application.status = status;
        application.decidedAt = new Date();
        await application.save();

        res.json({ success: true, message: 'Application ' + status, application });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/applications/:id  (adopter can withdraw a pending application)
const withdrawApplication = async (req, res, next) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        if (application.adopter.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'This is not your application' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Only pending applications can be withdrawn' });
        }

        await application.deleteOne();
        res.json({ success: true, message: 'Application withdrawn' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyForPet,
    getMyApplications,
    getShelterApplications,
    updateApplicationStatus,
    withdrawApplication
};
