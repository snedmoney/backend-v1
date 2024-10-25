import { DataSource, Like, Repository } from 'typeorm';
import { Link, LinkType } from '@/models/link';
import { Chain } from '@/models/chain';
import { Token } from '@/models/token';
import { User } from '@/models/user';

type GetLinksOption = {
    perPage: number;
    page: number;
    username?: string;
};

type CreateLinkArgs = {
    type: LinkType;
    userId?: bigint;
    description: string;
    acceptUntil: Date;
    goalAmount?: number;
    destinationTokenAddress?: string;
    destinationChainId?: number;
    destinationWalletId?: number;
};

export class LinkService {
    private repo: Repository<Link>;
    private chainRepo: Repository<Chain>;
    private tokenRepo: Repository<Token>;
    private userRepo: Repository<User>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Link);
        this.chainRepo = dataSource.getRepository(Chain);
        this.tokenRepo = dataSource.getRepository(Token);
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
            relations: ['destinationToken', 'destinationChain'],
        });

        return link;
    }

    async createLink(args: CreateLinkArgs): Promise<Link | null> {
        const chain = await this.chainRepo.findOne({
            where: {
                id: args.destinationChainId,
            },
        });
        console.log(chain);
        if (!chain) return null;

        const destinationToken = await this.tokenRepo.findOne({
            where: {
                address: args.destinationTokenAddress,
            },
        });
        if (!destinationToken) return null;

        let user;
        if (args.userId) {
            user = await this.userRepo.findOne({
                where: {
                    id: args.userId,
                },
            });
        }

        const link = this.repo.create({
            user,
            description: args.description,
            type: args.type,
            acceptUntil: args.acceptUntil,
            goalAmount: args.goalAmount,
            destinationChain: chain,
            destinationToken,
        });

        await this.repo.insert(link);

        return link;
    }
}