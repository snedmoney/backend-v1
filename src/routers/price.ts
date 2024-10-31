import { Request, Response, Router } from 'express';
import { PriceService } from '@/services/price';

export class PriceRoutes {
    router: Router;
    priceService: PriceService;

    constructor() {
        this.router = Router();
        this.priceService = new PriceService();
        this.registerRoutes();
    }

    registerRoutes() {
        /**
         * @swagger
         * /api/price:
         *   post:
         *     summary: Get prices for tokens in a chain
         *     description: Retrieve the current prices for an array of tokens within a specific blockchain.
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - chain
         *               - tokens
         *             properties:
         *               chain:
         *                 type: string
         *                 description: The blockchain network (e.g., Ethereum, Binance Smart Chain).
         *               tokens:
         *                 type: array
         *                 items:
         *                   type: string
         *                 description: An array of token addresses or symbols.
         *     responses:
         *       '200':
         *         description: A successful response with token prices
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 chain:
         *                   type: string
         *                 tokenPrices:
         *                   type: object
         *                   additionalProperties:
         *                     type: number
         *                     description: The price of each token in the specified chain.
         *       '400':
         *         description: Invalid request format
         *       '404':
         *         description: Prices not found for the given tokens or chain
         *       '500':
         *         description: Internal server error
         */
        this.router.post('/', this.getTokenPrices);
    }

    getTokenPrices = async (req: Request, res: Response) => {
        const { chain, tokens } = req.body;

        if (!chain || !tokens || !Array.isArray(tokens)) {
            return res.status(400).json({
                error: 'Invalid input. `chain` should be a string and `tokens` should be an array of strings.',
            });
        }

        try {
            const tokenPrices = await this.priceService.getTokenPrices({
                chain,
                tokens,
            });

            if (!tokenPrices || Object.keys(tokenPrices).length === 0) {
                return res.status(404).json({
                    error: 'Prices not found for the specified chain and tokens.',
                });
            }

            res.status(200).json({
                chain,
                tokenPrices,
            });
        } catch (err) {
            res.status(500).json({
                error: 'Internal server error while fetching prices.',
            });
        }
    };
}