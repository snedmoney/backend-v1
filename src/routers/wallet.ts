import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
import { WalletService } from '@/services/wallet';

export class WalletRoutes {
    walletService: WalletService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.walletService = new WalletService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:address', this.getWalletByAddress);
        this.router.get('/:id', this.getWalletById);
        this.router.get('/', this.getWallets);
    }

        /**
     * @swagger
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     */

    /**
     * @swagger
     * /api/wallets/:
     *   get:
     *     summary: Get a list of wallets
     *     description: Retrieve a paginated list of wallets
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         required: false
     *         description: The page number to retrieve
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *           default: 20
     *         required: false
     *         description: The number of wallets to return per page
     *     responses:
     *       '200':
     *         description: A list of wallets
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 wallets:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         description: The wallet ID
     *                       address:
     *                         type: string
     *                         description: The wallet address
     *                 page:
     *                   type: integer
     *                   description: The current page
     *                 per_page:
     *                   type: integer
     *                   description: Number of items per page
     *                 count:
     *                   type: integer
     *                   description: Total number of wallets
     *       '400':
     *         description: Bad request
     *       '500':
     *         description: Internal server error
     */
    getWallets = async (req: Request, res: Response) => {
        const page = parseInt(
            typeof req.query.page === 'string' ? req.query.page : '1'
        );
        const perPage = parseInt(
            typeof req.query.per_page === 'string' ? req.query.per_page : '20'
        );

        const wallets = await this.walletService.getWallets({
            page,
            perPage,
        });

        res.status(200).json({
            wallets,
            page,
            per_page: perPage,
            count: wallets.length,
        });
    };

    /**
     * @swagger
     * /api/wallets/{id}:
     *   get:
     *     summary: Get a wallet by ID
     *     description: Retrieve a wallet by its unique ID
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the wallet to retrieve
     *     responses:
     *       '200':
     *         description: Details of the wallet
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 wallet:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       description: The wallet ID
     *                     address:
     *                       type: string
     *                       description: The wallet address
     *       '400':
     *         description: Invalid wallet ID
     *       '404':
     *         description: Wallet not found
     *       '500':
     *         description: Internal server error
     */
    getWalletById = async (req: Request, res: Response) => {
        let id: bigint;
        try {
            id = BigInt(req.params.id);
        } catch (error) {
            return res.status(400).json({
                error: 'Invalid wallet ID',
            });
        }

        const wallet = await this.walletService.getWalletById(id);

        if (!wallet) {
            return res.status(404).json({
                error: 'No wallet found.',
            });
        }
        res.status(200).json({
            wallet,
        });
    };

    /**
     * @swagger
     * /api/wallets/{address}:
     *   get:
     *     summary: Get a wallet by address
     *     description: Retrieve a wallet by its unique address
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: address
     *         schema:
     *           type: string
     *         required: true
     *         description: The address of the wallet to retrieve
     *     responses:
     *       '200':
     *         description: Details of the wallet
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 wallet:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: string
     *                       description: The wallet ID
     *                     address:
     *                       type: string
     *                       description: The wallet address
     *       '400':
     *         description: Invalid wallet address
     *       '404':
     *         description: Wallet not found
     *       '500':
     *         description: Internal server error
     */
    getWalletByAddress = async (req: Request, res: Response) => {
        const { address } = req.params;
        if (!address) {
            return res.status(400).json({
                error: 'Invalid wallet Address',
            });
        }

        const wallet = await this.walletService.getWalletByAddress(address);

        if (!wallet) {
            return res.status(404).json({
                error: 'No wallet found.',
            });
        }
        res.status(200).json({
            wallet,
        });
    };
}