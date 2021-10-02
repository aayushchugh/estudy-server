const ContactUs = require('../models/contactUsModel');

/* ----------------------------- add new contact ---------------------------- */

exports.postContact = async function (req, res) {
	try {
		const { name, email, subject, message } = req.body;

		// validate input
		if (!name || !email || !subject || !message) {
			return res.send({
				status: 400,
				message: 'name, email, subject, message all are required',
			});
		}

		// check if email already exist
		const existingEmail = await ContactUs.findOne({ email: email });

		if (existingEmail) {
			return res.send({
				status: 400,
				message: 'wait for your previous message to be closed',
			});
		}

		// create new contact
		const newContact = await ContactUs.create({
			name: name,
			email: email,
			subject: subject,
			message: message,
			status: 'waiting-response',
		});

		// send data
		res.send({
			status: 201,
			message: 'Your message has been added successfully',
			data: newContact,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'Internal server error',
		});
	}
};

/* ---------------------------- get all contacts ---------------------------- */

exports.getAllContacts = async function (req, res) {
	try {
		// get all contacts from database
		const allContacts = await ContactUs.find();

		// send data
		res.send({
			status: 200,
			data: allContacts,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* --------------------------- get single contact --------------------------- */

exports.getSingleContact = async function (req, res) {
	try {
		const { id } = req.params;

		const contact = await ContactUs.findById(id);

		// check if contact exist
		if (!contact) {
			return res.send({
				status: 400,
				message: 'invalid id',
			});
		}

		// send data
		res.send({
			status: 200,
			data: contact,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------------ update status ----------------------------- */

exports.patchContact = async function (req, res) {
	try {
		const { id, status } = req.body;

		// validate input
		if (!id || !status) {
			return res.send({
				status: 400,
				message: 'id and status are required',
			});
		}

		// check if status is valid
		if (
			status === 'waiting-response' ||
			status === 'opened' ||
			status === 'closed'
		) {
			// check if contact exist
			const contact = await ContactUs.findById(id);

			if (!contact) {
				return res.send({
					status: 400,
					message: 'contact not found please check id',
				});
			}

			// update status
			const updatedContact = await ContactUs.findByIdAndUpdate(id, {
				status: status,
			});

			// send data
			res.send({
				status: 200,
				message: 'status updated successfully',
				data: updatedContact,
			});
		} else {
			// send data
			res.send({
				status: 400,
				message: 'invalid status',
			});
		}
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ----------------------------- delete contact ----------------------------- */

exports.deleteContact = async function (req, res) {
	try {
		const { id } = req.params;
		const contact = await ContactUs.findByIdAndDelete(id);

		// check if contact exists
		if (!contact) {
			return res.send({
				status: 400,
				message: 'contact not found please check id',
			});
		}

		// send data
		res.send({
			status: 200,
			message: 'contact deleted successfully',
			data: contact,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
