import { default as jwt } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userModel from '../models/userModel.js';

/* --------------------------------- signup --------------------------------- */

export async function postUser(req, res) {
	try {
		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// create new user
		const user = await userModel.create({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});

		return res.json({
			status: 201,
			message: 'successfully created new user',
			data: user,
		});
	} catch (err) {
		console.log('====================================');
		console.log(err);
		console.log('====================================');
		res.json({ status: 400, message: 'Duplicate email' });
	}
}

/* ---------------------------------- login --------------------------------- */

export async function postLogin(req, res) {
	// check if user exists
	const user = await userModel.findOne({
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
				},
				process.env.AUTH_SECRET
			);

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
}
