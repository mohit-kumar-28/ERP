const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Student = require('../models/Student');

// @route   GET api/students
// @desc    Get all students
// @access  Private
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ admissionNumber: 1 });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/students
// @desc    Create a student
// @access  Private
router.post('/', [
    check('admissionNumber', 'Admission number is required').not().isEmpty(),
    check('firstName', 'First name is required').not().isEmpty(),
    check('lastName', 'Last name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('class', 'Class is required').not().isEmpty(),
    check('section', 'Section is required').not().isEmpty(),
    check('rollNumber', 'Roll number is required').not().isEmpty(),
    check('parentName', 'Parent name is required').not().isEmpty(),
    check('parentPhone', 'Parent phone is required').not().isEmpty(),
    check('parentEmail', 'Please include a valid email').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            admissionNumber,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            class: studentClass,
            section,
            rollNumber,
            parentName,
            parentPhone,
            parentEmail,
            address
        } = req.body;

        // Check if student already exists
        let student = await Student.findOne({ admissionNumber });
        if (student) {
            return res.status(400).json({ msg: 'Student already exists' });
        }

        student = new Student({
            admissionNumber,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            class: studentClass,
            section,
            rollNumber,
            parentName,
            parentPhone,
            parentEmail,
            address
        });

        await student.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/:id
// @desc    Update a student
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/students/:id
// @desc    Delete a student
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Student not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router; 