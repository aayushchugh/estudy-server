import testimonialModel from '../models/testimonialModel.js';

/* --------------------------- add new testimonial -------------------------- */

export async function postNewTestimonial(req, res) {
	try {
		const { name, content, rating } = req.body;

		const newTestimonial = await testimonialModel.create({
			name: name,
			content: content,
			rating: rating,
		});

		res.send({
			status: 201,
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

		if (testimonial) {
			res.send({
				status: 200,
				data: testimonial,
			});
		} else {
			res.send({
				status: 400,
				message: 'invalid id',
			});
		}
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
}

/* --------------------------- update testimonial -------------------------- */
export async function updateTestimonial(req, res) {
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
			data: updatedTestimonial,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
}
