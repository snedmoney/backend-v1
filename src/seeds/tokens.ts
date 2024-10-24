import { Chain } from '../models/chain';
import { Token } from '../models/token';
import { readFileSync, readdirSync } from 'fs';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

type TokenJSON = {
    id: number;
    chainId: number;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoURI: string;
};
type TokensJSON = Record<string, TokenJSON>;

type explorersType = {
    name: string;
    url: string;
    standard: string;
};

type ChainJSON = {
    networkId: number;
    name: string;
    allowed: boolean;
    iconURL: string;
    explorers: explorersType[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};
type ChainsJSON = Record<string, ChainJSON>;

const chainToPopularityUrl = {
    1: 'https://eth.blockscout.com/api/v2/tokens?items_count=1050',
};

// Returns a map of token symbol to its popularity rank
async function fetchPopularity(
    chainId: number
): Promise<Record<string, number>> {
    const popularityUrl = chainToPopularityUrl[chainId];
    if (popularityUrl) {
        const res = await fetch(popularityUrl);
        const data = (await res.json()) as { items: any[] };

        console.log(data?.items);
    }

    return {};
}

export default class SeedTokens implements Seeder {
    public async run(_: Factory, connection: Connection): Promise<any> {
        let chainMap: Map<number, Chain> = new Map();

        const chainsData = readFileSync('src/static/chains.json', 'utf-8');
        const chainsJSON: ChainsJSON = JSON.parse(chainsData);
        const chains: Partial<Chain>[] = Object.keys(chainsJSON).map((key) => {
            const chain = chainsJSON[key];

            const row = {
                id: chain.networkId,
                name: chain.name,
                allowed: chain.allowed,
                iconURL: chain.iconURL,
                explorerURL: chain.explorers?.[0].url,
                nativeCurrency: chain.nativeCurrency,
            };

            // @ts-expect-error
            chainMap.set(chain.networkId, row);

            return row;
        });

        await connection
            .createQueryBuilder()
            .insert()
            .into(Chain)
            .values(chains)
            .execute();

        let tokens: Partial<Token>[] = [];
        const popularityMap = await fetchPopularity(1);
        console.log(popularityMap);

        readdirSync('src/static/tokens').forEach(async (tokenFileName) => {
            const data = readFileSync(
                `src/static/tokens/${tokenFileName}`,
                'utf-8'
            );
            const tokensJSON: TokensJSON = JSON.parse(data);

            // // @ts-expect-error chain has null tokens
            Object.keys(tokensJSON)
                .filter((key) => tokensJSON[key].logoURI)
                .forEach((key, i) => {
                    if (i === 63) console.log(tokensJSON[key]);
                    const token = tokensJSON[key];

                    tokens.push({
                        decimals: token.decimals,
                        name: token.name,
                        address: token.address,
                        logoURI: token.logoURI,
                        symbol: token.symbol,
                        chain: chainMap.get(token.chainId),
                        chainId: token.chainId,
                    });
                });
        });

        await connection
            .createQueryBuilder()
            .insert()
            .into(Token)
            .values(tokens)
            .execute();
    }
}