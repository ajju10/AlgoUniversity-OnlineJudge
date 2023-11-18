import { Schema, model } from 'mongoose';

const solutionSchema = new Schema({
    problem: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
    },
    language: String,
    source_code: String,
    verdict: String,
    submitted_by: String,
}, { timestamps: true });

export const Solution = model('solution', solutionSchema);