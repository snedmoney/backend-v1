import { ChainService } from '@/services/chain';
import { Router, Request, Response } from 'express';
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
        this.router.get('/', this.getChains);
        this.router.get('/:id', this.getChain);
    }

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

// export default router;

// import { getDataSource } from '@/data-source';
// import { ChainInfo } from '@/models/chain';
// import { Router, Request, Response } from 'express';

// const router = Router();

// router.get('/', async (req: Request, res: Response) => {
//   const AppDataSource = await getDataSource();
//   const chainsRepository = AppDataSource.getRepository(ChainInfo);
//   const includeTestnet = req.query.includeTestnet?.toString().toLowerCase() === 'true';

//   const chains = await chainsRepository.find({
//     where: {
//       "allowed": true,
//     },
//   });

//   if (chains.length === 0) {
//     return res.status(400).json({
//       error: 'No chain found.',
//     });
//   }

//   const filteredChains = chains.filter(chain => {
//     const hasTestNet = /testnet/i.test(chain.name);
//     return includeTestnet ? hasTestNet : !hasTestNet;
//   });

//   res.status(200).json(filteredChains);
// });

// export default router;