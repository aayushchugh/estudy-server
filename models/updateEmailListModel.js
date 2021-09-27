const mongoose = require('mongoose');

const updateEmailListSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	class: { type: String, required: true },
	mailchimp_id: { type: String, required: true },
});

module.exports = mongoose.model('updateEmailList', updateEmailListSchema);
