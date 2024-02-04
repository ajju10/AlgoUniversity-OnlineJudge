import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import winston from 'winston';

import { connectToDB } from './database/db.js';
import {
    signupHandler,
    loginHandler,
    getAllProblems,
    getProblem,
    getSubmission,
    uploadFileAndTest,
} from './controllers/controller.js';
import { checkToken } from './middleware.js';

const app = express();

const upload = multer({ dest: 'uploads/' });

const port = 8000;

const allowedOrigins = [
    "https://algo-university-online-judge-dqc5kqvjx-ajju10.vercel.app",
    "https://algo-university-online-judge.vercel.app",
    "https://algo-university-online-judge-git-main-ajju10.vercel.app",
];

// Middleware
app.use(json());
app.use(cors());
app.use(cookieParser());

connectToDB();

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// if (process.env.NODE_ENV !== 'production') {
logger.add(
    new winston.transports.Console({
        format: winston.format.simple(),
    })
);
// }

app.get('/', async (req, res) => {
    logger.log('info', 'Request recieved');
    res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
    await signupHandler(req, 'user', res);
});

app.post('/login', async (req, res) => {
    await loginHandler(req, 'user', res);
});

app.post('/admin/signup', async (req, res) => {
    await signupHandler(req, 'admin', res);
});

app.post('/admin/login', async (req, res) => {
    await loginHandler(req, 'admin', res);
});

app.get('/get/problems', async (req, res) => {
    await getAllProblems(req, res);
});

app.get('/get/problem/:code', checkToken, async (req, res) => {
    await getProblem(req, res);
});

app.get('/get/problem/:code/:user/submission', checkToken, async (req, res) => {
    await getSubmission(req, res);
});

app.post('/problem/:code/upload', upload.single('file'), async (req, res) => {
    await uploadFileAndTest(req, res);
});

app.listen(port, () => {
    logger.log('info', `Express app listening on port ${port}`);
});
