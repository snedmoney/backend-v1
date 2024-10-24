import { Token } from '@/models/token';
import { DataSource, Repository } from 'typeorm';
import { erc20Abi, formatUnits } from 'viem';
import getPublicClient from '@/util/client';

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

    async getTokensByChain(
        options: GetTokensByChainOptions
    ): Promise<Token[] | TokenWithBalance[]> {
        let tokens: Token[] | TokenWithBalance[] = [];
        if (options.withBalance && options.walletAddress) {
            const [queriedTokens] = await this.repo.findAndCount({
                where: {
                    chain: {
                        id: options.chainId,
                    },
                },
            });

            const client = getPublicClient(options.chainId);

            const calls = queriedTokens?.map((token) => {
                return {
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [options.walletAddress],
                    address: token.address as `0x${string}`,
                };
            });

            const result = await client.multicall({ contracts: calls });
            queriedTokens?.forEach((token, i) => {
                const balanceResult = result[i];
                if (balanceResult.status === 'success') {
                    const balance = formatUnits(
                        balanceResult.result as bigint,
                        token.decimals
                    );

                    tokens.push({
                        ...token,
                        balance: parseInt(balance),
                    });
                }
            });

            // Sort by balance in descending order (highest balance to lowest balance)
            (tokens as TokenWithBalance[]).sort(
                (a, b) => b.balance - a.balance
            );
            // TODO: Then sort by token popularity
        } else {
            const [queriedTokens] = await this.repo.findAndCount({
                take: options.perPage,
                skip: (options.page - 1) * options.perPage,
                where: {
                    chain: {
                        id: options.chainId,
                    },
                },
            });
            tokens = queriedTokens;
        }

        return tokens;
    }
}