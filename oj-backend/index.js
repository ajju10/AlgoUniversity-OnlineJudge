import express, { json } from 'express';
import cookieParser from 'cookie-parser';

import { connectToDB } from './database/db.js';

import { 
    signupHandler, 
    loginHandler,
    getAllProblems,
    getProblem
} from './controllers/controller.js';

import { checkToken } from './middleware.js';

const app = express()

// Middleware
app.use(json())
app.use(cookieParser())

connectToDB();

const port = 3000

app.get('/', async (req, res) => {
    console.log(req.headers)
    res.send('Hello World!')
});

app.post('/signup', async (req, res) => {
    await signupHandler(req, 'user', res);
});

app.post('/login', async (req, res) => {
    await loginHandler(req, 'user', res);
});

app.post('/admin/signup', async (req, res) => {
    console.log("Signup Handler", req.body);
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

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
