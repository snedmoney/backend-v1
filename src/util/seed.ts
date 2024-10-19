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

function createSeedScript() {
  const data = fs.readFileSync('src/static/tokens.json', 'utf-8');
  const tokens: TokensJSON = JSON.parse(data);

  const stmts = [];
  Object.keys(tokens).map((key) => {
    const token = tokens[key];
    stmts.push(
      `INSERT INTO TokenAccount (tokenAddress, chainId, chainName, decimals, logoURI, name, symbol) VALUES ('${token.address}', ${token.chainId}, '${token.name}', ${token.decimals}, '${token.logoURI}', '${token.name}', '${token.symbol}');`
    );
  });

  fs.writeFileSync('src/SEED.sql', stmts.join('\n'));
}

createSeedScript();
