const Class = require('../models/classModel');

/* ------------------------------ add new class ----------------------------- */

exports.postNewClass = async function (req, res) {
	try {
		// get data from user
		const { title, description } = req.body;

		// create new class
		const newClass = await Class.create({
			title: title,
			description: description,
			subjects: [],
		});

		// send response
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

/* ----------------------------- get all classes ---------------------------- */
exports.getAllClasses = async function (req, res) {
	try {
		// get all classes
		const classes = await Class.find();

		// send response
		res.send({
			status: 200,
			data: classes,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ---------------------------- get single class ---------------------------- */
exports.getSingleClass = async function (req, res) {
	try {
		// get class id
		const { id } = req.params;

		// get class
		const classInfo = await Class.findById(id);

		if (!classInfo) {
			return res.send({
				status: 400,
				message: 'class not found, check id',
			});
		}

		// send response
		res.send({
			status: 200,
			data: classInfo,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------ update class ------------------------------ */
exports.patchClass = async function (req, res) {
	try {
		// get class id
		const { id } = req.params;

		// get data from user
		const { title, description } = req.body;

		// update class
		const updatedClass = await Class.findByIdAndUpdate(
			id,
			{
				title: title,
				description: description,
			},
			{ new: true }
		);

		// check if class exists
		if (!updatedClass) {
			return res.send({
				status: 400,
				message: 'class not found, check id',
			});
		}

		// send data
		res.send({
			status: 200,
			data: updatedClass,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
