import { Chain } from '@/models/chain';
import { DataSource, Repository } from 'typeorm';

type GetChainsOptions = {
    perPage: number;
    page: number;
    name?: string;
    symbol?: string;
    address?: string;
    chainId?: number;
};

export class ChainService {
    private repo: Repository<Chain>;
    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Chain);
    }

    async getChain(id: number): Promise<Chain | null> {
        const chain = await this.repo.findOne({
            where: {
                id,
            },
        });

        return chain;
    }

    async getChains(options: GetChainsOptions): Promise<Chain[]> {
        const [chains] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
            where: {
                allowed: true
            }
        });

        return chains;
    }
}