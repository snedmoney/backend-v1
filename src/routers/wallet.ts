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
        this.router.get('/:id', this.getWalletById);
        this.router.put('/:id', this.updateWallet);
        this.router.get('/addresses/:id', this.getWalletByAddress);
    }

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

    getWalletByAddress = async (req: Request, res: Response) => {
        const address: string = req.params.address;
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

    updateWallet = async (req: Request, res: Response) => {
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

        if (!req.body) {
            return res.status(400).json({
                error: 'Body missing from the request.',
            });
        }
        await this.walletService.updateWallet({
            id: wallet.id,
            updates: req.body,
        });
    };
}