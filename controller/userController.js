import userModel from '../models/userModel.js';

/* ------------------------------ get all users ----------------------------- */

export async function getAllUsers(req, res) {
	try {
		// get all users
		const users = await userModel.find();

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
}

/* ------------------------------- delete user ------------------------------ */

export async function deleteUser(req, res) {
	try {
		const { id } = req.params;

		// delete user
		const deleteUser = await userModel.findByIdAndDelete(id);

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
}
