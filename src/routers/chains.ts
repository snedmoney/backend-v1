import { getDataSource } from '@/data-source';
import { ChainInfo } from '@/models/chain';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const chainsRepository = AppDataSource.getRepository(ChainInfo);
  const includeTestnet = req.query.includeTestnet.toString().toLowerCase() === 'true';

  const chains = await chainsRepository.find({
    where: {
      "allowed": true,
    },
  });

  if (chains.length === 0) {
    return res.status(400).json({
      error: 'No chain found.',
    });
  }

  const filteredChains = chains.filter(chain => {
    const hasTestNet = /testnet/i.test(chain.name);
    return includeTestnet ? hasTestNet : !hasTestNet;
  });

  res.status(200).json(filteredChains);
});

export default router;
