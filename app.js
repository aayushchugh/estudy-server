import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { default as userRouter } from './routes/authRouter.js';

const app = express();

/* ------------------------------- middlewares ------------------------------ */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* --------------------------------- routes --------------------------------- */

app.use('/v1', userRouter);

app.get('/hello', (req, res) => {
	res.send('Hello World!');
});

export default app;
