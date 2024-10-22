import { DataSource, Repository } from "typeorm";

import { Wallet } from "@/models";

type GetWalletsOptions = {
    perPage: number;
    page: number;
};

type UpdateWalletOptions = {
    id: bigint;
    updates: Wallet;
};

export class WalletService {
    private repository: Repository<Wallet>;
    constructor(dataSource: DataSource){
        this.repository = dataSource.getRepository(Wallet);
    }

    async getWallet(id: bigint) {
        const wallet = await this.repository.findOne({
            where: {
                id,
            }
        });
        return wallet;
    }

    async getWallets(options: GetWalletsOptions) {
        const [wallets] = await this.repository.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
        });
        return wallets;
    }

    async updateWallet(options: UpdateWalletOptions){
        const { id, updates } = options;
        const updatedWallet = await this.repository.update({
            id
        }, updates);

        return updatedWallet;
    }
}