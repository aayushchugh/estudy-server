const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModel.js');

/* --------------------------------- signup --------------------------------- */

exports.postUser = async function (req, res) {
	try {
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// create new user
		const user = await User.create({
			name: req.body.name,
			email: req.body.email,
			class: 'undefined',
			password: hashedPassword,
		});

		// send data
		res.json({
			status: 201,
			message: 'successfully created new user',
			data: user,
		});
	} catch (err) {
		res.json({ status: 400, message: 'Duplicate email' });
	}
};

/* ---------------------------------- login --------------------------------- */

exports.postLogin = async function (req, res) {
	// check if user exists
	const user = await User.findOne({
		email: req.body.email,
	});

	if (user) {
		// check if password is correct
		const matchedPassword = await bcrypt.compare(
			req.body.password.toString(),
			user.password
		);

		if (matchedPassword) {
			// generate token
			const token = jwt.sign(
				{
					name: user.name,
					email: user.email,
					class: user.class,
				},
				process.env.AUTH_SECRET
			);

			// send data
			return res.json({
				status: 200,
				message: 'logged in successfully',
				data: user,
				token: token,
			});
		} else {
			return res.json({
				status: 400,
				message: 'wrong password',
			});
		}
	} else {
		return res.json({
			status: 404,
			message: 'user not found',
		});
	}
};
