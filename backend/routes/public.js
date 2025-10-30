const express = require('express');
const router = express.Router();

const College = require('../models/College');
const Course = require('../models/Course');
const City = require('../models/City');

// @route   GET api/public/colleges
// @desc    Get all colleges with filters
router.get('/colleges', async (req, res) => {
    try {
        const { course, city, rank } = req.query;
        let filter = {};

        if (course) filter.courses = course; // Assumes course is an ID
        if (city) filter.city = city; // Assumes city is an ID
        
        let sort = {};
        if (rank) sort.rank = rank === 'asc' ? 1 : -1;

        const colleges = await College.find(filter)
            .populate('city', 'name')
            .populate('courses', 'name')
            .sort(sort);
            
        res.json(colleges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/courses
// @desc    Get all courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        // For each course, find how many colleges offer it
        const coursesWithCount = await Promise.all(courses.map(async (course) => {
            const count = await College.countDocuments({ courses: course._id });
            return { ...course.toObject(), collegeCount: count };
        }));
        res.json(coursesWithCount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/cities
// @desc    Get all cities
router.get('/cities', async (req, res) => {
    try {
        const cities = await City.find();
         // For each city, find how many colleges are in it
        const citiesWithCount = await Promise.all(cities.map(async (city) => {
            const count = await College.countDocuments({ city: city._id });
            return { ...city.toObject(), collegeCount: count };
        }));
        res.json(citiesWithCount);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/colleges/by-course/:courseId
// @desc    Get colleges for a specific course
router.get('/colleges/by-course/:courseId', async (req, res) => {
    try {
        const colleges = await College.find({ courses: req.params.courseId })
            .populate('city', 'name');
        res.json(colleges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/colleges/by-city/:cityId
// @desc    Get colleges in a specific city
router.get('/colleges/by-city/:cityId', async (req, res) => {
    try {
        const colleges = await College.find({ city: req.params.cityId })
            .populate('courses', 'name');
        res.json(colleges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// backend/routes/public.js

// ... (all your existing routes)

// @route   GET api/public/colleges/:id
// @desc    Get a single college by its ID
router.get('/colleges/:id', async (req, res) => {
    try {
        const college = await College.findById(req.params.id)
            .populate('city', 'name')
            .populate('courses', 'name');
        if (!college) return res.status(404).json({ msg: 'College not found' });
        res.json(college);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/courses/:id
// @desc    Get a single course by its ID
router.get('/courses/:id', async (req, res) => {
    try {
        // Also find all colleges that offer this course
        const course = await Course.findById(req.params.id);
        const colleges = await College.find({ courses: req.params.id })
            .populate('city', 'name');
        
        if (!course) return res.status(404).json({ msg: 'Course not found' });
        res.json({ course, colleges });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/public/cities/:id
// @desc    Get a single city by its ID
router.get('/cities/:id', async (req, res) => {
    try {
        // Also find all colleges in this city
        const city = await City.findById(req.params.id);
        const colleges = await College.find({ city: req.params.id })
            .populate('courses', 'name');
            
        if (!city) return res.status(404).json({ msg: 'City not found' });
        res.json({ city, colleges });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;