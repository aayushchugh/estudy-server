import { Router } from 'express';
import {
	postNewTestimonial,
	getAllTestimonials,
	getSingleTestimonial,
} from '../controller/testimonialController.js';

const router = Router();

router.route('/testimonial/add').post(postNewTestimonial);
router.route('/testimonial/all-testimonials').get(getAllTestimonials);
router.route('/testimonial/single-testimonial/:id').get(getSingleTestimonial);

export default router;
