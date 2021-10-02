const mongoose = require('mongoose');

const ncertSolution = new mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, required: true },
});

module.exports = mongoose.model('NcertSolution', ncertSolution);
