import axios from 'axios';
import { Address } from 'viem';
import abi from '@/configs/abi';
import { getWalletClient } from '@/util/wallet-client';
import {
    getPancakeswapRouter,
    getPaymentContract,
    getUSDT,
    getWxUSDT,
} from '@/util/contract-address';
import { getWormholeChainId } from '@/util/wormhole';
import getPublicClient from '@/util/client';

class PaymentService {
    constructor() {}

    private async getVaaFromWormholeScan(
        chainId: number,
        emitter: string,
        sequence: number
    ): Promise<{ vaa: string; amount: string }> {
        const url = `https://api.wormholescan.io/api/v1/vaas/${chainId}/${emitter}/${sequence}?parsedPayload=true`;
        try {
            const response = await axios.get(url);

            return {
                vaa: response.data.data.vaa,
                amount: response.data.data.payload.amount,
            };
        } catch (error) {
            console.error('Error fetching VAA:', error);
            throw error;
        }
    }

    private generateEncodedVm(vaa: string): string {
        return `0x${Buffer.from(vaa, 'base64').toString('hex')}`;
    }

    private getSwapParams(chainId: number, amountIn: bigint) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const deadline = currentTimestamp + 60 * 20;

        const pancakeswapRouter = getPancakeswapRouter(chainId) as Address;

        const wxUsdt = getWxUSDT(chainId);

        const usdt = getUSDT(chainId);

        const swapParams = [
            {
                router: pancakeswapRouter,
                route: [wxUsdt, usdt],
                fees: [100],
                amountOutMinimum: (amountIn * 98n) / 100n,
                deadline: BigInt(deadline),
                swapType: 1,
            },
        ];

        return swapParams;
    }

    public async completePayment(
        srcChainId: number,
        emitter: string,
        sequence: number,
        destChainId: number,
        fee: bigint = 0n
    ) {
        try {
            const wormholeSrcChainId = getWormholeChainId(srcChainId);

            const { vaa, amount } = await this.getVaaFromWormholeScan(
                wormholeSrcChainId,
                emitter,
                sequence
            );

            const encodedVm = this.generateEncodedVm(vaa);

            const walletClient = getWalletClient(destChainId);

            const publicClient = getPublicClient(destChainId);

            const paymentContract = getPaymentContract(destChainId);

            const swapParamsArray = this.getSwapParams(
                destChainId,
                BigInt(amount)
            );

            const hash = await walletClient.writeContract({
                address: paymentContract,
                abi,
                functionName: 'completePayment',
                args: [encodedVm, swapParamsArray, fee],
                chain: walletClient.chain,
                account: walletClient.account,
            });

            console.log(hash);

            return hash;
        } catch (error) {
            console.error('Error in completePayment:', error);
            throw error;
        }
    }
}

// TODO: remove this later once the integration is done
function test() {
    const ins = new PaymentService();
    ins.completePayment(
        42161,
        '0x0b2402144bb366a632d14b83f244d2e0e21bd39c',
        287061,
        8453
    );
}
