import { TokenService } from '@/services/token';
import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';

export class TokenRoutes {
    tokenService: TokenService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.tokenService = new TokenService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        /**
         * @swagger
         * /api/tokens:
         *   get:
         *     summary: Get a list of tokens.
         *     description: Get a list of tokens.
         *     parameters:
         *       - in: query
         *         name: page
         *         schema:
         *           type: integer
         *         required: false
         *         description: The current page of tokens to display
         *       - in: query
         *         name: per_page
         *         schema:
         *           type: integer
         *         required: false
         *         description: The number of tokens to display per page
         *       - in: query
         *         name: name
         *         schema:
         *           type: string
         *         required: false
         *         description: Return the list of tokens by the name
         *     responses:
         *       '200':
         *         description: A successful response
         *       '404':
         *         description: Tokens not found
         *       '500':
         *         description: Internal server error
         */
        this.router.get('/', this.getTokens);
        this.router.get('/:id', this.getToken);
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

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//     const AppDataSource = await getDataSource();
//     const tokensRepository = AppDataSource.getRepository(Token);

//     const page = parseInt(req.query.page as string) || 1;
//     const per_page = parseInt(req.query.per_page as string) || 20;
//     const [tokens, total] = await tokensRepository.findAndCount({
//         take: per_page,
//         skip: (page - 1) * per_page,
//     });

//     res.status(200).json({
//         tokens,
//         page,
//         per_page,
//         count: total,
//     });
// });

// router.get('/:id', async (req: Request, res: Response) => {
//     const AppDataSource = await getDataSource();
//     const tokensRepository = AppDataSource.getRepository(TokenAccount);

//     let tokenId;
//     try {
//         tokenId = parseInt(req.params.id);
//     } catch (err) {
//         return res.status(400).json({
//             error: 'Invalid token ID',
//         });
//     }

//     const tokens = await tokensRepository.find({
//         where: {
//             id: tokenId,
//         },
//     });

//     if (tokens.length === 0) {
//         return res.status(400).json({
//             error: 'No token found.',
//         });
//     }

//     res.status(200).json({
//         token: tokens[0], // return first result
//     });
// });

// router.get('/addresses/:address', async (req: Request, res: Response) => {
//     const AppDataSource = await getDataSource();
//     const tokensRepository = AppDataSource.getRepository(TokenAccount);

//     let tokenAddress = req.params.address;
//     if (!tokenAddress) {
//         return res.status(400).json({
//             error: 'No address specified.',
//         });
//     }

//     const tokens = await tokensRepository.find({
//         where: {
//             tokenAddress,
//         },
//     });

//     if (tokens.length === 0) {
//         return res.status(400).json({
//             error: `No token with address ${tokenAddress} found.`,
//         });
//     }

//     res.status(200).json({
//         token: tokens[0], // return first result
//     });
// });

// export default router;