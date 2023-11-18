import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';

import { connectToDB } from './database/db.js';
import {
    signupHandler,
    loginHandler,
    getAllProblems,
    getProblem,
    uploadFileAndTest,
} from './controllers/controller.js';
import { checkToken } from './middleware.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(json());
app.use(cors());
app.use(cookieParser());

connectToDB()

const port = 8000;

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
    await signupHandler(req, 'user', res);
});

app.post('/login', async (req, res) => {
    await loginHandler(req, 'user', res);
});

app.post('/admin/signup', async (req, res) => {
    console.log('Signup Handler', req.body);
    await signupHandler(req, 'admin', res);
});

app.post('/admin/login', async (req, res) => {
    await loginHandler(req, 'admin', res);
});

app.get('/get/problems', checkToken, async (req, res) => {
    await getAllProblems(req, res);
});

app.get('/get/problem/:code', checkToken, async (req, res) => {
    await getProblem(req, res);
});

app.post('/problem/:code/upload', upload.single('file'), async (req, res) => {
    await uploadFileAndTest(req, res);
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
