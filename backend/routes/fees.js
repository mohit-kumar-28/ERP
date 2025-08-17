const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Fee = require('../models/Fee');
const Student = require('../models/Student');

// @route   GET api/fees
// @desc    Get all fees
// @access  Private
router.get('/', async (req, res) => {
    try {
        const fees = await Fee.find()
            .populate('student', ['admissionNumber', 'firstName', 'lastName', 'class'])
            .sort({ dueDate: 1 });
        res.json(fees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/fees/student/:studentId
// @desc    Get all fees for a specific student
// @access  Private
router.get('/student/:studentId', async (req, res) => {
    try {
        const fees = await Fee.find({ student: req.params.studentId })
            .sort({ dueDate: 1 });
        res.json(fees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/fees
// @desc    Create a fee record
// @access  Private
router.post('/', [
    check('student', 'Student ID is required').not().isEmpty(),
    check('academicYear', 'Academic year is required').not().isEmpty(),
    check('feeType', 'Fee type is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('dueDate', 'Due date is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            student,
            academicYear,
            feeType,
            amount,
            dueDate,
            paymentMethod,
            transactionId,
            remarks
        } = req.body;

        // Check if student exists
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const fee = new Fee({
            student,
            academicYear,
            feeType,
            amount,
            dueDate,
            paymentMethod,
            transactionId,
            remarks
        });

        await fee.save();
        res.json(fee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/fees/:id
// @desc    Update a fee record
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!fee) {
            return res.status(404).json({ msg: 'Fee record not found' });
        }

        res.json(fee);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Fee record not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/fees/:id
// @desc    Delete a fee record
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);
        if (!fee) {
            return res.status(404).json({ msg: 'Fee record not found' });
        }
        res.json({ msg: 'Fee record removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Fee record not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 