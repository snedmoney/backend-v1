import { Token } from '@/models/token';
import { DataSource, Repository } from 'typeorm';

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

    // async getTokensWithBalance(options: GetTokensByChainOptions) {
    //     let tokens: TokenWithBalance[] = [];
    //     const [queriedTokens] = await this.repo.findAndCount({
    //         where: {
    //             chain: {
    //                 id: options.chainId,
    //             },
    //         },
    //     });

    //     let calls = queriedTokens?.map((token) => {
    //         return {
    //             abi: erc20Abi,
    //             functionName: 'balanceOf',
    //             args: [options.walletAddress],
    //             address: token.address,
    //         };
    //     });

    //     let ethBalanceCall = getBalance(publicConfig, {
    //         address: options.walletAddress,
    //         chainId: options.chainId,
    //     });

    //     const multicallBalanceCall = multicall(publicConfig, {
    //         contracts: calls,
    //         chainId: options.chainId,
    //     });

    //     const [ethBalance, multicallBalance] = await Promise.allSettled([
    //         ethBalanceCall,
    //         multicallBalanceCall,
    //     ]);

    //     if (
    //         multicallBalance.status !== 'fulfilled' ||
    //         ethBalance.status !== 'fulfilled'
    //     ) {
    //         throw new Error(
    //             `There was an error in querying the balances: ${multicallBalance?.reason}, ${ethBalance?.reason}`
    //         );
    //     }
    //     console.log(ethBalance);

    //     queriedTokens?.forEach((token, i) => {
    //         const balanceResult = multicallBalance.value[i];

    //         const balance = formatUnits(
    //             token.symbol === 'ETH'
    //                 ? (ethBalance.value.value as bigint)
    //                 : (balanceResult.result as bigint),
    //             token.symbol === 'ETH'
    //                 ? ethBalance.value.decimals
    //                 : token.decimals
    //         );

    //         if (balanceResult.status !== 'success' || balanceResult?.error)
    //             return;

    //         tokens.push({
    //             ...token,
    //             balance: parseFloat(balance),
    //         });
    //     });

    //     // Sort by balance in descending order (highest balance to lowest balance)
    //     // (tokens as TokenWithBalance[]).sort((a, b) => b.balance - a.balance);
    //     // TODO: Then sort by token popularity
    //     (tokens as TokenWithBalance[]).sort((a, b) => {
    //         if (a.balance > 0 && b.balance === 0) return -9999;
    //         if (a.balance === 0 && b.balance > 0) return 9999;
    //         if (a.balance > 0 && b.balance > 0)
    //             return b.balance - a.balance + 9999;
    //         return a.popularityRank - b.popularityRank;
    //     });
    //     return tokens;
    // }

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
}