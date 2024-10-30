import { Chain } from '../models/chain';
import { Token } from '../models/token';
import { readFileSync, readdirSync } from 'fs';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import * as cheerio from 'cheerio';

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
type ChainsJSON = ChainJSON[];

const chainToPopularityUrl = {
    1: 'https://www.coingecko.com/en/categories/ethereum-ecosystem',
    42161: 'https://www.coingecko.com/en/chains/arbitrum-one',
    8453: 'https://www.coingecko.com/en/categories/base-ecosystem',
    56: 'https://www.coingecko.com/en/categories/binance-smart-chain',
    43114: 'https://www.coingecko.com/en/chains/avalanche-network',
    137: 'https://www.coingecko.com/en/categories/polygon-ecosystem',
    10: 'https://www.coingecko.com/en/categories/optimism-ecosystem',
};

// Returns a map of token symbol to its popularity rank
async function fetchPopularity(chainId: number): Promise<string> {
    const popularityUrl = chainToPopularityUrl[chainId];
    if (popularityUrl) {
        const res = await fetch(popularityUrl);
        const data = await res.text();

        return data;
    }

    return '';
}

async function scrapeRankingTokens(chainId: number): Promise<string[]> {
    if (!chainToPopularityUrl[chainId]) return [];
    const popularTokensHtml = await fetchPopularity(chainId);

    const $ = cheerio.load(popularTokensHtml);

    const rankedSymbols = $('tbody')
        .children('tr')
        .map((_, node) => {
            const symbol = $(node).find('td:nth-child(3) a div div div').text();

            return symbol.trim();
        })
        .toArray();

    return rankedSymbols;
}

export default class SeedTokens implements Seeder {
    // @ts-ignore
    public async run(_: Factory, connection: Connection): Promise<any> {
        let chainMap: Map<number, Chain> = new Map();
        let popularTokensMap: Map<number, string[]> = new Map();

        const chainsData = readFileSync('src/static/chains.json', 'utf-8');
        const chainsJSON: ChainsJSON = JSON.parse(chainsData);
        const chains: Partial<Chain>[] = chainsJSON.map((chain) => {
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

        const rankedRequests = chains.map(async (chain) => {
            const rankedSymbols = await scrapeRankingTokens(chain.id);
            if (rankedSymbols.length)
                popularTokensMap.set(chain.id, rankedSymbols);
        });

        await Promise.allSettled(rankedRequests);

        await connection
            .createQueryBuilder()
            .insert()
            .into(Chain)
            .values(chains)
            .execute();

        let tokens: Partial<Token>[] = [];

        readdirSync('src/static/tokens').forEach(async (tokenFileName) => {
            const data = readFileSync(
                `src/static/tokens/${tokenFileName}`,
                'utf-8'
            );
            const tokensJSON: TokensJSON = JSON.parse(data);

            // // @ts-expect-error chain has null tokens
            Object.keys(tokensJSON)
                .filter((key) => tokensJSON[key].logoURI)
                .forEach((key) => {
                    const token = tokensJSON[key];

                    let tokenRank;
                    if (popularTokensMap.has(token.chainId)) {
                        const tokenRankIndex = popularTokensMap
                            .get(token.chainId)
                            .findIndex(
                                (popularTokenSymbol) =>
                                    popularTokenSymbol === token.symbol
                            );
                        if (tokenRankIndex >= 0) console.log(tokenRankIndex);
                        tokenRank =
                            tokenRankIndex === -1 ? 999 : tokenRankIndex;
                    } else {
                        tokenRank = 999;
                    }

                    tokens.push({
                        decimals: token.decimals,
                        name: token.name,
                        address: token.address,
                        logoURI: token.logoURI,
                        symbol: token.symbol,
                        chain: chainMap.get(token.chainId),
                        chainId: token.chainId,
                        popularityRank: tokenRank,
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
