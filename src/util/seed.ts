import { getDataSource } from '@/data-source';
import { TokenAccount } from '@/models';
import fs from 'fs';

type TokenJSON = {
  chainId: string;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  providers: string[];
  eip2612: boolean;
  isFoT: boolean;
  tags: string[];
};
type TokensJSON = Record<string, TokenJSON>;

function createSeedTokenQueries(tokenTableName: string) {
  if (fs.existsSync('src/static/tokens.json')) {
    const data = fs.readFileSync('src/static/tokens.json', 'utf-8');
    const tokens: TokensJSON = JSON.parse(data);

    const insertStmts = [];
    const deleteStmts = [];
    Object.keys(tokens).map((key) => {
      const token = tokens[key];
      insertStmts.push(
        `INSERT INTO ${tokenTableName} (token_address, chainId, chainName, decimals, logoURI, name, symbol) VALUES ('${token.address}', ${token.chainId}, '${token.name}', ${token.decimals}, '${token.logoURI}', '${token.name}', '${token.symbol}');`
      );
      deleteStmts.push(
        `DELETE FROM ${tokenTableName} WHERE tokenAddress=${token.address}`
      );
    });

    return {
      insertQueries: insertStmts,
      deleteQueries: deleteStmts,
    };
  }
}

export async function seedDatabase() {
  const AppDataSource = await getDataSource();
  const TokenDataSource = AppDataSource.getRepository(TokenAccount);

  const data = fs.readFileSync('src/static/tokens.json', 'utf-8');
  const tokens: TokensJSON = JSON.parse(data);

  Object.keys(tokens).forEach(async (key, i) => {
    const token = tokens[key];
    if (token.logoURI)
      await TokenDataSource.upsert(
        {
          id: i,
          chainId: parseInt(token.chainId),
          decimals: token.decimals,
          name: token.name,
          chainName: token.name,
          tokenAddress: token.address,
          logoURI: token.logoURI,
          symbol: token.symbol,
        },
        {
          skipUpdateIfNoValuesChanged: true,
          conflictPaths: ['id'],
        }
      );
  });
}
