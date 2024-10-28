// Full mapping of EVM Chain IDs to Wormhole Chain IDs
const evmToWormholeChainId: Record<number, number> = {
    // Ethereum Mainnet
    1: 2,
    // Binance Smart Chain Mainnet
    56: 4,
    // Polygon (Matic) Mainnet
    137: 5,
    // Avalanche C-Chain
    43114: 6,
    // Fantom Opera
    250: 10,
    // Celo Mainnet
    42220: 14,
    // Arbitrum One
    42161: 23,
    // Optimism
    10: 24,
    // Base
    8453: 30,
};

/**
 * Function to get Wormhole Chain ID from EVM Chain ID
 * @param evmChainId - The EVM chain ID to map
 * @returns The corresponding Wormhole chain ID or undefined if not found
 */
export function getWormholeChainId(evmChainId: number): number | undefined {
    return evmToWormholeChainId[evmChainId];
}

const wormholeToEvmChainId: Record<number, number> = Object.entries(
    evmToWormholeChainId
).reduce(
    (acc, [evmChainId, wormholeChainId]) => {
        acc[wormholeChainId] = Number(evmChainId);
        return acc;
    },
    {} as Record<number, number>
);

/**
 * Function to get EVM Chain ID from Wormhole Chain ID
 * @param wormholeChainId - The Wormhole chain ID to map
 * @returns The corresponding EVM chain ID or undefined if not found
 */
export function getEvmChainId(wormholeChainId: number): number | undefined {
    return wormholeToEvmChainId[wormholeChainId];
}