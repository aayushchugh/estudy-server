import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { default as authRouter } from './routes/authRouter.js';
import { default as userRouter } from './routes/userRouter.js';

const app = express();

/* ------------------------------- middlewares ------------------------------ */
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* --------------------------------- routes --------------------------------- */

app.use('/v1', authRouter);
app.use('/v1', userRouter);

export default app;
