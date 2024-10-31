import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
import { TransactionService } from '@/services/transaction';
import { TransactionType } from '@/models/transaction';
import z from 'zod';

// NOTE: Not all of these are required to be passed into createTransaction payload, some of them can be calculated
const transactionSchema = z.object({
    type: z.enum(['tip', 'donation', 'payment'], {
        required_error: 'type is required',
    }) as z.ZodType<TransactionType>, // will be updated from frontend, passed from FE
    id: z.string({
        required_error: 'id is required',
    }), // as a uuid as unique for primary key, passed from FE
    sourceChainId: z.number(),
    sourceTransactionHash: z.string(),
    linkId: z
        .string({
            required_error: 'linkId is required',
        })
        .optional(), // must provide from FE
    userId: z.bigint().optional(), // / must provide  from FE
    name: z.string().optional(),
    message: z.string().optional(), // / must provide  from FE
});

export class TransactionRoutes {
    transactionService: TransactionService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.transactionService = new TransactionService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/', this.getTransactions);
        this.router.get('/:id', this.getTransaction);
        this.router.post(
            '/transactions/link/:linkId',
            this.getTransactionByLinkId
        );
        this.router.post('/', this.createTransaction);
    }

    /**
     * @swagger
     * /transactions/link/{linkId}:
     *   post:
     *     summary: Retrieve a transaction by link ID
     *     parameters:
     *       - in: path
     *         name: linkId
     *         required: true
     *         description: The link ID to fetch the associated transaction
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Transaction associated with the link ID
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 transaction:
     *                   type: object
     *       404:
     *         description: Transaction not found for the given link ID
     */
    getTransactionByLinkId = async (req: Request, res: Response) => {
        const { linkId = '' } = req.params;
        const transaction =
            await this.transactionService.getTransactionByLinkId(linkId);
        if (!transaction) {
            return res.status(404).json({
                error: `Transaction for linkId: ${linkId} not found!`,
            });
        }
        return res.status(200).json({
            transaction,
        });
    };

    /**
     * @swagger
     * /transactions:
     *   get:
     *     summary: Retrieve a list of transactions
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         description: Page number for pagination
     *         schema:
     *           type: integer
     *           default: 1
     *       - in: query
     *         name: per_page
     *         required: false
     *         description: Number of transactions per page
     *         schema:
     *           type: integer
     *           default: 20
     *     responses:
     *       200:
     *         description: A list of transactions
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 items:
     *                   type: array
     *                   items:
     *                     type: object
     *                 page:
     *                   type: integer
     *                 per_page:
     *                   type: integer
     *                 count:
     *                   type: integer
     */
    getTransactions = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        let from: Date;
        if (req.params?.from) {
            try {
                from = new Date(req.params.from);
            } catch (err) {}
        }
        let to: Date;
        if (req.params?.to) {
            try {
                to = new Date(req.params.to);
            } catch (err) {}
        }

        const transactions = await this.transactionService.getTransactions({
            page,
            perPage,
            ...(from && { from }),
            ...(to && { to }),
        });

        res.status(200).json({
            items: transactions,
            page,
            per_page: perPage,
            count: transactions.length,
        });
    };

    /**
     * @swagger
     * /transactions/{id}:
     *   get:
     *     summary: Retrieve a transaction by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: The ID of the transaction
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A single transaction
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 transaction:
     *                   type: object
     *       400:
     *         description: Transaction not found
     */
    getTransaction = async (req: Request, res: Response) => {
        let id;
        try {
            id = parseInt(req.params.id);
        } catch (err) {
            return res.status(400).json({
                error: 'Invalid transaction ID',
            });
        }

        const transaction = await this.transactionService.getTransaction(id);

        if (!transaction) {
            return res.status(400).json({
                error: `Transaction with ID ${id} not found.`,
            });
        }

        res.status(200).json({
            transaction,
        });
    };

    /**
     * @swagger
     * /transactions:
     *   post:
     *     summary: Create a new transaction
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Transaction'
     *     responses:
     *       201:
     *         description: Transaction created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 transaction:
     *                   type: object
     *       400:
     *         description: Invalid input or unable to create transaction
     */
    createTransaction = async (req: Request, res: Response) => {
        try {
            transactionSchema.parse(req.body);
        } catch (err) {
            if (err instanceof z.ZodError)
                return res.status(400).json({
                    error: `The request body is in invalid format: ${err.issues[0].message || err}`,
                });
        }

        const body = req.body as z.infer<typeof transactionSchema>;

        try {
            const createdTransaction =
                await this.transactionService.createTransaction(req.body);
            return res.status(201).json({
                transaction: createdTransaction,
            });
        } catch (err) {
            return res.status(400).json({
                error: `Unable to create a transaction: ${err?.message || err}`,
            });
        }
    };
}
