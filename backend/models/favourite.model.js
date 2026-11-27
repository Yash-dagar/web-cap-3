const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    }
}, { timestamps: true });

// same pet cannot be added twice by the same user
favouriteSchema.index({ user: 1, pet: 1 }, { unique: true });

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
