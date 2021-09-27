import { default as emailListModel } from '../models/updateEmailListModel.js';

/* ------------------------------ add new email ----------------------------- */

export async function postNewEmail(req, res) {
	try {
		const { name, email, class: userClass } = req.body;

		// find existing email
		const existingEmail = await emailListModel.findOne({ email: email });

		// if email exists, send error
		if (existingEmail) {
			return res.send({
				status: 400,
				message: 'Email already exists',
			});
		} else {
			// add new email to DB
			const newEmail = await emailListModel.create({
				name: name,
				email: email,
				class: userClass,
			});

			// send data
			res.send({
				status: 201,
				message: 'Email added successfully',
				data: newEmail,
			});
		}
	} catch (err) {
		res.send({
			status: 500,
			message: 'Internal server error',
		});
	}
}
