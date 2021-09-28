const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const authRouter = require('./routes/authRouter.js');
const userRouter = require('./routes/userRouter.js');
const testimonialRouter = require('./routes/testimonialRouter.js');
const updateEmailListRouter = require('./routes/updateEmailListRouter.js');

const app = express();

/* ------------------------------- middlewares ------------------------------ */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER,
});

/* --------------------------------- routes --------------------------------- */

app.use('/v1', authRouter);
app.use('/v1', userRouter);
app.use('/v1', testimonialRouter);
app.use('/v1', updateEmailListRouter);

module.exports = app;
