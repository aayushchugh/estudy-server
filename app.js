import express from 'express';
import bodyParser from 'body-parser';

const app = express();

/* ------------------------------- middlewares ------------------------------ */
app.use(bodyParser.json());

export default app;
