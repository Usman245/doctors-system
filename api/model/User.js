const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: { type: String },
    phone: {
        type: String
    },
    bio: {
        type: String
    },
    about: {
        type: String
    },
    experiences: [{
        startingDate: { type: Date },
        endingDate: { type: Date },
        position: { type: String },
        hospital: { type: String }
    }],
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    photo: {
        type: String
    },
    qualifications: [{
        startingDate: { type: Date },
        endingDate: { type: Date },
        degree: { type: String },
        university: { type: String }
    }],
    specialization: {
        type: String
    },
    ticketPrice: {
        type: Number
    },
    timeSlots: [{
        day: { type: String },
        startingTime: { type: String },
        endingTime: { type: String }
    }],
    appointments: [{
        name: { type: String },
        gender: { type: String },
        payment: { type: String },
        price: { type: Number },


    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
