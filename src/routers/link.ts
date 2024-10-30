import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
import { LinkService } from '@/services/link';
import { LinkType } from '@/models/link';
import { User } from '@/models';
import { UserService } from '@/services';
import z from 'zod';

const linkSchema = z.object({
    title: z.string({
        required_error: 'title is required.',
    }),
    type: z.enum(['profile', 'donation', 'payment'], {
        required_error: 'type is required',
    }) as z.ZodType<LinkType>,
    description: z.string({
        required_error: 'description is required',
    }),
    acceptUntil: z.string().optional(),
    goalAmount: z.number().optional(),
    destinationTokenAddress: z.string().optional(),
    destinationChainId: z.number().optional(),
    destinationWalletId: z.bigint().optional(),
    destinationWalletAddress: z.string().optional(),
});

export class LinkRoutes {
    linkService: LinkService;
    userService: UserService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.linkService = new LinkService(dataSource);
        this.userService = new UserService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:id', this.getLink);
        this.router.post('/', this.createLink);
        this.router.get('/', this.getLinks);
    }

    /**
     * @swagger
     * /api/links:
     *   get:
     *     summary: Get a list of links
     *     description: Retrieve all links with pagination support
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number for pagination
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *           default: 20
     *         description: Number of links to return per page
     *       - in: query
     *         name: username
     *         schema:
     *           type: string
     *         description: Filter links by username
     *     responses:
     *       '200':
     *         description: A list of links
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 items:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id:
     *                         type: string
     *                         description: The link ID
     *                       type:
     *                         type: string
     *                         enum: [profile, donation, payment]
     *                       description:
     *                         type: string
     *                       userId:
     *                         type: integer
     *                       acceptUntil:
     *                         type: string
     *                         format: date-time
     *                       goalAmount:
     *                         type: number
     *                       destinationTokenAddress:
     *                         type: string
     *                       destinationChainId:
     *                         type: integer
     *                       destinationWalletId:
     *                         type: integer
     *                       destinationWalletAddress:
     *                         type: string
     *                 page:
     *                   type: integer
     *                   description: Current page number
     *                 per_page:
     *                   type: integer
     *                   description: Number of items per page
     *                 count:
     *                   type: integer
     *                   description: Total number of items
     *       '500':
     *         description: Internal server error
     */
    getLinks = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.per_page as string) || 20;

        const username = req.query?.username as string;

        const links = await this.linkService.getLinks({
            page,
            perPage,
            username,
        });

        res.status(200).json({
            items: links,
            page,
            per_page: perPage,
            count: links.length,
        });
    };

    /**
     * @swagger
     * /api/links/{id}:
     *   get:
     *     summary: Get a link by ID
     *     description: Retrieve a link by its unique ID
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: The ID of the link to retrieve
     *     responses:
     *       '200':
     *         description: Details of the link
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: The link ID
     *                 type:
     *                   type: string
     *                   enum: [profile, donation, payment]
     *                 description:
     *                   type: string
     *                 userId:
     *                   type: integer
     *                 acceptUntil:
     *                   type: string
     *                   format: date-time
     *                 goalAmount:
     *                   type: number
     *                 destinationTokenAddress:
     *                   type: string
     *                 destinationChainId:
     *                   type: integer
     *                 destinationWalletId:
     *                   type: integer
     *                 destinationWalletAddress:
     *                   type: string
     *       '404':
     *         description: Link not found
     *       '500':
     *         description: Internal server error
     */
    getLink = async (req: Request, res: Response) => {
        const linkIdSchema = z.string().uuid();

        try {
            linkIdSchema.parse(req.params['id']);
        } catch (err) {
            return res.status(400).json({
                error: 'link ID must be a UUID',
            });
        }

        const link = await this.linkService.getLink(req.params['id']);

        if (!link)
            return res.status(404).json({
                error: `Link with ID ${req.params.id} not found`,
            });

        return res.status(200).json(link);
    };

    /**
     * @swagger
     * /api/links:
     *   post:
     *     summary: Create a new link
     *     description: Create a new link with the provided data
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - type
     *               - description
     *             properties:
     *               type:
     *                 type: string
     *                 enum: [profile, donation, payment]
     *               userId:
     *                 type: integer
     *               description:
     *                 type: string
     *               title:
     *                 type: string
     *               acceptUntil:
     *                 type: string
     *                 format: date-time
     *               goalAmount:
     *                 type: number
     *               destinationTokenAddress:
     *                 type: string
     *               destinationChainId:
     *                 type: integer
     *               destinationWalletId:
     *                 type: integer
     *               destinationWalletAddress:
     *                 type: string
     *     responses:
     *       '201':
     *         description: Link created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   description: The newly created link ID
     *       '400':
     *         description: Invalid request body
     *       '500':
     *         description: Internal server error
     */
    createLink = async (req: Request, res: Response) => {
        try {
            linkSchema.parse(req.body);
        } catch (err) {
            console.log(err.issues);
            if (err instanceof z.ZodError)
                return res.status(400).json({
                    error: `Invalid request body: ${err.issues[0].message || err}`,
                });
        }

        const body = req.body as z.infer<typeof linkSchema>;

        let user: User;
        if (body.destinationWalletAddress) {
            user = await this.userService.getUserByWalletAddress(
                body.destinationWalletAddress
            );
            if (!user) {
                return res.status(404).json({
                    error: `User with wallet address ${body.destinationWalletAddress} not found`,
                });
            }
        }

        try {
            const createdLink = await this.linkService.createLink({
                user,
                description: body.description,
                type: body.type,
                title: body.title,
                acceptUntil: new Date(body.acceptUntil),
                goalAmount: body.goalAmount,
                destinationChainId: body.destinationChainId,
                destinationTokenAddress: body.destinationTokenAddress,
                destinationWalletAddress: body.destinationWalletAddress,
            });
            return res.status(201).json(createdLink);
        } catch (err) {
            return res.status(400).json({
                error: `Unable to create link: ${err?.message || err}`,
            });
        }
    };
}
