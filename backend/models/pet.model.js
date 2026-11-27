const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required'],
        trim: true
    },
    species: {
        type: String,
        required: [true, 'Species is required'],
        enum: {
            values: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'],
            message: '{VALUE} is not a valid species'
        }
    },
    breed: {
        type: String,
        required: [true, 'Breed is required'],
        trim: true
    },
    // age in years
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [0, 'Age cannot be negative'],
        max: [30, 'Age looks too high']
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female'],
            message: 'Gender must be Male or Female'
        },
        required: [true, 'Gender is required']
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description can have at most 500 characters']
    },
    photoUrl: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Photo URL must start with http:// or https://']
    },
    status: {
        type: String,
        enum: ['available', 'adopted'],
        default: 'available'
    },
    // relationship: the shelter (User) that posted this pet
    shelter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // filled when a shelter approves an application
    adoptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    adoptedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// index for the search page (filter by species and status)
petSchema.index({ species: 1, status: 1 });
// index for the shelter dashboard
petSchema.index({ shelter: 1 });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
