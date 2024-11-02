import { Address } from "viem";

export type RouterConfig = {
  address: Address;
  swapType: number;
};

// Our payment contract
export const getPaymentContract = (
  chainId: number | undefined,
): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0xe58592b8fd375eb2f0a779877278cbc3224f5a14",
    8453: "0xe58592b8fd375eb2f0a779877278cbc3224f5a14",
    10: "0xe58592b8fd375eb2f0a779877278cbc3224f5a14",
    137: "0xe58592b8fd375eb2f0a779877278cbc3224f5a14",
    56: "0xe58592b8fd375eb2f0a779877278cbc3224f5a14",
    43114: "0x42d0b0e199021e4af767550c815b59feb0b2dd97",
  };

  return contracts[chainId];
};

// Uniswap Quoter V2
// Address reference: https://docs.uniswap.org/contracts/v3/reference/deployments/optimism-deployments
export const getUniswapQuoter = (
  chainId: number | undefined,
): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    10: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    1: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    137: "0x61fFE014bA17989E743c5F6cB21bF9697530B21e",
    8453: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    56: "0x78D78E420Da98ad378D7799bE8f4AF69033EB077",
    43114: "0xbe0F5544EC67e9B3b2D979aaA43f18Fd87E6257F",
  };

  return contracts[chainId];
};

export const getUniswapRouter = (
  chainId: number | undefined,
): RouterConfig | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: RouterConfig } = {
    42161: {
      address: "0xe592427a0aece92de3edee1f18e0157c05861564",
      swapType: 0,
    },
    10: {
      address: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
      swapType: 1,
    },
    1: {
      address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      swapType: 0,
    },
    137: {
      address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      swapType: 0,
    },
    8453: {
      address: "0x2626664c2603336E57B271c5C0b26F421741e481",
      swapType: 1,
    },
    56: {
      address: "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
      swapType: 1,
    },
    43114: {
      address: "0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE",
      swapType: 1,
    },
  };

  return contracts[chainId];
};

export const getPancakeswapRouter = (
  chainId: number | undefined,
): RouterConfig | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: RouterConfig } = {
    42161: {
      address: "0x32226588378236Fd0c7c4053999F88aC0e5cAc77",
      swapType: 1,
    },
    1: {
      address: "0x13f4ea83d0bd40e75c8222255bc855a974568dd4",
      swapType: 1,
    },
    56: {
      address: "0x13f4ea83d0bd40e75c8222255bc855a974568dd4",
      swapType: 1,
    },
    8453: {
      address: "0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86",
      swapType: 1,
    },
  };

  return contracts[chainId];
};
// WETH
export const getWethAddress = (
  chainId: number | undefined,
): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    10: "0x4200000000000000000000000000000000000006",
    1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    137: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    56: "0x4DB5a66E937A9F4473fA95b1cAF1d1E1D62E29EA",
    8453: "0x4200000000000000000000000000000000000006",
    43114: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
  };

  return contracts[chainId];
};

// Wormhole Wrapped USDT
export const getWxUSDT = (chainId: number | undefined): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0xe4728f3e48e94c6da2b53610e677cc241dafb134",
    8453: "0xFf0C62A4979400841eFaA6faADb07Ac7d5C98b27",
    56: "0x524bC91Dc82d6b90EF29F76A3ECAaBAffFD490Bc",
    137: "0x9417669fBF23357D2774e9D421307bd5eA1006d2",
    10: "0xf6B4185FCf8aF291c0E3927fbEab7046b4f6A8CA",
    43114: "0x9d228444FC4B7E15A2C481b48E10247A03351FD8",
    1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  };

  return contracts[chainId];
};

// Wormhole Token Bridge
export const getTokenBridge = (
  chainId: number | undefined,
): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0x0b2402144bb366a632d14b83f244d2e0e21bd39c",
    8453: "0x8d2de8d2f73F1F4cAB472AC9A881C9b123C79627",
    10: "0x1d68124e65fafc907325e3edbf8c4d84499daa8b",
    56: "0xb6f6d86a8f9879a9c87f643768d9efc38c1da6e7",
    43114: "0x0e082F06FF657D94310cB8cE8B0D9a04541d8052",
    1: "0x3ee18B2214AFF97000D974cf647E7C347E8fa585",
    137: "0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE",
  };

  return contracts[chainId];
};

// USDT
export const getUSDT = (chainId: number | undefined): Address | undefined => {
  if (!chainId) return;

  const contracts: { [key: number]: Address } = {
    42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    8453: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    56: "0x55d398326f99059ff775485246999027b3197955",
    137: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    43114: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    10: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  };

  return contracts[chainId];
};
