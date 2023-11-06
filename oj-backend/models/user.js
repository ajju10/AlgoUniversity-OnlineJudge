import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    dob: Date,
    role: {
        type: String,
        enum: ['admin', 'user'],
    }
}, {timestamps: true});

export const User = model('user', userSchema);
