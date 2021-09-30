const bcrypt = require('bcrypt');
const User = require('../models/userModel');

/* ------------------------------ get all users ----------------------------- */

exports.getAllUsers = async function (req, res) {
	try {
		// get all users
		const users = await User.find();

		// send data
		res.send({
			status: 200,
			data: users,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------------- update user ------------------------------ */

exports.patchUser = async function (req, res) {
	try {
		const { id } = req.params;
		const { name, existingPassword, updatePassword, userClass } = req.body;

		const user = await User.findById(id);

		// check if user exists
		if (!user) {
			return res.send({
				status: 400,
				message: 'user not found check id',
			});
		}

		// check if password is correct
		const doPasswordMatch = await bcrypt.compare(
			existingPassword,
			user.password
		);

		if (!doPasswordMatch) {
			return res.send({
				status: 400,
				message: 'invalid password',
			});
		}

		// validate class
		if (userClass === '9' || userClass === '10' || userClass === '11') {
			// hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(updatePassword, salt);

			// update user
			const updatedUser = await User.findByIdAndUpdate(id, {
				name: name,
				password: hashedPassword,
				class: userClass,
			});

			res.send({
				status: 204,
				message: 'successfully updated user',
				data: updatedUser,
			});
		} else {
			res.send({
				status: 400,
				message: 'invalid class',
			});
		}
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- delete user ------------------------------ */

exports.deleteUser = async function (req, res) {
	try {
		const { id } = req.params;

		// delete user
		const deleteUser = await User.findByIdAndDelete(id);

		// send data
		res.send({
			status: 200,
			message: 'user deleted successfully',
			data: deleteUser,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
