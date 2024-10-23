import { Token } from '@/models/token';
import { DataSource, Repository } from 'typeorm';
import { getConfig } from '@/util/config';
import { ExtractAbiFunctionNames, Abi } from 'abitype';
import { erc20Abi } from 'viem';
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
    withBalance?: boolean;
    page: number;
    perPage: number;
};

type TokenWithBalance = Token & {
    balance: number;
    popularity?: number;
};

declare function readContract<
    multicall3ABI extends Abi,
    functionName extends ExtractAbiFunctionNames<
        multicall3ABI,
        'pure' | 'view'
    >,
>(config: {
    abi: multicall3ABI;
    functionName:
        | functionName
        | ExtractAbiFunctionNames<multicall3ABI, 'pure' | 'view'>;
    args: readonly unknown[];
}): unknown;

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
        let tokens: Token[] | TokenWithBalance[];
        if (options.withBalance) {
            const { multicall } = await import('@wagmi/core');
            const config = await getConfig();

            const [queriedTokens] = await this.repo.findAndCount({
                where: {
                    chain: {
                        id: options.chainId,
                    },
                },
            });

            const erc20ABI = [
                'function balanceOf(address owner) view returns (uint256)',
                'function decimals() view returns (uint8)',
            ];

            const client = getPublicClient(options.chainId);

            console.log(client);

            // const balanceRequests = queriedTokens.map((queriedToken) =>
            //     getBalance(config, {
            //         address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
            //         token: queriedToken.address as `0x${string}`,
            //     })
            // );

            // const responses = await Promise.all(balanceRequests);

            // tokens = queriedTokens
            //     .slice(
            //         (options.page - 1) * options.perPage,
            //         options.page * options.perPage
            //     )
            //     .map((token) => {
            //         const tokenBalance = responses.find(
            //             (balance) => balance.symbol === token.symbol
            //         );
            //         return {
            //             ...token,
            //             balance: tokenBalance,
            //         };
            //     });
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