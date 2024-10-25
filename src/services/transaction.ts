import { Token } from '@/models/token';
import { DataSource, Repository, Between } from 'typeorm';
import {
    Transaction,
    TransactionStatus,
    TransactionType,
} from '@/models/transaction';
import { Link } from '@/models/link';
import { User } from '@/models';

type GetTransactionsOptions = {
    perPage: number;
    page: number;
    from?: Date;
    to?: Date;
};

type CreateTransactionArgs = {
    type: TransactionType; // will be updated from frontend, passed from FE
    id: string; // as a uuid as unique for primary key, passed from FE
    linkId: string; // must provide from FE
    userId?: bigint;
    message: string; // / must provide  from FE
};

export class TransactionService {
    private repo: Repository<Transaction>;
    private linkRepo: Repository<Link>;
    private userRepo: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Transaction);
        this.linkRepo = dataSource.getRepository(Link);
        this.userRepo = dataSource.getRepository(User);
    }

    async getTransactions(
        options: GetTransactionsOptions
    ): Promise<Transaction[] | null> {
        if (options?.from && options?.to) {
            const [transactions] = await this.repo.findAndCount({
                take: options.perPage,
                skip: (options.page - 1) * options.perPage,
                where: {
                    createdAt: Between(options.from, options.to),
                },
            });
            return transactions;
        }
        const [transactions] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
        });

        return transactions;
    }

    async getTransaction(id: string): Promise<Transaction | null> {
        const transaction = await this.repo.findOne({
            where: {
                id: id,
            },
        });

        return transaction;
    }

    /**
     * // status: z.enum(['pending']) // updated from BE
    // transactionHash: z.string(), // is not unique, can be same from different chains
    // sourceTokenAmount: z.number(), // We will query this from BE
    // feeInFiat: z.number(),

    // These can be queried from blockchain using paymentId
    // destinationTokenAmount: z.number(),
    // destinationTokenFiat: z.number(),
    // destinationTokenPriceFiat: z.number(),
    // sourceTokenId: z.number(),
    // destinationTokenId: z.number(),
    // sourceChainId: z.number(),
    // destinationChainId: z.number(),

    // walletId: z.number(), // updated from BE
     * @param args 
     * @returns 
     */
    async createTransaction(
        args: CreateTransactionArgs
    ): Promise<Transaction | null> {
        const link = await this.linkRepo.findOne({
            where: {
                id: args.linkId,
            },
        });

        if (!link) {
            throw new Error(`link with ID ${args.linkId} can't be found`);
        }

        let user;
        if (args?.userId) {
            user = await this.userRepo.findOne({
                where: {
                    id: args?.userId,
                },
            });
            if (!user) {
                throw new Error(`User with ID ${args.userId} can't be found`);
            }
        }

        // TODO: Replace these mock values with calculated values from the blockchain
        const transaction = await this.repo.create({
            id: args.id,
            type: args.type,
            linkId: link,
            user,
            message: args.message,
            status: TransactionStatus.PENDING,
            feeInFiat: 69,
            destinationTokenAmount: 0.69,
            destinationTokenPriceFiat: 6969,
            destinationTokenFiat: 669,
            sourceTotalFiat: 420,
            sourceTokenAmount: 4.2,
            transactionHash:
                '0x40dfbd6d1b1e24745d4a4e56b9e7ebf241bd479fd07ee349927072f51118a938',
        });

        await this.repo.insert(transaction);

        return transaction;
    }
}