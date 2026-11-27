const User = require('../models/user.model.js');
const Pet = require('../models/pet.model.js');
const Application = require('../models/application.model.js');
const Favourite = require('../models/favourite.model.js');

// GET /api/users?role=shelter  (admin)
const getAllUsers = async (req, res, next) => {
    try {
        const query = {};
        if (req.query.role) {
            query.role = req.query.role;
        }

        const users = await User.find(query).select('-password -refreshToken').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/users/:id  (admin)
const deleteUser = async (req, res, next) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({ success: false, message: 'Admin cannot delete their own account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'shelter') {
            // a shelter with adopted pets is kept, so adoption records stay correct
            const adopted = await Pet.countDocuments({ shelter: user._id, status: 'adopted' });
            if (adopted > 0) {
                return res.status(400).json({ success: false, message: 'This shelter has adoption records, so it cannot be deleted' });
            }
            const pets = await Pet.find({ shelter: user._id }).select('_id');
            const petIds = pets.map((p) => p._id);
            await Application.deleteMany({ pet: { $in: petIds } });
            await Favourite.deleteMany({ pet: { $in: petIds } });
            await Pet.deleteMany({ shelter: user._id });
        }

        // remove the user's own applications and favourites
        await Application.deleteMany({ adopter: user._id, status: { $ne: 'approved' } });
        await Favourite.deleteMany({ user: user._id });
        await user.deleteOne();

        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, deleteUser };
