const mongoose = require('mongoose');

const pyqSchema = new mongoose.Schema({
	title: { type: String, required: true },
	link: { type: String, required: true },
});

module.exports = mongoose.model('Pyq', pyqSchema);
