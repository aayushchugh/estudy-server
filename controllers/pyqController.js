const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');
const Pyqs = require('../models/pyqModel');

/* ------------------------------ post new pyq ----------------------------- */
exports.postNewPyq = async function (req, res) {
	try {
		const { title, link, subject, class: userClass } = req.body;

		// validate user input
		if (!title || !link || !subject || !userClass) {
			return res.send({
				status: 400,
				message: 'title, link, subject and class are required',
			});
		}

		// get class from db
		const classFromDb = await Class.findOne({ title: userClass }).populate(
			'subjects'
		);

		// check if class exists
		if (!classFromDb) {
			return res.send({
				status: 400,
				message: 'class does not exist',
			});
		}

		// get subject from class
		const subjectFromClass = classFromDb.subjects.find(
			({ title }) => title === subject
		);

		// check if subject exists
		if (!subjectFromClass) {
			return res.send({
				status: 400,
				message: 'subject does not exist',
			});
		}

		// get subject from db
		const subjectFromDb = await Subject.findOne({
			_id: subjectFromClass._id,
		});

		// crete new pyq
		const newPyq = await Pyqs.create({
			title: title,
			link: link,
			subjectTitle: subjectFromDb.title,
			subjectId: subjectFromDb._id,
			classId: classFromDb._id,
			classTitle: classFromDb.title,
		});

		// add pyq to subject
		subjectFromDb.pyqs.push(newPyq._id);
		subjectFromDb.save();

		// send response
		res.send({
			status: 201,
			message: 'pyq created',
			data: newPyq,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------------ get all pyqs ----------------------------- */

exports.getAllPyqs = async function (req, res) {
	try {
		const { subject, class: classFromQuery, all } = req.query;

		// validate user input
		if (subject && !classFromQuery) {
			return res.send({
				status: 400,
				message: 'subject and class both are required together',
			});
			// eslint-disable-next-line sonarjs/no-duplicated-branches
		} else if (!subject && classFromQuery) {
			const pyqs = await Pyqs.find({ classTitle: classFromQuery });

			if (!pyqs || pyqs.length === 0) {
				return res.send({
					status: 400,
					message: 'there are no pyqs for this class',
				});
			}

			return res.send({
				status: 200,
				data: pyqs,
			});
		}

		if (subject && classFromQuery && all) {
			return res.send({
				status: 400,
				message: 'subject, class and all cant be together',
			});
		}

		if (all && all !== 'true') {
			return res.send({
				status: 400,
				message: 'all must be true',
			});
		}

		// send all pyqs if all is true
		if (all === 'true') {
			// get all pyqs
			const allPyqs = await Pyqs.find();

			return res.send({
				status: 200,
				data: allPyqs,
			});
		}

		// get subject from db
		const subjectFromDb = await Subject.findOne({
			title: subject,
			classTitle: classFromQuery,
		}).populate('pyqs');

		// check if subject exists
		if (!subjectFromDb) {
			return res.send({
				status: 400,
				message: 'subject or class does not exist',
			});
		}

		// check if there are pyqs present in subject
		if (subjectFromDb.pyqs.length === 0) {
			return res.send({
				status: 400,
				message: 'no pyqs present in subject',
			});
		}

		// send pyqs
		res.send({
			status: 200,
			data: subjectFromDb.pyqs,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ----------------------------- get single pyq ---------------------------- */
exports.getSinglePyq = async function (req, res) {
	try {
		const { id } = req.params;

		// find pyq
		const pyq = await Pyqs.findById(id);

		// check if pyq exists
		if (!pyq) {
			return res.send({
				status: 400,
				message: 'pyq does not exist check your id',
			});
		}

		// send pyq
		res.send({
			status: 200,
			data: pyq,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- update pyq ------------------------------ */
exports.patchPyq = async function (req, res) {
	try {
		const { id } = req.params;
		const { title, link } = req.body;

		// validate user input
		if (!title || !link) {
			return res.send({
				status: 400,
				message: 'both title and link are required',
			});
		}

		// update pyq
		const updatedPyq = await Pyqs.findByIdAndUpdate(
			id,
			{
				title: title,
				link: link,
			},
			{ new: true }
		);

		// check if pyq exists
		if (!updatedPyq) {
			return res.send({
				status: 400,
				message: 'pyq does not exist check your id',
			});
		}

		// send pyq
		res.send({
			status: 200,
			message: 'pyq updated successfully',
			data: updatedPyq,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- delete pyq ------------------------------- */
exports.deletePyq = async function (req, res) {
	try {
		const { id } = req.params;

		// find pyq
		const pyq = await Pyqs.findById(id);

		// check if pyq exists
		if (!pyq) {
			return res.send({
				status: 400,
				message: 'pyq does not exist check your id',
			});
		}

		// remove pyq from subject
		const subject = await Subject.findById(pyq.subjectId).populate('pyqs');

		subject.pyqs.splice(pyq._id, 1);
		subject.save();

		// delete pyq
		const deletedPyq = await Pyqs.findByIdAndDelete(id);

		// check if pyq exists
		if (!deletedPyq) {
			return res.send({
				status: 400,
				message: 'pyq does not exist check your id',
			});
		}

		// send response
		res.send({
			status: 200,
			message: 'pyq deleted',
			data: deletedPyq,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
