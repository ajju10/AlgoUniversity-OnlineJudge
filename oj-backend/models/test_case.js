import { Schema, model } from 'mongoose';

const testCaseSchema = new Schema({
    input: String,
    output: String,
    problem: {
        type: Schema.Types.ObjectId,
        ref: "problem"
    }
});

export const TestCase = model("test_case", testCaseSchema);