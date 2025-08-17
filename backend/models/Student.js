const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    parentPhone: {
        type: String,
        required: true
    },
    parentEmail: {
        type: String,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Graduated'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema); 