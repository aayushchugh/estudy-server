const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');

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
			notes: [],
			pyqs: [],
			ncertSolutions: [],
		});

		// add subject to class
		classFromDb.subjects.push(newSubject._id);
		classFromDb.save();

		// send response
		res.send({
			status: 204,
			message: 'Subject created successfully',
			data: { subject: newSubject, class: classFromDb },
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};
