import { logger } from '@/util/logger';
import { Request } from 'express';
import { rateLimit } from 'express-rate-limit';

const rateLimiter = rateLimit({
    legacyHeaders: true,
    limit: 200,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    windowMs: 15 * 60 * 1000,
    keyGenerator,
});

function keyGenerator(request: Request): string {
    if (!request.ip) {
        logger.warn('Warning: request.ip is missing!');
        return request.socket.remoteAddress as string;
    }

    return request.ip.replace(/:\d+[^:]*$/, '');
}

export default rateLimiter;