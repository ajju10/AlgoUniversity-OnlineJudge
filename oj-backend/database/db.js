import mongoose from 'mongoose';
import dotenv from 'dotenv';

async function connectToDB() {
    dotenv.config();

    await mongoose.connect(process.env.MONGO_URL);

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error: '));

    db.once('open', () => {
        console.log('Connected successfully');
    });
}

export { connectToDB };
