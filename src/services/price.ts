import Moralis from 'moralis';

type GetTokenPricesOptions = {
    chain: string;
    tokens: string[];
};

export class PriceService {
    constructor() {
        Moralis.start({
            // TODO: rotate the key and move to env later
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjM4MTY5NTllLTY5NjktNDYyYi05NjZiLTI5NzFiMjRjYTNmNiIsIm9yZ0lkIjoiMzY0MDcwIiwidXNlcklkIjoiMzc0MTczIiwidHlwZUlkIjoiZGI5YWQ3NjYtNjFiNy00ZGMwLThlNDktZGY4ZGVkY2UwZDU0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTk2NzU3MDQsImV4cCI6NDg1NTQzNTcwNH0.x-5DBBL4wyznT6GhHq1DXzCh4p2i-4Dno8rb8QAD94E',
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