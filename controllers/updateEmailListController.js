const md5 = require('md5');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const EmailList = require('../models/updateEmailListModel');

/* ------------------------------ add new email ----------------------------- */

exports.postNewEmail = async function (req, res) {
	try {
		const { name, email, class: userClass } = req.body;

		// validate input
		if (!name || !email || !userClass) {
			return res.send({
				status: 404,
				message: 'Please enter all fields',
			});
		}

		// find existing email
		const existingEmail = await EmailList.findOne({ email: email });

		// if email exists, send error
		if (existingEmail) {
			return res.send({
				status: 400,
				message: 'Email already exists',
			});
		} else {
			// add email to mailchimp list
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
			status: 400,
			message: 'Email looks fake',
		});
	}
};

/* ----------------------------- get all emails ----------------------------- */
exports.getAllEmails = async function (req, res) {
	try {
		// get all emails from DB
		const allEmails = await EmailList.find();

		// send data
		res.send({
			status: 200,
			data: allEmails,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------- remove email from list ------------------------- */
exports.unSubscribeEmail = async function (req, res) {
	const { email } = req.body;

	// validate input
	if (!email) {
		return res.send({
			status: 400,
			message: 'Please enter email',
		});
	}

	// hash email
	const subscriberHash = md5(email.toLowerCase());

	// unsubscribe email from mailchimp list
	const mailChimpRes = await mailchimp.lists.updateListMember(
		process.env.MAILCHIMP_LIST_ID,
		subscriberHash,
		{
			status: 'unsubscribed',
		}
	);

	// send data
	res.send({
		status: 200,
		message: 'Email unsubscribed successfully',
		data: {
			mailChimpId: mailChimpRes.id,
			full_name: mailChimpRes.full_name,
			email_address: mailChimpRes.email_address,
			unique_email_id: mailChimpRes.unique_email_id,
			contact_id: mailChimpRes.contact_id,
		},
	});
};
