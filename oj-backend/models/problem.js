import { Schema, model } from 'mongoose';

const problemSchema = new Schema({
    statement: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    difficulty: String
});

export const Problem = model('problem', problemSchema);