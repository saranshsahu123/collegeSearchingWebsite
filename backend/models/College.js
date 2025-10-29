const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollegeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Main college image
    fees: { type: Number, required: true },
    rank: { type: Number, required: true },
    location: { type: String }, // e.g., "123 Main St, Cityville"
    // Relationships
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('College', CollegeSchema);