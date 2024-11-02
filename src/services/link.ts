import { DataSource, Like, Repository } from 'typeorm';
import { Link, LinkType } from '@/models/link';

import { Chain } from '@/models/chain';
import { Token } from '@/models/token';
import { User, Wallet } from '@/models';

type GetLinksOption = {
    perPage: number;
    page: number;
    username?: string;
};

type CreateLinkArgs = {
    type: LinkType;
    title?: string;
    userId?: bigint;
    description: string;
    acceptUntil: Date;
    goalAmount?: number;
    destinationToken: Token;
    destinationChain: Chain;
    destinationWalletId?: number;
    destinationWallet: Wallet;
    user: User;
};

export class LinkService {
    private repo: Repository<Link>;
    private chainRepo: Repository<Chain>;
    private tokenRepo: Repository<Token>;
    private walletRepo: Repository<Wallet>;
    private userRepo: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Link);
        this.chainRepo = dataSource.getRepository(Chain);
        this.tokenRepo = dataSource.getRepository(Token);
        this.walletRepo = dataSource.getRepository(Wallet);
    }

    async getLinks(options: GetLinksOption): Promise<Link[] | null> {
        const [links] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
            relations: ['destinationToken', 'destinationChain'],
            ...(options?.username
                ? {
                      where: {
                          user: {
                              userName: Like(`%${options.username}`),
                          },
                      },
                  }
                : {}),
        });

        return links;
    }

    async getLink(id: string): Promise<Link | null> {
        const link = await this.repo.findOne({
            where: {
                id,
            },
            relations: {
                destinationToken: true,
                destinationChain: true,
                destinationWallet: true,
                user: true,
            },
        });

        return link;
    }

    async createLink(args: CreateLinkArgs): Promise<Link | null> {
        const link = this.repo.create({
            user: args.user,
            description: args.description,
            title: args.title,
            type: args.type,
            acceptUntil: args.acceptUntil,
            goalAmount: args.goalAmount,
            destinationChain: args.destinationChain,
            destinationToken: args.destinationToken,
            destinationWallet: args.destinationWallet,
        });

        await this.repo.insert(link);

        return link;
    }
}
