import express, { json } from 'express';

// import { conn } from './database/db';

const app = express()

// Middleware
app.use(json())

const port = 3000

app.get('/', (req, res) => {
    console.log(req)
    res.send('Hello World!')
});

app.post('/signup', (req, res) => {
    
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`);
});
