import { getDataSource } from '@/data-source';
import { TokenAccount } from '@/models/tokenAccount';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const tokensRepository = AppDataSource.getRepository(TokenAccount);

  const page = parseInt(req.query.page as string) || 1;
  const per_page = parseInt(req.query.per_page as string) || 20;
  const [tokens, total] = await tokensRepository.findAndCount({
    take: per_page,
    skip: (page - 1) * per_page,
  });

  res.status(200).json({
    tokens,
    page,
    per_page,
    count: total,
  });
});

router.get('/:id', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const tokensRepository = AppDataSource.getRepository(TokenAccount);

  let tokenId;
  try {
    tokenId = parseInt(req.params.id);
  } catch (err) {
    return res.status(400).json({
      error: 'Invalid token ID',
    });
  }

  const tokens = await tokensRepository.find({
    where: {
      id: tokenId,
    },
  });

  if (tokens.length === 0) {
    return res.status(400).json({
      error: 'No token found.',
    });
  }

  res.status(200).json({
    token: tokens[0], // return first result
  });
});

router.get('/chains/:chainId', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const tokensRepository = AppDataSource.getRepository(TokenAccount);

  let chainId;
  try {
    chainId = parseInt(req.params.chainId);
  } catch (err) {
    return res.status(400).json({
      error: 'Invalid token ID',
    });
  }

  const tokens = await tokensRepository.find({
    where: {
      chainId: chainId,
    },
  });

  if (tokens.length === 0) {
    return res.status(400).json({
      error: 'No token found.',
    });
  }

  res.status(200).json({
    token: tokens[0], // return first result
  });
});

router.get('/addresses/:address', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const tokensRepository = AppDataSource.getRepository(TokenAccount);

  let tokenAddress = req.params.address;
  if (!tokenAddress) {
    return res.status(400).json({
      error: 'No address specified.',
    });
  }

  const tokens = await tokensRepository.find({
    where: {
      tokenAddress,
    },
  });

  if (tokens.length === 0) {
    return res.status(400).json({
      error: `No token with address ${tokenAddress} found.`,
    });
  }

  res.status(200).json({
    token: tokens[0], // return first result
  });
});

export default router;
