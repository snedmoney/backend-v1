import { DataSource, Repository } from "typeorm";
import { User, Wallet } from "@/models";

type CreateWalletDetails = {
    address: string;
    user: User;
};

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

    getWalletById = async (id: bigint) => {
        const wallet = await this.repository.findOne({
            where: {
                id,
            }
        });
        return wallet;
    }

    getWalletByAddress = async (address: string) => {
        const wallet = await this.repository.findOne({
            where: {
                address,
            }
        });
        return wallet;
    }

    getWallets = async (options: GetWalletsOptions) => {
        const [wallets] = await this.repository.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
        });
        return wallets;
    }

    getWalletByUser = async (user: User) => {
        const wallet = await this.repository.findOne({
            where: {
                user,
            }
        });
        return wallet;
    }

    createWallet = async (details: CreateWalletDetails) => {
        const { address, user } = details;
        const wallet = new Wallet();
        wallet.address = address;
        wallet.user = user;
        this.repository.save(wallet);
    }

}