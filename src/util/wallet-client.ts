import { createWalletClient, PublicClientConfig, Transport } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from './client';

import 'dotenv/config';

const walletClientCache: {
    [chainId: number]: ReturnType<typeof createWalletClient>;
} = {};

const account = privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY as `0x${string}`
);

export const getWalletClient = (chainId: number) => {
    if (walletClientCache[chainId]) {
        console.log('got cache', walletClientCache);
        return walletClientCache[chainId];
    }

    const chainConfigId: PublicClientConfig['chain'] = config.chains.find(
        (chain) => chain.id === chainId
    );
    if (!chainConfigId) throw new Error('Chain not supported');

    const transport: PublicClientConfig['transport'] =
        config.transports[chainId as keyof Transport];

    const walletClient = createWalletClient({
        chain: chainConfigId,
        transport,
        account,
    });

    walletClientCache[chainId] = walletClient;
    return walletClient;
};
