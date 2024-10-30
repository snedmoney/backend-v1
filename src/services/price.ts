import Moralis from 'moralis';

type GetTokenPricesOptions = {
    chain: string;
    tokens: string[];
};

export class PriceService {
    constructor() {
        Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        }).catch(console.error);
    }

    async getTokenPrices(options: GetTokenPricesOptions): Promise<any | null> {
        try {
            const response = await Moralis.EvmApi.token.getMultipleTokenPrices(
                {
                    chain: options.chain,
                },
                {
                    tokens: options.tokens.map((token) => ({
                        tokenAddress: token,
                    })),
                }
            );

            return response;
        } catch (error) {
            console.error('Error fetching token prices:', error);
            return null;
        }
    }
}
