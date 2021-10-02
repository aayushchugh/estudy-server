const express = require('express');
const contactUsController = require('../controllers/contactUsController');

const router = express.Router();

router.route('/contact-us/new').post(contactUsController.postContact);

router.route('/contact-us/get-all').get(contactUsController.getAllContacts);

router
	.route('/contact-us/get-single/:id')
	.get(contactUsController.getSingleContact);

router.route('/contact-us/update').patch(contactUsController.patchContact);

router
	.route('/contact-us/delete/:id')
	.delete(contactUsController.deleteContact);

module.exports = router;
