import { AppDataSource } from '@/data-source';
import { TokenAccount } from '@/entities/tokenAccount.entity';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (_: Request, res: Response) => {
  const tokensRepository = AppDataSource.getRepository(TokenAccount);

  const tokens = await tokensRepository.find();

  res.status(200).json(tokens);
});

export default router;