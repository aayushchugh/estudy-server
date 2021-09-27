const EmailList = require('../models/updateEmailListModel');
const mailchimp = require('@mailchimp/mailchimp_marketing');

/* ------------------------------ add new email ----------------------------- */

exports.postNewEmail = async function (req, res) {
	try {
		const { name, email, class: userClass } = req.body;

		// find existing email
		const existingEmail = await EmailList.findOne({ email: email });

		// if email exists, send error
		if (existingEmail) {
			return res.send({
				status: 400,
				message: 'Email already exists',
			});
		} else {
			mailchimp.setConfig({
				apiKey: process.env.MAILCHIMP_API_KEY,
				server: process.env.MAILCHIMP_SERVER,
			});

			const mailChimpRes = await mailchimp.lists.addListMember(
				process.env.MAILCHIMP_LIST_ID,
				{
					email_address: email,
					status: 'subscribed',
					merge_fields: {
						NAME: name,
						CLASS: Number(userClass),
					},
				}
			);

			if (mailChimpRes) {
				// add new email to DB
				const newEmail = await EmailList.create({
					name: name,
					email: email,
					class: userClass,
					mailchimp_id: mailChimpRes.id,
				});

				// send data
				res.send({
					status: 201,
					message: 'Email added successfully',
					data: newEmail,
				});
			}
		}
	} catch (err) {
		res.send({
			status: 500,
			message: 'Internal server error',
		});
	}
};
