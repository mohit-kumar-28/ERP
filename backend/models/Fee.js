const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    feeType: {
        type: String,
        enum: ['Tuition', 'Transport', 'Library', 'Computer', 'Sports', 'Other'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Online', 'Cheque', 'Other']
    },
    transactionId: {
        type: String
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Fee', feeSchema); 