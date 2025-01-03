import { DataSource, Repository } from 'typeorm';

import { User } from '@/models';

export class UserService {
    private repository: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(User);
    }

    getUserById = async (
        id: bigint,
        relations?: ('Wallets' | 'PaymentMethods' | 'Socials')[]
    ) => {
        const user = await this.repository.findOne({
            where: {
                id,
            },
            relations: {
                wallets: relations?.includes('Wallets'),
                paymentMethods: relations?.includes('PaymentMethods'),
                socials: relations?.includes('Socials'),
            },
        });
        return user;
    };

    getUserByUserName = async (userName: string) => {
        const user = await this.repository.findOne({
            where: {
                userName,
            },
            relations: {
                wallets: true,
                socials: true,
                paymentMethods: {
                    token: true,
                    chain: true,
                },
            },
        });

        return user;
    };

    getUserByWalletAddressLinks = async (walletAddress: string) => {
        const user = await this.repository.findOne({
            where: {
                wallets: {
                    address: walletAddress,
                },
            },
            relations: {
                links: {
                    destinationToken: true,
                    destinationChain: true,
                    destinationWallet: true,
                },
            },
        });

        return user;
    };

    getUserByWalletAddress = async (walletAddress: string) => {
        const user = await this.repository.findOne({
            where: {
                wallets: {
                    address: walletAddress,
                },
            },
            relations: {
                wallets: true,
                socials: true,
                paymentMethods: {
                    token: true,
                    chain: true,
                },
            },
        });

        return user;
    };

    createUser = async (user: User) => {
        return this.repository.save(user);
    };
}
