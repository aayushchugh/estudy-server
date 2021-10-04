const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, required: true },
	subjectTitle: { type: String, required: true },
	subjectId: { type: String, required: true },
	classId: { type: String, required: true },
	classTitle: { type: String, required: true },
});

module.exports = mongoose.model('Notes', notesSchema);
