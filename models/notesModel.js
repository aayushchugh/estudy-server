const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, required: true },
});

module.exports = mongoose.model('Notes', notesSchema);
