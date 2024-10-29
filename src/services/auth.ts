import { Wallet } from '@/models';
import { Chain } from '@/models/chain';
import { UserRole } from '@/models/user';
import { recoverMessageAddress } from 'viem';
import { createToken } from '@/util/jwt';
import { DataSource, Repository } from 'typeorm';

type GetChainsOptions = {
    perPage: number;
    page: number;
    name?: string;
    symbol?: string;
    address?: string;
    chainId?: number;
};

// const AppDataSource = await getDataSource();
// const walletRepository = AppDataSource.getRepository(Wallet);
// const settingRepository = AppDataSource.getRepository(Setting);
// const { signature, role } = req.body;
// try {
//     const address = await recoverMessageAddress({
//         message: 'hello world',
//         signature: signature,
//     });
//     const wallet = walletRepository.find({
//         where: { walletAddress: address },
//     });
//     if (!wallet) {
//         const newWallet = walletRepository.create({
//             walletAddress: address,
//         });

//         if (role === UserRole.CREATOR) {
//             newWallet.role = UserRole.CREATOR;
//             const setting = settingRepository.create();
//             newWallet.setting = setting;
//         }
//         await walletRepository.save(newWallet);
//     }
//     const token = createToken({ address });
//     res.json({ token });
// } catch (e) {
//     res.status(400).json({ error: 'Bad Request' });
// }

export class AuthService {
    private walletRepo: Repository<Wallet>;
    // private settingRepo: Repository<Setting>;
    constructor(dataSource: DataSource) {
        this.walletRepo = dataSource.getRepository(Wallet);
    }

    async authenticate(signature: `0x${string}`): Promise<string> {
        const authMessage = `Welcome to Sned! By signing this message, you authorize Sned to view your wallet address, request transaction approvals, and display your account balance. We cannot initiate transactions, access your private keys, or transfer funds without your explicit consent. You can disconnect your wallet at any time. Sign to verify ownership and proceed.`;

        const address = await recoverMessageAddress({
            message: authMessage,
            signature: signature,
        });
        const wallet = this.walletRepo.find({
            where: { address },
        });
        if (!wallet) {
            const newWallet = this.walletRepo.create({
                address,
            });

            // if (role === UserRole.CREATOR) {
            //     newWallet.role = UserRole.CREATOR;
            //     const setting = settingRepository.create();
            //     newWallet.setting = setting;
            // }
            await this.walletRepo.save(newWallet);
        }
        const token = createToken({ address });

        return token;
    }
}
