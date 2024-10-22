import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
// import { Setting } from '@/models/setting';
import { User } from '@/models';
// import { UserRole, Wallet } from '@/models/wallet';
import { WalletService } from '@/services/wallet';
import { createToken } from '@/util/jwt';
// import { getDataSource } from '@/data-source';
import { recoverMessageAddress } from 'viem';

// const router = Router();

// type AuthRequest = { signature: `0x${string}`; role: UserRole };

// router.post('/', async (req: Request<any, any, AuthRequest>, res) => {
//     const AppDataSource = await getDataSource();
//     const walletRepository = AppDataSource.getRepository(Wallet);
//     const settingRepository = AppDataSource.getRepository(Setting);
//     const { signature, role } = req.body;
//     try {
//         const address = await recoverMessageAddress({
//             message: 'hello world',
//             signature: signature,
//         });
//         const wallet = walletRepository.find({
//             where: { walletAddress: address },
//         });
//         if (!wallet) {
//             const newWallet = walletRepository.create({
//                 walletAddress: address,
//             });

//             if (role === UserRole.CREATOR) {
//                 newWallet.role = UserRole.CREATOR;
//                 const setting = settingRepository.create();
//                 newWallet.setting = setting;
//             }
//             await walletRepository.save(newWallet);
//         }
//         const token = createToken({ address });
//         res.json({ token });
//     } catch (e) {
//         res.status(400).json({ error: 'Bad Request' });
//     }
// });

// export default router;

type AuthRequest = { signature: `0x${string}`; };

export class AuthRoutes {
  
    walletService: WalletService;
    router: Router;
    constructor(dataSource: DataSource) {
        this.router = Router();
        this.walletService = new WalletService(dataSource);
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post('/', this.authorize);
    }

    authorize = async (req: Request<any, any, AuthRequest>, res: Response) => {
        const { signature } = req.body;
        if (!signature) {
            return res.status(400).json({
                error: 'Signature missing',
            });
        }
        try {
            const address = await recoverMessageAddress({
                message: 'hello world',
                signature: signature,
            });
            const wallet = await this.walletService.getWalletByAddress(address);
            if (!wallet) {
                await this.walletService.createWallet({
                    address,
                    user: new User(), // TODO: Verify how the user entity fits in.
                });
            }
            const token = createToken({ address });
            res.json({ token });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}