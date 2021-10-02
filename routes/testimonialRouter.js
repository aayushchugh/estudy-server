const express = require('express');

const testimonialController = require('../controllers/testimonialController');

const router = express.Router();

router.route('/testimonial/add').post(testimonialController.postNewTestimonial);

router
	.route('/testimonial/get-all')
	.get(testimonialController.getAllTestimonials);

router
	.route('/testimonial/single-testimonial/:id')
	.get(testimonialController.getSingleTestimonial);

router
	.route('/testimonial/update/:id')
	.patch(testimonialController.patchTestimonial);

router
	.route('/testimonial/delete/:id')
	.delete(testimonialController.deleteTestimonial);

module.exports = router;
