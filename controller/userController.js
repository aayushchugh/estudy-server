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
