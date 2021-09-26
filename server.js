import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import app from './app.js';

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.DB_URL, () => {
	app.listen(PORT);
});
