import { Between, DataSource, Repository } from 'typeorm';
import {
    Transaction,
    TransactionStatus,
    TransactionType,
} from '@/models/transaction';

import { Chain } from '@/models/chain';
import { Link } from '@/models/link';
import PaymentService from './payment';
import { Token } from '@/models/token';
import { User } from '@/models';

type GetTransactionsOptions = {
    perPage: number;
    page: number;
    from?: Date;
    to?: Date;
};

type CreateTransactionArgs = {
    id: string;
    type: TransactionType;
    sourceChainId: number;
    sourceTransactionHash: `0x${string}`;
    linkId?: string;
    userId?: bigint;
    message?: string;
};

export class TransactionService {
    private repo: Repository<Transaction>;
    private linkRepo: Repository<Link>;
    private userRepo: Repository<User>;
    private chainRepo: Repository<Chain>;
    private paymentService: PaymentService;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Transaction);
        this.linkRepo = dataSource.getRepository(Link);
        this.userRepo = dataSource.getRepository(User);
        this.chainRepo = dataSource.getRepository(Chain);
        this.paymentService = new PaymentService();
    }

    async getTransactionByLinkId(linkId: string) {
        const transaction = await this.linkRepo.findOne({
            where: {
                id: linkId,
            },
        });
        return transaction;
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
        this.paymentService.processPayment(
            args.sourceChainId,
            args.sourceTransactionHash
        );

        let link;

        if (args?.linkId) {
            link = await this.linkRepo.findOne({
                where: {
                    id: args.linkId,
                },
            });
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

        let sourceChainId;
        if (args?.sourceChainId) {
            sourceChainId = await this.chainRepo.findOne({
                where: {
                    id: args?.sourceChainId,
                },
            });
            if (!sourceChainId) {
                throw new Error(
                    `Chain with ID ${args.sourceChainId} can't be found`
                );
            }
        }

        // TODO: Replace these mock values with calculated values from the blockchain
        const transaction = this.repo.create({
            id: args.id,
            type: args.type,
            linkId: link,
            user,
            message: args.message,
            status: TransactionStatus.PENDING,
            transactionHash: args.sourceTransactionHash,
            sourceChainId,
            // feeInFiat: 69,
            // destinationTokenAmount: 0.69,
            // destinationTokenPriceFiat: 6969,
            // destinationTokenFiat: 669,
            // sourceTotalFiat: 420,
            // sourceTokenAmount: 4.2,
        });

        await this.repo.insert(transaction);

        return transaction;
    }
}
