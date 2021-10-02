const mongoose = require('mongoose');
const Notes = require('./notesModel');
const Pyq = require('./pyqModel');
const NcertSolutions = require('./ncertSolutionModel');

const subjectSchema = new mongoose.Schema({
	title: { type: String, required: true },
	notes: [{ type: mongoose.Schema.Types.ObjectId, ref: Notes }],
	pyqs: [{ type: mongoose.Schema.Types.ObjectId, ref: Pyq }],
	ncertSolutions: [
		{ type: mongoose.Schema.Types.ObjectId, ref: NcertSolutions },
	],
});

module.exports = mongoose.model('Subject', subjectSchema);
