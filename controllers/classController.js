const Class = require('../models/classModel');

exports.postNewClass = async function (req, res) {
	try {
		const { title, description } = req.body;

		const newClass = await Class.create({
			title: title,
			description: description,
			subjects: [],
		});

		res.send({
			status: 204,
			message: 'Class created successfully',
			data: newClass,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};
