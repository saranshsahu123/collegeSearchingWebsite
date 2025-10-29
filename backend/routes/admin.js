const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');

// Models
const College = require('../models/College');
const Course = require('../models/Course');
const City = require('../models/City');

// --- Multer Image Upload Setup ---
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// @route   POST api/admin/colleges
// @desc    Add a new college
router.post('/colleges', [auth, upload.single('collegeImage')], async (req, res) => {
    const { name, description, fees, rank, location, cityId, courseIds } = req.body;
    try {
        const newCollege = new College({
            name,
            description,
            fees,
            rank,
            location,
            city: cityId,
            courses: JSON.parse(courseIds), // Assumes courseIds is a JSON array string
            imageUrl: req.file ? req.file.path : ''
        });
        const college = await newCollege.save();
        res.json(college);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/courses
// @desc    Add a new course
router.post('/courses', auth, async (req, res) => {
    const { name, description, avgFees } = req.body;
    try {
        const newCourse = new Course({ name, description, avgFees });
        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/admin/cities
// @desc    Add a new city
router.post('/cities', [auth, upload.single('cityImage')], async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCity = new City({
            name,
            description,
            imageUrl: req.file ? req.file.path : ''
        });
        const city = await newCity.save();
        res.json(city);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// You can also add PUT, and DELETE routes here for updating/deleting

module.exports = router;