import * as jose from 'jose';

import { logger } from './index.js';

async function checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.sendStatus(403);
    }

    const token = authHeader.split(" ")[1];

    const encodedSecret = new TextEncoder().encode(process.env.SECRET_KEY);

    try {
        // Verify JWT token
        const { payload, protectedHeader } = await jose.jwtVerify(token, encodedSecret, {
            algorithms: ['HS256']
        });

        if (!payload) {
            return res.sendStatus(403);
        }
        next();

    } catch (err) {
        logger.log('info', `Error in auth: ${err.message}`);
        res.sendStatus(403);
    }
}

export { checkToken };