import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

import app from './app.js';

mongoose.connect(process.env.DB_URL, () => {
	app.listen(8000);
});
