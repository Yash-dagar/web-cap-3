const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        maxlength: [60, 'Name can have at most 60 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email is not valid']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    // adopter = normal user, shelter = posts pets, admin = manages everything
    role: {
        type: String,
        enum: {
            values: ['adopter', 'shelter', 'admin'],
            message: 'Role must be adopter, shelter or admin'
        },
        default: 'adopter'
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Phone number must be 10 digits']
    },
    city: {
        type: String,
        trim: true
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
