import userModel from '../models/userModel.js';

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
