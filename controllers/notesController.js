const Class = require('../models/classModel');
const Subject = require('../models/subjectModel');
const Notes = require('../models/notesModel');

/* ------------------------------ post new note ----------------------------- */
exports.postNewNote = async function (req, res) {
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
		}).populate('notes');

		// check if subject exists
		if (!subjectFromDb) {
			return res.send({
				status: 400,
				message: 'subject does not exist',
			});
		}

		// check if note with same title exists
		const noteWithSameTitle = subjectFromDb.notes.find(
			note => note.title === title
		);

		if (noteWithSameTitle) {
			return res.send({
				status: 400,
				message: 'note with same title already exists',
			});
		}

		// crete new note
		const newNote = await Notes.create({
			title: title,
			link: link,
			subjectTitle: subjectFromDb.title,
			subjectId: subjectFromDb._id,
			classId: classFromDb._id,
			classTitle: classFromDb.title,
		});

		// add note to subject
		subjectFromDb.notes.push(newNote._id);
		subjectFromDb.save();

		// send response
		res.send({
			status: 201,
			message: 'note created',
			data: newNote,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ------------------------------ get all notes ----------------------------- */

exports.getAllNotes = async function (req, res) {
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
			const notes = await Notes.find({ classTitle: classFromQuery });

			if (!notes || notes.length === 0) {
				return res.send({
					status: 400,
					message: 'there are no notes for this class',
				});
			}

			return res.send({
				status: 200,
				data: notes,
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

		// send all notes if all is true
		if (all === 'true') {
			// get all notes
			const allNotes = await Notes.find();

			return res.send({
				status: 200,
				data: allNotes,
			});
		}

		// get subject from db
		const subjectFromDb = await Subject.findOne({
			title: subject,
			classTitle: classFromQuery,
		}).populate('notes');

		// check if subject exists
		if (!subjectFromDb) {
			return res.send({
				status: 400,
				message: 'subject or class does not exist',
			});
		}

		// check if there are notes present in subject
		if (subjectFromDb.notes.length === 0) {
			return res.send({
				status: 400,
				message: 'no notes present in subject',
			});
		}

		// send notes
		res.send({
			status: 200,
			data: subjectFromDb.notes,
		});
	} catch (err) {
		res.send({
			status: 500,
			message: 'internal server error',
		});
	}
};

/* ----------------------------- get single note ---------------------------- */
exports.getSingleNote = async function (req, res) {
	try {
		const { id } = req.params;

		// find note
		const note = await Notes.findById(id);

		// check if note exists
		if (!note) {
			return res.send({
				status: 400,
				message: 'note does not exist check your id',
			});
		}

		// send note
		res.send({
			status: 200,
			data: note,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- update note ------------------------------ */
exports.patchNote = async function (req, res) {
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

		// update note
		const updatedNotes = await Notes.findByIdAndUpdate(
			id,
			{
				title: title,
				link: link,
			},
			{ new: true }
		);

		// check if note exists
		if (!updatedNotes) {
			return res.send({
				status: 400,
				message: 'note does not exist check your id',
			});
		}

		// send note
		res.send({
			status: 200,
			message: 'note updated successfully',
			data: updatedNotes,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};

/* ------------------------------- delete note ------------------------------- */
exports.deleteNote = async function (req, res) {
	try {
		const { id } = req.params;

		// find note
		const note = await Notes.findById(id);

		// check if note exists
		if (!note) {
			return res.send({
				status: 400,
				message: 'note does not exist check your id',
			});
		}

		// remove note from subject
		const subject = await Subject.findById(note.subjectId).populate(
			'notes'
		);

		subject.notes.splice(note._id, 1);
		subject.save();

		// delete note
		const deletedNote = await Notes.findByIdAndDelete(id);

		// check if note exists
		if (!deletedNote) {
			return res.send({
				status: 400,
				message: 'note does not exist check your id',
			});
		}

		// send response
		res.send({
			status: 200,
			message: 'note deleted',
			data: deletedNote,
		});
	} catch (err) {
		res.send({
			status: 400,
			message: 'invalid id',
		});
	}
};
