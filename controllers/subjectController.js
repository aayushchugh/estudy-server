const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');
const Notes = require('../models/notesModel');
const Pyq = require('../models/pyqModel');
const NcertSolution = require('../models/ncertSolutionModel');

/* ----------------------------- add new subject ---------------------------- */

exports.postNewSubject = async function (req, res) {
	try {
		const { title, class: classFromUser } = req.body;

		// validate input
		if (!title || !classFromUser) {
			return res.send({
				status: 400,
				message: 'Both title and class are required',
			});
		}
		// get class from db
		const classFromDb = await Class.findOne({
			title: classFromUser,
		}).populate('subjects');

		// check if class exists
		if (!classFromDb) {
			return res.send({
				status: 400,
				message: 'Class not found',
			});
		}

		// check if class already includes subject
		const subjectInClass = classFromDb.subjects.find(
			subject => subject.title === title
		);

		if (subjectInClass) {
			return res.send({
				status: 400,
				message: 'Subject already exists in this class',
			});
		}

		// create new subject
		const newSubject = await Subject.create({
			title: title,
			classTitle: classFromDb.title,
			classId: classFromDb._id,
			notes: [],
			pyqs: [],
			ncertSolutions: [],
		});

		// add subject to class
		classFromDb.subjects.push(newSubject._id);
		classFromDb.save();

		// send response
		res.send({
			status: 201,
			message: 'Subject created successfully',
			data: newSubject,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ---------------------------- get all subjects ---------------------------- */
exports.getAllSubjects = async function (req, res) {
	try {
		const { class: classFromQuery, all } = req.query;

		if (all && classFromQuery) {
			return res.send({
				status: 400,
				message: "all and class can't be together",
			});
		}

		// validate input
		if (all && all !== 'true') {
			return res.send({
				status: 400,
				message: 'all must be true',
			});
		}

		// send all classes
		if (all === 'true') {
			// get all subjects from db
			const subjects = await Subject.find();

			// send response
			return res.send({
				status: 200,
				data: subjects,
			});
		}

		// get class from db
		const classFromDb = await Class.findOne({
			title: classFromQuery,
		}).populate('subjects');

		// check if class exists
		if (!classFromDb) {
			return res.send({
				status: 400,
				message: 'Class not found',
			});
		}

		// send response
		res.send({
			status: 200,
			data: classFromDb.subjects,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* --------------------------- get single subject --------------------------- */
exports.getSingleSubject = async function (req, res) {
	try {
		const { id } = req.params;
		const { notes, pyqs, ncertSolutions, all } = req.query;

		// validate query
		if (
			(notes && notes !== 'true') ||
			(pyqs && pyqs !== 'true') ||
			(ncertSolutions && ncertSolutions !== 'true') ||
			(all && all !== 'true')
		) {
			return res.send({
				status: 400,
				message: 'your query are not correct the must be true or null',
			});
		}

		// send with notes
		if (notes && notes === 'true') {
			const subject = await Subject.findById(id).populate('notes');

			// check if subject exists
			if (!subject) {
				return res.send({
					status: 400,
					message: 'subject not found invalid id',
				});
			}

			return res.send({
				status: 200,
				data: subject,
			});
		}

		// send with pyqs
		if (pyqs && pyqs === 'true') {
			const subject = await Subject.findById(id).populate('pyqs');

			// check if subject exists
			if (!subject) {
				return res.send({
					status: 400,
					message: 'subject not found invalid id',
				});
			}

			return res.send({
				status: 200,
				data: subject,
			});
		}

		// send with ncertSolutions
		if (ncertSolutions && ncertSolutions === 'true') {
			const subject = await Subject.findById(id).populate(
				'ncertSolutions'
			);

			// check if subject exists
			if (!subject) {
				return res.send({
					status: 400,
					message: 'subject not found invalid id',
				});
			}

			return res.send({
				status: 200,
				data: subject,
			});
		}

		// send all
		if (all && all === 'true') {
			const subject = await Subject.findById(id)
				.populate('notes')
				.populate('pyqs')
				.populate('ncertSolutions');

			// check if subject exists
			if (!subject) {
				return res.send({
					status: 400,
					message: 'subject not found invalid id',
				});
			}

			return res.send({
				status: 200,
				data: subject,
			});
		}

		// get subject from db
		const subject = await Subject.findById(id);

		// check if subject exists
		if (!subject) {
			return res.send({
				status: 400,
				message: 'subject not found invalid id',
			});
		}

		// send response
		res.send({
			status: 200,
			data: subject,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ----------------------------- update subject ----------------------------- */
exports.patchSubject = async function (req, res) {
	try {
		const { id } = req.params;
		const { title } = req.body;

		// validate input
		if (!title) {
			return res.send({
				status: 400,
				message: 'title is required',
			});
		}

		// check if subject with same title exits already

		const subject = await Subject.findById(id);

		const subjectClass = await Class.findById(subject.classId).populate(
			'subjects'
		);

		const subjectWithSameTitle = subjectClass.subjects.find(
			subject => subject.title === title
		);

		if (subjectWithSameTitle) {
			return res.send({
				status: 400,
				message: 'subject with same title already exists',
			});
		}

		// get subject from db
		const updatedSubject = await Subject.findByIdAndUpdate(
			id,
			{
				title: title,
			},
			{ new: true }
		);

		// check if subject exists
		if (!updatedSubject) {
			return res.send({
				status: 400,
				message: 'subject not found invalid id',
			});
		}

		// send response
		res.send({
			status: 200,
			message: 'subject updated successfully',
			data: updatedSubject,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ----------------------------- delete subject ----------------------------- */
exports.deleteSubject = async function (req, res) {
	try {
		const { id } = req.params;

		// get subject from db
		const subject = await Subject.findById(id);

		// check if subject exists
		if (!subject) {
			return res.send({
				status: 400,
				message: 'subject not found invalid id',
			});
		}

		// delete notes, pyq, and ncert solutions from db
		await Notes.deleteMany({ _id: { $in: subject.notes } });
		await Pyq.deleteMany({ _id: { $in: subject.pyqs } });
		await NcertSolution.deleteMany({
			_id: { $in: subject.ncertSolutions },
		});

		// get subject class
		const classFromDb = await Class.findById(subject.classId);

		// find subject in class
		const subjectInClass = await classFromDb.subjects.find(
			id => id === subject._id
		);

		// remove subject from class
		classFromDb.subjects.splice(
			classFromDb.subjects.indexOf(subjectInClass),
			1
		);

		await classFromDb.save();

		// delete subject
		const deletedSubject = await Subject.findByIdAndDelete(id);

		// check if subject exists
		if (!deletedSubject) {
			return res.send({
				status: 400,
				message: 'subject not found invalid id',
			});
		}

		// send response
		res.send({
			status: 200,
			message: 'subject deleted successfully',
			data: deletedSubject,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
