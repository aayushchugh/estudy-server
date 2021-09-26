import testimonialModel from '../models/testimonialModel.js';

/* --------------------------- add new testimonial -------------------------- */

export async function postNewTestimonial(req, res) {
	try {
		const { name, content, rating } = req.body;

		if (rating > 5 || rating < 0) {
			return res.send({
				status: 400,
				message: 'Rating must be between 0 and 5',
			});
		}

		const newTestimonial = await testimonialModel.create({
			name: name,
			content: content,
			rating: rating,
		});

		res.send({
			status: 201,
			message: 'testimonial created successfully',
			data: newTestimonial,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
}

/* -------------------------- get all testimonials -------------------------- */

export async function getAllTestimonials(req, res) {
	try {
		const testimonials = await testimonialModel.find();

		res.send({
			status: 200,
			data: testimonials,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
}

/* ------------------------- get single testimonial ------------------------- */

export async function getSingleTestimonial(req, res) {
	try {
		const { id } = req.params;

		const testimonial = await testimonialModel.findById(id);

		res.send({
			status: 200,
			data: testimonial,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
}

/* --------------------------- update testimonial -------------------------- */

export async function patchTestimonial(req, res) {
	try {
		const { name, content, rating } = req.body;
		const { id } = req.params;

		const updatedTestimonial = await testimonialModel.findByIdAndUpdate(
			id,
			{ name: name, content: content, rating: rating },
			{ new: true }
		);

		res.send({
			status: 204,
			message: 'testimonial updated successfully',
			data: updatedTestimonial,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
}

/* --------------------------- delete testimonial --------------------------- */

export async function deleteTestimonial(req, res) {
	try {
		const { id } = req.params;

		const deletedTestimonial = await testimonialModel.findByIdAndDelete(id);

		res.send({
			status: 204,
			message: 'testimonial deleted successfully',
			data: deletedTestimonial,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
}
