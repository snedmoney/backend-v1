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

    getWalletByAddress = async (address: string, relations?: ["User"]) => {
        const wallet = await this.repository.findOne({
            where: {
                address,
            },
            relations: {
                user: relations?.includes('User'),
            }
        });
        return wallet;
    }

    getWallets = async (options: GetWalletsOptions, relations?: ('User')[]) => {
        const [wallets] = await this.repository.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
            relations: {
                user: relations?.includes('User')
            }
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
