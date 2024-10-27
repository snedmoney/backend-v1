import { Address } from 'viem';

// Our payment contract
export const getPaymentContract = (
    chainId: number | undefined
): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0x2d0c938784C940052651C23e56d0E24a22081E07', // Arbitrum
        8453: '0x67831a575eedd49eeeeac6a1a2135533056a45d5', // Base
    };

    return contracts[chainId];
};

// Uniswap Quoter V2
// Address reference: https://docs.uniswap.org/contracts/v3/reference/deployments/optimism-deployments
export const getUniswapQuoter = (
    chainId: number | undefined
): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        10: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
    };

    return contracts[chainId];
};

export const getUniswapRouter = (
    chainId: number | undefined
): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0xe592427a0aece92de3edee1f18e0157c05861564',
    };

    return contracts[chainId];
};

export const getPancakeswapRouter = (
    chainId: number | undefined
): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0x32226588378236Fd0c7c4053999F88aC0e5cAc77',
        8453: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
    };

    return contracts[chainId];
};

// WETH
export const getWethAddress = (
    chainId: number | undefined
): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        10: '0x4200000000000000000000000000000000000006',
    };

    return contracts[chainId];
};

// Wormhole Wrapped USDT
export const getWxUSDT = (chainId: number | undefined): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0xe4728f3e48e94c6da2b53610e677cc241dafb134',
        8453: '0xff0c62a4979400841efaa6faadb07ac7d5c98b27',
    };

    return contracts[chainId];
};

// USDT
export const getUSDT = (chainId: number | undefined): Address | undefined => {
    if (!chainId) return;

    const contracts: { [key: number]: Address } = {
        42161: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    };

    return contracts[chainId];
};
