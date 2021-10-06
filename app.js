const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const apiAuth = require('./middlewares/apiAuth');

const authRouter = require('./routes/authRouter.js');
const userRouter = require('./routes/userRouter.js');
const testimonialRouter = require('./routes/testimonialRouter.js');
const updateEmailListRouter = require('./routes/updateEmailListRouter.js');
const contactUsRouter = require('./routes/contactUsRouter');
const classRouter = require('./routes/classRouter');
const subjectRouter = require('./routes/subjectRouter');
const notesRouter = require('./routes/notesRouter');
const pyqRouter = require('./routes/pyqRouter');

const app = express();

/* ------------------------------- middlewares ------------------------------ */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(apiAuth);

/* --------------------------------- configs -------------------------------- */

mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER,
});

/* --------------------------------- routes --------------------------------- */

app.use('/v1', authRouter);
app.use('/v1', userRouter);
app.use('/v1', testimonialRouter);
app.use('/v1', updateEmailListRouter);
app.use('/v1', contactUsRouter);
app.use('/v1', classRouter);
app.use('/v1', subjectRouter);
app.use('/v1', notesRouter);
app.use('/v1', pyqRouter);

module.exports = app;
