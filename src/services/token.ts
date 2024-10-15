import { Token } from '@/models/token';
import { DataSource, Repository } from 'typeorm';

type GetTokensOptions = {
    perPage: number;
    page: number;
    name?: string;
    symbol?: string;
    address?: string;
};

export class TokenService {
    private repo: Repository<Token>;
    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Token);
    }

    async getToken(id: number): Promise<Token | null> {
        const token = await this.repo.findOne({
            where: {
                id,
            },
        });

        return token;
    }

    async getTokens(options: GetTokensOptions): Promise<Token[]> {
        const [tokens] = await this.repo.findAndCount({
            take: options.perPage,
            skip: (options.page - 1) * options.perPage,
        });

        return tokens;
    }
}
