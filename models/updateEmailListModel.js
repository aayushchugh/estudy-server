import mongoose from 'mongoose';

const updateEmailListSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	class: { type: String, required: true },
});

export default mongoose.model('updateEmailList', updateEmailListSchema);
