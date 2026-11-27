const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    adopter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // saved here also so the shelter can find its applications easily
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please tell the shelter why you want to adopt'],
        trim: true,
        minlength: [10, 'Message should be at least 10 characters'],
        maxlength: [500, 'Message can have at most 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    decidedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// one adopter can apply only once for the same pet
applicationSchema.index({ pet: 1, adopter: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
