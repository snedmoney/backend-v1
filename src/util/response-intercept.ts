import { NextFunction, Request, Response } from 'express';
// Middleware to intercept responses
export default function responseIntercept(
    _req: Request,
    res: Response,
    next: NextFunction
) {
    const originalJson = res.json;
    // Override the res.json function
    // @ts-ignore
    res.json = function (body: any) {
        if (body?.error && res.statusCode < 400) {
            // If there's an error in the response body, set status to 400
            res.status(400).json(body);
        } else {
            // Otherwise, let it default to the status set by the route handler
            originalJson.call(res, body);
        }
    };
    next();
}
