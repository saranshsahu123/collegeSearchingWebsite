const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    avgFees: { type: String, required: true },
});

module.exports = mongoose.model('Course', CourseSchema);