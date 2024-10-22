import { Chain } from '../models/chain';
import { Token } from '../models/token';
import fs from 'fs';
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

export default class SeedTokens implements Seeder {
    public async run(_: Factory, connection: Connection): Promise<any> {
        let chainMap: Map<number, Chain> = new Map();

        const chainsData = fs.readFileSync('src/static/chains.json', 'utf-8');
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

        const data = fs.readFileSync('src/static/tokens.json', 'utf-8');
        const tokensJSON: TokensJSON = JSON.parse(data);

        // // @ts-expect-error chain has null tokens
        const tokens: Partial<Token>[] = Object.keys(tokensJSON)
            .filter((key) => tokensJSON[key].logoURI)
            .map((key, i) => {
                if (i === 63) console.log(tokensJSON[key]);
                const token = tokensJSON[key];

                return {
                    decimals: token.decimals,
                    name: token.name,
                    address: token.address,
                    logoURI: token.logoURI,
                    symbol: token.symbol,
                    chain: chainMap.get(token.chainId),
                };
            });

        await connection
            .createQueryBuilder()
            .insert()
            .into(Token)
            .values(tokens)
            .execute();
    }
}