import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
import { TokenService } from '@/services/token';

export class TokenRoutes {
    tokenService: TokenService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.tokenService = new TokenService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/chains/:id', this.getTokensByChain);
        this.router.get('/:id', this.getToken);
        this.router.get('/search', this.searchTokens);
        this.router.get('/', this.getTokens);
    }
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
    getTokens = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        const tokens = await this.tokenService.getTokens({
            page,
            perPage,
            name: req.params?.name,
            address: req.params?.address,
            symbol: req.params?.symbol,
            withBalance: Boolean(req.params?.withBalance) || true,
        });

        res.status(200).json({
            tokens,
            page,
            per_page: perPage,
            count: tokens.length,
        });
    };

    /**
     * @swagger
     * /api/tokens/search:
     *   get:
     *     summary: Get a list of tokens from a search query.
     *     description: Get a list of tokens a search query.
     *     parameters:
     *       - in: query
     *         name: query
     *         schema:
     *           type: string
     *         required: true
     *         description: The name of the token to search specified as a query
     *     responses:
     *       '200':
     *         description: A successful response
     *       '404':
     *         description: Tokens not found
     *       '500':
     *         description: Internal server error
     */
    searchTokens = async (req: Request, res: Response) => {
        const queryParam = req.query.query;

        if (!queryParam) {
            return res.status(400).json({
                error: 'Please specify query parameter to the URL, for instance: /search?query=Eth',
            });
        }

        let query: string;
        try {
            query = queryParam.toString();
        } catch (err) {
            return res.status(400).json({
                error: 'query parameter is not a string',
            });
        }

        const tokens = await this.tokenService.searchTokens(query);

        res.status(200).json({
            tokens,
        });
    };
    /**
     * @swagger
     * /api/tokens/chains/{id}:
     *   get:
     *     summary: Get a list of tokens associated by the chain ID.
     *     description: Get a list of tokens associated by the chain ID.
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The chain ID
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
    getTokensByChain = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;
        let chainId;
        try {
            chainId = parseInt(req.params.id);
        } catch (err) {
            return res.status(400).json({
                error: 'Invalid chain ID',
            });
        }

        const tokens = await this.tokenService.getTokensByChain({
            chainId,
            page,
            perPage,
        });

        if (tokens.length === 0) {
            return res.status(400).json({
                error: `No tokens found with chain ID ${chainId}`,
            });
        }

        res.status(200).json({
            tokens,
            page,
            per_page: perPage,
            count: tokens.length,
        });
    };

    /**
     * @swagger
     * /api/tokens:
     *   get:
     *     summary: Get a single token by its ID
     *     description: Get a single token by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the token to retrieve
     *     responses:
     *       '200':
     *         description: A successful response
     *       '404':
     *         description: Token not found
     *       '500':
     *         description: Internal server error
     */
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