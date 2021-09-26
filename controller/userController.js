import userModel from '../models/userModel.js';

/* ------------------------------ get all users ----------------------------- */

export async function getAllUsers(req, res) {
	try {
		const users = await userModel.find();

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
		await userModel.findByIdAndDelete(id);

		res.send({
			status: 200,
			message: 'user deleted successfully',
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
}
