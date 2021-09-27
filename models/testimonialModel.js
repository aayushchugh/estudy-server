const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
	name: { type: String, required: true },
	content: { type: String, required: true },
	rating: { type: String, required: true },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
