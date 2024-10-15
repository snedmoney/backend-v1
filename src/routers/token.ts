import { Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { TokenService } from '@/services';

export class TokenRouter {
    tokenService: TokenService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.tokenService = new TokenService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        // TODO: Add more routes for filtering tokens
        this.router.get('/:id', this.getToken);
        this.router.get('/', this.getTokens);
    }

    getTokens = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        const tokens = await this.tokenService.getTokens({
            page,
            perPage,
            name: req.params?.name,
            address: req.params?.address,
            symbol: req.params?.symbol,
        });

        res.status(200).json({
            tokens,
            page,
            per_page: perPage,
            count: tokens.length,
        });
    };

    getToken = async (req: Request, res: Response) => {
        let id;
        try {
            id = parseInt(req.params.id);
        } catch (err) {
            return res.status(400).json({
                error: 'Invalid token ID',
            });
        }

        const token = await this.tokenService.getToken(id);

        if (!token) {
            return res.status(400).json({
                error: 'No token found.',
            });
        }

        res.status(200).json({
            token,
        });
    };
}
