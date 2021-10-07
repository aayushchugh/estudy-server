const Testimonial = require('../models/testimonialModel.js');

/* --------------------------- add new testimonial -------------------------- */

exports.postNewTestimonial = async function (req, res) {
	try {
		const { name, content, rating } = req.body;

		// validate input
		if (!name || !content || !rating) {
			return res.send({
				status: 400,
				message: 'name, content, rating are required',
			});
		}

		// check if rating > 5 or < 0 than send error
		if (rating > 5 || rating < 0) {
			return res.send({
				status: 400,
				message: 'Rating must be between 0 and 5',
			});
		}

		// check if testimonial already exists
		const existingTestimonial = await Testimonial.findOne({
			name: name,
		});

		if (existingTestimonial) {
			return res.send({
				status: 400,
				message: 'Testimonial already exists',
			});
		}

		// create new testimonial
		const newTestimonial = await Testimonial.create({
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
};

/* -------------------------- get all testimonials -------------------------- */

exports.getAllTestimonials = async function (req, res) {
	try {
		// get all testimonials
		const testimonials = await Testimonial.find();

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
};

/* ------------------------- get single testimonial ------------------------- */

exports.getSingleTestimonial = async function (req, res) {
	try {
		const { id } = req.params;

		// find testimonial by id
		const testimonial = await Testimonial.findById(id);

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
};

/* --------------------------- update testimonial -------------------------- */

exports.patchTestimonial = async function (req, res) {
	try {
		const { name, content, rating } = req.body;
		const { id } = req.params;

		// validate input
		if (!name || !content || !rating) {
			return res.send({
				status: 400,
				message: 'name, content, rating are required',
			});
		}

		// check if testimonial with same name already exists
		const testimonialWithSameName = await Testimonial.findOne({
			name: name,
		});

		if (testimonialWithSameName) {
			return res.send({
				status: 400,
				message: 'testimonial with same name already exists',
			});
		}

		// check if rating > 5 or < 0 than send error
		if (rating > 5 || rating < 0) {
			return res.send({
				status: 400,
				message: 'Rating must be between 0 and 5',
			});
		}

		// update testimonial
		const updatedTestimonial = await Testimonial.findByIdAndUpdate(
			id,
			{ name: name, content: content, rating: rating },
			{ new: true }
		);

		// send data
		res.send({
			status: 200,
			message: 'testimonial updated successfully',
			data: updatedTestimonial,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* --------------------------- delete testimonial --------------------------- */

exports.deleteTestimonial = async function (req, res) {
	try {
		const { id } = req.params;

		// delete testimonial
		const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

		// send data
		res.send({
			status: 200,
			message: 'testimonial deleted successfully',
			data: deletedTestimonial,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
