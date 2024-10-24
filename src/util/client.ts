import { createPublicClient, http, PublicClientConfig, Transport } from 'viem';
import {
    mainnet,
    arbitrum,
    avalanche,
    base,
    bsc,
    optimism,
    polygon,
    fantom,
    aurora,
    klaytn,
    optimismSepolia,
    arbitrumSepolia,
    auroraTestnet,
    baseSepolia,
    klaytnBaobab,
    bscTestnet,
} from '@wagmi/core/chains';
import { createConfig } from '@wagmi/core';
import { metaMask } from '@wagmi/connectors';

export const config = {
    chains: [
        mainnet,
        arbitrum,
        avalanche,
        aurora,
        base,
        bsc,
        fantom,
        klaytn,
        optimism,
        polygon,
        optimismSepolia,
        arbitrumSepolia,
        klaytnBaobab,
        auroraTestnet,
        baseSepolia,
        bscTestnet,
    ],
    transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [avalanche.id]: http(),
        [aurora.id]: http(),
        [base.id]: http(),
        [bsc.id]: http(),
        [fantom.id]: http(),
        [klaytn.id]: http(),
        [optimism.id]: http(),
        [polygon.id]: http(),

        //testnets
        [optimismSepolia.id]: http(),
        [arbitrumSepolia.id]: http(),
        [auroraTestnet.id]: http(),
        [baseSepolia.id]: http(),
        [klaytnBaobab.id]: http(),
        [bscTestnet.id]: http(),
    },
};

export const publicConfig = createConfig({
    chains: [
        mainnet,
        arbitrum,
        avalanche,
        aurora,
        base,
        bsc,
        fantom,
        klaytn,
        optimism,
        polygon,
        optimismSepolia,
        arbitrumSepolia,
        klaytnBaobab,
        auroraTestnet,
        baseSepolia,
        bscTestnet,
    ],
    transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [avalanche.id]: http(),
        [aurora.id]: http(),
        [base.id]: http(),
        [bsc.id]: http(),
        [fantom.id]: http(),
        [klaytn.id]: http(),
        [optimism.id]: http(),
        [polygon.id]: http(),

        //testnets
        [optimismSepolia.id]: http(),
        [arbitrumSepolia.id]: http(),
        [auroraTestnet.id]: http(),
        [baseSepolia.id]: http(),
        [klaytnBaobab.id]: http(),
        [bscTestnet.id]: http(),
    },
});

const clientCache: {
    [chainId: number]: ReturnType<typeof createPublicClient>;
} = {};

export const getPublicClient = (chainId: number) => {
    if (clientCache[chainId]) {
        console.log('got cache', clientCache);
        return clientCache[chainId];
    }

    const chainConfigId: PublicClientConfig['chain'] = config.chains.find(
        (chain) => chain.id === chainId
    );
    if (!chainConfigId) throw new Error('Chain not supported');

    const transport: PublicClientConfig['transport'] =
        config.transports[chainId as keyof Transport];

    const publicClient = createPublicClient({
        chain: chainConfigId,
        transport,
        batch: {
            multicall: true,
        },
    });

    clientCache[chainId] = publicClient;
    return publicClient;
};

export default getPublicClient;