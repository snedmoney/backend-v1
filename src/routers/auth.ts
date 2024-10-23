import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { AuthService } from '@/services/auth';

export class AuthRoutes {
    authService: AuthService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.authService = new AuthService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/', this.authenticate);
    }

    authenticate = async (req: Request, res: Response) => {
        const { signature } = req.body;

        try {
            const token = await this.authService.authenticate(signature);

            res.json({ token });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}