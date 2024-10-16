import express from 'express';
import * as jwt from 'jsonwebtoken';
// Generate a new key and move it to env config later
const secretKey =
    'oZP23GiiKqysFOx/o9uGAhf0ssiJz6+fJUXET5x6gJuS8n0rtzdICB0YPT35TQ939esh11H6tAMmIwLQvAdXBBJGTiJx3jzKKXRwycxdXus1/PRBdyASdiN45OCINS8S';
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
    const token = req.headers['authorization'];
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
