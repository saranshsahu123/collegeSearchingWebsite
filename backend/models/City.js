const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    imageUrl: { type: String } // Path to an image
});

module.exports = mongoose.model('City', CitySchema);