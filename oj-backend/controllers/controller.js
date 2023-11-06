import * as jose from 'jose';
import bcrypt from 'bcrypt';

import { User } from '../models/user.js';
import { Problem } from '../models/problem.js';

async function signupHandler(req, role, res) {
    const { fullName, email, password, dob } = req.body;

    // Check if the user already exists in the DB
    let exUser = await User.findOne({ email });
    if (exUser) {
        return res.status(400).json({
            message: `A user with email ${email} already exists`
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
        role
    });

    try {
        await user.save();
        return res.status(201).json({
            message: 'User created successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message
        });
    }
}

async function loginHandler(req, role, res) {
    const { email, password } = req.body;

    // Check if the user is in the DB
    const exUser = await User.findOne({ email });
    if (!exUser) {
        return res.status(404).json({
            message: `No user with email ${email} registered`
        });
    }

    // Check the role
    if (exUser.role != role) {
        return res.status(403).json({
            message: `Not logging in from correct portal`
        });
    }

    // Match the password
    const isPassMatched = await bcrypt.compare(password, exUser.password);
    if (!isPassMatched) {
        return res.status(403).json({
            message: 'Incorrect password, please try again'
        });
    }

    const alg = "HS256";
    const expTime = "24h";

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
        httpOnly: true,
    });

    const result = {
        email: email,
        role: exUser.role,
        token: `Bearer ${token}`,
        expiresIn: '24 Hours',
    };

    return res.status(200).json({
        result: result,
        message: 'Token generated'
    });
}

async function getAllProblems(_, res) {
    let problems = await Problem.find({});
    if (problems.length > 0) {
        return res.status(200).json({
            result: problems,
            message: 'Data fetched successfully'
        });
    } else {
        return res.status(404).json({
            message: 'No problems found'
        });
    }
}

async function getProblem(req, res) {
    let code = req.params['code'];
    const problem = await Problem.findOne({code});
    if (problem) {
        return res.status(200).json({
            result: problem,
        });
    } else {
        return res.status(404).json({
            message: 'Problem not found'
        });
    }
}

// Export the handlers
export { 
    signupHandler, 
    loginHandler, 
    getAllProblems,
    getProblem
};