import jwt from 'jsonwebtoken';

import express from 'express';

// Generate a new key and move it to env config later
const secretKey = process.env.JWT_SECRET_KEY;

// Function to create JWT token
export function createToken(payload: any): string {
    return jwt.sign(payload, secretKey, { expiresIn: '60d' }); // Set expiration time (optional)
}

// Define middleware function to verify JWT token
export function verifyToken(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // Get the token from the request header
    const authHeader = req.headers['authorization'];
    const token =
        authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

    // Check if token is present
    if (!token) {
        return res
            .status(401)
            .json({ error: 'Access denied. Token is missing.' });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err: any, decoded: any) => {
        if (err) {
            return res
                .status(403)
                .json({ error: 'Failed to authenticate token.' });
        }

        if (req.body) {
            req.body.address = decoded.address;
        } else {
            // If verification is successful, save the decoded token to the request object
            req.headers['address'] = decoded.address;
        }
        next(); // Move to the next middleware or route handler
    });
}
