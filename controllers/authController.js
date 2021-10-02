const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/userModel.js');

/* --------------------------------- signup --------------------------------- */

exports.postUser = async function (req, res) {
	try {
		const { name, email, password } = req.body;

		// validate input
		if (!name || !email || !password) {
			return res.send({
				status: 400,
				message: 'password is required',
			});
		}

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// create new user
		const user = await User.create({
			name: name,
			email: email,
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
	try {
		const { password, email } = req.body;

		// validate input
		if (!password || !email) {
			return res.send({
				status: 400,
				message: 'email and password are required',
			});
		}

		// check if user exists
		const user = await User.findOne({
			email: email,
		});

		if (user) {
			// check if password is correct
			const matchedPassword = await bcrypt.compare(
				password.toString(),
				user.password
			);

			if (matchedPassword) {
				// generate token
				const token = jwt.sign(
					{
						id: user._id,
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
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};
