const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');
const NcertSolution = require('../models/ncertSolutionModel');

/* ------------------------------ post new ncert solution ----------------------------- */
exports.postNewNcertSolution = async function (req, res) {
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
		}).populate('ncertSolutions');

		// check if subject exists
		if (!subjectFromDb) {
			return res.send({
				status: 400,
				message: 'subject does not exist',
			});
		}

		// check if ncertSolutions with same title already exists
		const ncertSolutionExists = subjectFromDb.ncertSolutions.find(
			solution => solution.title === title
		);

		if (ncertSolutionExists) {
			return res.send({
				status: 400,
				message: 'ncert solution with same title already exists',
			});
		}

		// crete new ncert solution
		const newNcertSolution = await NcertSolution.create({
			title: title,
			link: link,
			subjectTitle: subjectFromDb.title,
			subjectId: subjectFromDb._id,
			classId: classFromDb._id,
			classTitle: classFromDb.title,
		});

		// add ncert solution to subject
		subjectFromDb.ncertSolutions.push(newNcertSolution._id);
		subjectFromDb.save();

		// send response
		res.send({
			status: 201,
			message: 'ncert solution created',
			data: newNcertSolution,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------------ get all ncert solutions ----------------------------- */

exports.getAllNcertSolution = async function (req, res) {
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
			const ncertSolutions = await NcertSolution.find({
				classTitle: classFromQuery,
			});

			if (!ncertSolutions || ncertSolutions.length === 0) {
				return res.send({
					status: 400,
					message: 'there are no ncertSolutions for this class',
				});
			}

			return res.send({
				status: 200,
				data: ncertSolutions,
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

		// send all ncert solutions if all is true
		if (all === 'true') {
			// get all ncert solutions
			const allNcertSolution = await NcertSolution.find();

			return res.send({
				status: 200,
				data: allNcertSolution,
			});
		}

		// get subject from db
		const subjectFromDb = await Subject.findOne({
			title: subject,
			classTitle: classFromQuery,
		}).populate('ncertSolutions');

		// check if subject exists
		if (!subjectFromDb) {
			return res.send({
				status: 400,
				message: 'subject or class does not exist',
			});
		}

		// check if there are ncert solutions present in subject
		if (subjectFromDb.ncertSolutions.length === 0) {
			return res.send({
				status: 400,
				message: 'no ncert solutions present in subject',
			});
		}

		// send ncert solutions
		res.send({
			status: 200,
			data: subjectFromDb.ncertSolutions,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ----------------------------- get single ncert solution ---------------------------- */
exports.getSingleNcertSolution = async function (req, res) {
	try {
		const { id } = req.params;

		// find ncertSolutions
		const ncertSolution = await NcertSolution.findById(id);

		// check if ncertSolutions exists
		if (!ncertSolution) {
			return res.send({
				status: 400,
				message: 'ncert solutions does not exist check your id',
			});
		}

		// send ncert solution
		res.send({
			status: 200,
			data: ncertSolution,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- update ncert solution ------------------------------ */
exports.patchNcertSolution = async function (req, res) {
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

		// update ncert solution
		const updatedNcertSolution = await NcertSolution.findByIdAndUpdate(
			id,
			{
				title: title,
				link: link,
			},
			{ new: true }
		);

		// check if ncert solution exists
		if (!updatedNcertSolution) {
			return res.send({
				status: 400,
				message: 'ncert solutions does not exist check your id',
			});
		}

		// send ncert solution
		res.send({
			status: 200,
			message: 'ncert solutions updated successfully',
			data: updatedNcertSolution,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- delete ncert solution ------------------------------- */
exports.deleteNcertSolution = async function (req, res) {
	try {
		const { id } = req.params;

		// find ncert solution
		const ncertSolution = await NcertSolution.findById(id);

		// check if ncert solution exists
		if (!ncertSolution) {
			return res.send({
				status: 400,
				message: 'ncert solution does not exist check your id',
			});
		}

		// remove ncert solution from subject
		const subject = await Subject.findById(
			ncertSolution.subjectId
		).populate('ncertSolutions');

		subject.ncertSolutions.splice(ncertSolution._id, 1);
		subject.save();

		// delete ncert solution
		const deletedNcertSolution = await NcertSolution.findByIdAndDelete(id);

		// check if ncert solution exists
		if (!deletedNcertSolution) {
			return res.send({
				status: 400,
				message: 'ncert solution does not exist check your id',
			});
		}

		// send response
		res.send({
			status: 200,
			message: 'ncert solution deleted',
			data: deletedNcertSolution,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
