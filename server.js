require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.DB_URL, () => {
	app.listen(PORT);
});
