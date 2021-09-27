import testimonialModel from '../models/testimonialModel.js';

/* --------------------------- add new testimonial -------------------------- */

export async function postNewTestimonial(req, res) {
	try {
		const { name, content, rating } = req.body;

		// check if rating > 5 or < 0 than send error
		if (rating > 5 || rating < 0) {
			return res.send({
				status: 400,
				message: 'Rating must be between 0 and 5',
			});
		}

		// create new testimonial
		const newTestimonial = await testimonialModel.create({
			name: name,
			content: content,
			rating: rating,
		});

		// send data
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
		// get all testimonials
		const testimonials = await testimonialModel.find();

		// send data
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

		// find testimonial by id
		const testimonial = await testimonialModel.findById(id);

		// send data
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

		// check if rating > 5 or < 0 than send error
		if (rating > 5 || rating < 0) {
			return res.send({
				status: 400,
				message: 'Rating must be between 0 and 5',
			});
		}

		// update testimonial
		const updatedTestimonial = await testimonialModel.findByIdAndUpdate(
			id,
			{ name: name, content: content, rating: rating },
			{ new: true }
		);

		// send data
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

		// delete testimonial
		const deletedTestimonial = await testimonialModel.findByIdAndDelete(id);

		// send data
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
