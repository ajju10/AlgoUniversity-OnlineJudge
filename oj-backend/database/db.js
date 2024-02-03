import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../index.js';

function connectToDB() {
    dotenv.config();

    mongoose.connect(process.env.MONGO_URL);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error: '));

    db.once('open', () => {
        logger.log('info', 'Connection to MongoDB successful');
    });
}

export { connectToDB };
