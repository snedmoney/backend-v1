import { DataSource, Repository } from 'typeorm';

import { Token } from '@/models/token';

type GetTokensOptions = {
    perPage: number;
    page: number;
    name?: string;
    symbol?: string;
    address?: string;
    withBalance?: boolean;
};

type GetTokensByChainOptions = {
    chainId: number;
    walletAddress?: `0x${string}`;
    withBalance?: boolean;
    page: number;
    perPage: number;
};

type TokenWithBalance = Token & {
    balance: number;
    popularity?: number;
};

export class TokenService {
    private repo: Repository<Token>;
    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Token);
    }

    async getToken(id: number): Promise<Token | null> {
        const token = await this.repo.findOne({
            where: {
                id,
            },
        });

        return token;
    }

    async getTokens(options: GetTokensOptions): Promise<Token[]> {
        const [tokens] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
        });

        return tokens;
    }

    async searchTokens(query: string): Promise<Token[]> {
        const tokens = await this.repo.manager
            .createQueryBuilder()
            .select('tokens')
            .from(Token, 'tokens')
            .where(`tokens.name ILIKE '%${query}%'`)
            .getMany();
        return tokens;
    }

    async getTokensByChain(options: GetTokensByChainOptions): Promise<Token[]> {
        let tokens: Token[] | TokenWithBalance[] = [];
        const [queriedTokens] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
            where: {
                chain: {
                    id: options.chainId,
                },
            },
            order: {
                popularityRank: 'ASC',
            },
        });
        tokens = queriedTokens;

        return tokens;
    }
    getTokenByAddress = async (address: string) => {
        const token = await this.repo.findOne({
            where: {
                address,
            }
        })
        return token;
    }
}