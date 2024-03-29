import * as jose from 'jose';
import bcrypt from 'bcrypt';
import * as fs from 'fs';

import { User } from '../models/user.js';
import { Problem } from '../models/problem.js';
import { TestCase } from '../models/test_case.js';
import { runCode } from '../judging-engine/RunnerManager.js';
import { Solution } from '../models/solution.js';
import { logger } from '../index.js';

async function signupHandler(req, role, res) {
    logger.log('info', 'Signup Request Recieved');
    const { fullName, email, password, dob } = req.body;

    // Check if the user already exists in the DB
    let exUser = await User.findOne({ email });
    if (exUser) {
        return res.status(400).json({
            message: `A user with email ${email} already exists`,
        });
    }

    // Hash the password
    let hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    let user = new User({
        fullName,
        email,
        password: hashedPassword,
        dob,
        role,
    });

    try {
        await user.save();
        return res.status(201).json({
            message: 'User created successfully',
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
}

async function loginHandler(req, role, res) {
    const { email, password } = req.body;

    // Check if the user is in the DB
    const exUser = await User.findOne({ email });
    if (!exUser) {
        return res.status(404).json({
            message: `No user with email ${email} registered`,
        });
    }

    // Check the role
    if (exUser.role !== role) {
        return res.status(403).json({
            message: `Not logging in from correct portal`,
        });
    }

    // Match the password
    const isPassMatched = await bcrypt.compare(password, exUser.password);
    if (!isPassMatched) {
        return res.status(403).json({
            message: 'Incorrect password, please try again',
        });
    }

    const alg = 'HS256';
    const expTime = '24h';

    const claims = {
        email: email,
        role: exUser.role,
    };

    const encodedSecret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new jose.SignJWT(claims)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer(process.env.ISSUER)
        .setAudience(process.env.AUDIENCE)
        .setExpirationTime(expTime)
        .sign(encodedSecret);

    // Save JWT Token in cookie
    res.cookie('authcookie', token, {
        maxAge: 900000,
        // httpOnly: true,
    });

    const result = {
        email: email,
        role: exUser.role,
        token: `Bearer ${token}`,
        expiresIn: '24 Hours',
    };

    return res.status(200).json({
        result: result,
        message: 'Token generated',
    });
}

async function getAllProblems(_, res) {
    let problems = await Problem.find({});
    if (problems.length > 0) {
        // Fetch total number of submissions for each problem
        const result = [];
        for (let i = 0; i < problems.length; i++) {
            const problem = problems[i];
            const submissions = await Solution.collection.countDocuments({
                problem: problem._id,
            });
            result.push({
                ...problem._doc,
                totalSubmissions: submissions,
            });
        }
        return res.status(200).json({
            result,
            message: 'Data fetched successfully',
        });
    } else {
        return res.status(404).json({
            message: 'No problems found',
        });
    }
}

async function getProblem(req, res) {
    let code = req.params['code'];
    const problem = await Problem.findOne({ code });
    if (problem) {
        return res.status(200).json({
            ...problem._doc,
        });
    } else {
        return res.status(404).json({
            message: 'Problem not found',
        });
    }
}

async function getSubmission(req, res) {
    let code = req.params['code'];
    let user = req.params['user'];
    const problem = await Problem.findOne({ code });
    const submissions = await Solution.find({
        problem: problem._id,
        submitted_by: user,
    });
    return res.status(200).json({
        submissions: submissions
    })
}

async function uploadFileAndTest(req, res) {
    const file = req.file;
    const ext = file.originalname.split('.')[1];
    let newFilename = `${file.filename}.${ext}`;
    let newPath = `./uploads/${newFilename}`;
    fs.renameSync(file.path, newPath);

    // Read the code from the file into string
    const sourceCode = fs.readFileSync(newPath, 'utf-8');

    const problemCode = req.params['code'];
    const problem = await Problem.findOne({ code: problemCode });
    const testCases = await TestCase.find({ problem: problem._id });

    logger.log('info', 'Starting code runner');
    let solution = new Solution({
        problem: problem._id,
        language: ext,
        source_code: sourceCode,
        verdict: 'Initial',
        output_log: '',
        submitted_by: req.body.email,
    });

    // Test the code against the test cases
    let response;
    try {
        const result = await runCode(testCases, newPath, ext);
        if (result instanceof Error) {
            solution.verdict = 'Runtime Error';
            solution.output_log = result.message;
            response = res.status(200).json({ verdict: result.message });
        } else {
            solution.verdict = 'Accepted';
            solution.output_log = result;
            response = res.status(200).json({ verdict: result });
        }
    } catch (error) {
        response = res.status(404).json(error.message);
    }

    if (solution.verdict !== 'Initial') {
        await solution.save();
    }
    return response;
}

// Export the handlers
export {
    signupHandler,
    loginHandler,
    getAllProblems,
    getProblem,
    getSubmission,
    uploadFileAndTest,
};
