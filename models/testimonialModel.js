import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
	name: { type: String, required: true },
	content: { type: String, required: true },
	rating: { type: String, required: true },
});

export default mongoose.model('Testimonial', testimonialSchema);
