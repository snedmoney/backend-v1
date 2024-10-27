import { Request, Response, Router } from 'express';

import { ChainService } from '@/services/chain';
import { DataSource } from 'typeorm';

export class ChainRoutes {
    chainService: ChainService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.chainService = new ChainService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:id', this.getChain);
        this.router.get('/', this.getChains);
    }
    /**
     * @swagger
     * /api/chains:
     *   get:
     *     summary: Get a list of chains.
     *     description: Get a list of chains.
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         required: false
     *         description: The current page of chains to display
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *         required: false
     *         description: The number of chains to display per page
     *     responses:
     *       '200':
     *         description: A successful response
     *       '404':
     *         description: Chains not found
     *       '500':
     *         description: Internal server error
     */
    getChains = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        const chains = await this.chainService.getChains({
            page,
            perPage,
            name: req.params?.name,
            address: req.params?.address,
            symbol: req.params?.symbol,
        });

        res.status(200).json({
            chains,
            page,
            per_page: perPage,
            count: chains.length,
        });
    };
    /**
     * @swagger
     * /api/chains/{id}:
     *   get:
     *     summary: Get a single chain details by its ID
     *     description: Get a single chain details by its ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: The ID of the chain to retrieve
     *     responses:
     *       '200':
     *         description: A successful response
     *       '404':
     *         description: Chain not found
     *       '500':
     *         description: Internal server error
     */
    getChain = async (req: Request, res: Response) => {
        let id;
        try {
            id = parseInt(req.params.id);
        } catch (err) {
            return res.status(400).json({
                error: 'Invalid token ID',
            });
        }

        const chain = await this.chainService.getChain(id);

        if (!chain) {
            return res.status(400).json({
                error: `Chain with ID ${id} not found.`,
            });
        }

        res.status(200).json({
            chain,
        });
    };
}