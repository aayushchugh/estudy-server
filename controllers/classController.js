const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');
const Notes = require('../models/notesModel');
const Pyq = require('../models/pyqModel');
const NcertSolution = require('../models/ncertSolutionModel');

/* ------------------------------ add new class ----------------------------- */

exports.postNewClass = async function (req, res) {
	try {
		// get data from user
		const { title, description } = req.body;

		// validate input
		if (!title || !description) {
			return res.send({
				status: 400,
				message: 'both title and description are required',
			});
		}

		// check for existing class
		const existingClass = await Class.findOne({ title: title });

		if (existingClass) {
			return res.send({
				status: 400,
				message: 'class already exists',
			});
		}

		// create new class
		const newClass = await Class.create({
			title: title,
			description: description,
			subjects: [],
		});

		// send response
		res.send({
			status: 201,
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
		const { subjects } = req.query;

		if (subjects === 'true') {
			// get all classes
			const classes = await Class.find().populate('subjects');

			// send response
			res.send({
				status: 200,
				data: classes,
			});
		} else {
			// get all classes
			const classes = await Class.find();

			// send response
			res.send({
				status: 200,
				data: classes,
			});
		}
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
		const { subjects } = req.query;

		if (subjects === 'true') {
			// get class
			const classInfo = await Class.findById(id).populate('subjects');

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
		} else {
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
		}
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

		// validate input
		if (!title || !description) {
			return res.send({
				status: 400,
				message: 'both title and description are required',
			});
		}

		// check if class with same title exists
		const classWithSameTitle = await Class.findOne({ title: title });

		if (classWithSameTitle) {
			return res.send({
				status: 400,
				message: 'class with same title already exists',
			});
		}

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

/* ------------------------------ delete class ------------------------------ */
exports.deleteClass = async function (req, res) {
	try {
		// get class id
		const { id } = req.params;

		// get class from db
		const classInfo = await Class.findById(id).populate('subjects');

		// check if class exists
		if (!classInfo) {
			return res.send({
				status: 400,
				message: 'class not found, check id',
			});
		}

		// delete notes, pyq, and ncert solutions from db

		classInfo.subjects.forEach(async subject => {
			await Notes.deleteMany({ _id: { $in: subject.notes } });

			await NcertSolution.deleteMany({
				_id: { $in: subject.ncertSolutions },
			});

			await Pyq.deleteMany({ _id: { $in: subject.pyqs } });
		}),
			// delete subjects from class
			await Subject.deleteMany({ _id: { $in: classInfo.subjects } });

		// delete class
		const deletedClass = await Class.findByIdAndDelete(id);

		// send data
		res.send({
			status: 200,
			data: deletedClass,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
