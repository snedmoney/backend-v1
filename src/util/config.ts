let config;

export async function getConfig() {
    if (config) return config;
    const { http, createConfig } = await import('@wagmi/core');
    const { mainnet, sepolia } = await import('@wagmi/core/chains');

    const newConfig = createConfig({
        chains: [mainnet, sepolia],
        transports: {
            [mainnet.id]: http(),
            [sepolia.id]: http(),
        },
    });

    config = newConfig;

    return newConfig;
}