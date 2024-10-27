import { Request, Response, Router } from 'express';
import z from 'zod';

import { DataSource } from 'typeorm';
import { LinkService } from '@/services/link';
import { LinkType } from '@/models/link';

const linkSchema = z.object({
    type: z.enum(['profile', 'donation', 'payment'], {
        required_error: 'type is required',
    }) as z.ZodType<LinkType>,
    userId: z.bigint().optional(),
    description: z.string({
        required_error: 'description is required',
    }),
    acceptUntil: z.date().optional(),
    goalAmount: z.number().optional(),
    destinationTokenAddress: z.string().optional(),
    destinationChainId: z.number().optional(),
    destinationWalletId: z.bigint().optional(),
});

export class LinkRoutes {
    linkService: LinkService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.linkService = new LinkService(dataSource);
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/:id', this.getLink);
        this.router.post('/', this.createLink);
        this.router.get('/', this.getLinks);
    }

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

    getLink = async (req: Request, res: Response) => {
        const link = await this.linkService.getLink(req.params['id']);

        if (!link)
            return res.status(404).json({
                error: `Link with ID ${req.params.id} not found`,
            });

        return res.status(200).json(link);
    };

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
        try {
            const createdLink = await this.linkService.createLink({
                userId: body.userId,
                description: body.description,
                type: body.type,
                acceptUntil: body.acceptUntil,
                goalAmount: body.goalAmount,
                destinationChainId: body.destinationChainId,
                destinationTokenAddress: body.destinationTokenAddress,
            });
            return res.status(201).json(createdLink);
        } catch (err) {
            return res.status(400).json({
                error: `Unable to create a transaction: ${err?.message || err}`,
            });
        }
    };
}