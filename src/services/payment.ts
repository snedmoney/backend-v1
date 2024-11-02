import { isAddressEqual } from 'viem';
import abi from '@/configs/abi';
import { getWalletClient } from '@/util/wallet-client';
import {
    getPancakeswapRouter,
    getPaymentContract,
    getTokenBridge,
    getUniswapRouter,
    getUSDT,
    getWxUSDT,
    RouterConfig,
} from '@/util/contract-address';
import { getEvmChainId, getWormholeChainId } from '@/util/wormhole';
import getPublicClient from '@/util/client';
import { getContractLogs } from '@/util/log';
import { fetchVaaWithRetry } from '@/util/vaa';

class PaymentService {
    constructor() {}

    private generateEncodedVm(vaa: string): string {
        return `0x${Buffer.from(vaa, 'base64').toString('hex')}`;
    }

    private getSwapParams(chainId: number, amountIn: bigint) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const deadline = currentTimestamp + 60 * 20;

        let router = getPancakeswapRouter(chainId) as RouterConfig | undefined;

        if (!router) {
            router = getUniswapRouter(chainId) as RouterConfig;
        }

        const wxUsdt = getWxUSDT(chainId);

        const usdt = getUSDT(chainId);

        const swapParams = [
            {
                router: router.address,
                route: [wxUsdt, usdt],
                fees: [100],
                amountOutMinimum: (amountIn * 98n) / 100n,
                deadline: BigInt(deadline),
                swapType: router.swapType,
            },
        ];

        return swapParams;
    }

    public async getTxEvents(srcChainId: number, txHash: `0x${string}`) {
        const publicClient = getPublicClient(srcChainId);

        const paymentContract = getPaymentContract(srcChainId);

        const receipt = await publicClient.getTransactionReceipt({
            hash: txHash,
        });

        if (!isAddressEqual(receipt.to, paymentContract)) {
            return;
        }

        return getContractLogs(receipt.logs);
    }

    public async processPayment(srcChainId: number, txHash: `0x${string}`) {
        const txEvents = await this.getTxEvents(srcChainId, txHash);

        const bridgeInitiatedEvent = txEvents.find(
            (e) => e.eventName === 'BridgePaymentInitiated'
        );

        if (bridgeInitiatedEvent) {
            await this.completePayment(
                srcChainId,
                bridgeInitiatedEvent.args.sequence,
                bridgeInitiatedEvent.args.destWormChainId
            );
        }
    }

    public async completePayment(
        srcChainId: number,
        sequence: bigint,
        destWormChainId: number
    ) {
        try {
            const wormholeSrcChainId = getWormholeChainId(srcChainId);

            const emitter = getTokenBridge(srcChainId);

            const { vaa, amount } = await fetchVaaWithRetry(
                wormholeSrcChainId,
                emitter,
                Number(sequence)
            );

            const destChainId = getEvmChainId(destWormChainId);

            const encodedVm = this.generateEncodedVm(vaa);

            const walletClient = getWalletClient(destChainId);

            const paymentContract = getPaymentContract(destChainId);

            const swapParamsArray = this.getSwapParams(
                destChainId,
                BigInt(amount)
            );

            const hash = await walletClient.writeContract({
                address: paymentContract,
                abi,
                functionName: 'completePayment',
                args: [encodedVm, swapParamsArray],
                chain: walletClient.chain,
                account: walletClient.account,
            });

            console.log(hash);

            return hash;
        } catch (error) {
            console.error('Error in completePayment:', error);
        }
    }
}

export default PaymentService;
