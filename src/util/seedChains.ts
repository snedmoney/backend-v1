import { getDataSource } from '@/data-source';
import { ChainInfo } from '@/models';
import fs from 'fs';

type explorersType = {
  name: string;
  url: string;
  standard: string;
};

type ChainJSON = {
  networkId: string;
  name: string;
  allowed: boolean;
  iconURL: string;
  explorers: explorersType[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  }
};
type ChainsJSON = Record<string, ChainJSON>;

function createSeedChainQueries(chainTableName: string) {
  if (fs.existsSync('src/static/chains.json')) {
    const data = fs.readFileSync('src/static/chains.json', 'utf-8');
    const chains: ChainsJSON = JSON.parse(data);

    const insertStmts = [];
    const deleteStmts = [];
    Object.keys(chains).map((key) => {
      const chain = chains[key];
      insertStmts.push(
        `INSERT INTO ${chainTableName} (networkId, name, allowed, iconURL, explorerURL, nativeCurrency) VALUES ('${chain.networkId}', ${chain.name}, '${chain.allowed}', ${chain.iconURL}, '${chain.explorers[0].url}', '${chain.nativeCurrency}');`
      );
      deleteStmts.push(
        `DELETE FROM ${chainTableName} WHERE networkId=${chain.networkId}`
      );
    });

    return {
      insertQueries: insertStmts,
      deleteQueries: deleteStmts,
    };
  }
}

export async function seedChainsDatabase() {
  const AppDataSource = await getDataSource();
  const ChainDataSource = AppDataSource.getRepository(ChainInfo);

  const data = fs.readFileSync('src/static/chains.json', 'utf-8');
  const chains: ChainsJSON = JSON.parse(data);

  Object.keys(chains).forEach(async (key) => {
    const chain = chains[key];
    await ChainDataSource.upsert(
      {
        networkId: parseInt(chain.networkId),
        name: chain.name,
        allowed: chain.allowed,
        iconURL: chain.iconURL,
        explorerURL: chain.explorers[0].url,
        nativeCurrency: chain.nativeCurrency,
      },
      {
        skipUpdateIfNoValuesChanged: true,
        conflictPaths: ['networkId'],
      }
    );
  });
}
