const mongoose = require('mongoose');
const Subject = require('./subjectModel');

const classSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: Subject }],
});

module.exports = mongoose.model('Class', classSchema);
