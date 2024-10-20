import { getDataSource } from '@/data-source';
import { Link } from '@/models/link';
import { Router, Request, Response } from 'express';

const router = Router();

const getLinkById = async (req: Request) => {
  const AppDataSource = await getDataSource();
  const linkRepository = AppDataSource.getRepository(Link);
  return await linkRepository.findOne({
    where: {
      destinationWallet: {
        walletAddress: req.headers.address as string,
      },
      id: req.body.id,
    },
  });
};

// Create Link
router.post('/', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const linkRepository = AppDataSource.getRepository(Link);
  const link = linkRepository.create(req.body);
  await linkRepository.save(link);
  res.status(200).json(link);
});

// Get Links by Address
router.get('/', async (req: Request, res: Response) => {
  const address = req.headers.address as string;
  if (!address) {
    return res
      .status(400)
      .json({ message: 'Address query parameter is required' });
  }
  const AppDataSource = await getDataSource();
  const linkRepository = AppDataSource.getRepository(Link);
  const links = await linkRepository.find({
    where: { destinationWallet: { walletAddress: address } },
    relations: ['transactions', 'destinationTokenInfo', 'destinationTokenInfo.chainInfo', 'destinationWallet'],
  });
  res.status(200).json(links);
});

// Get Link by ID
router.get('/:id', async (req: Request, res: Response) => {
  let link = await getLinkById(req);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  res.status(200).json(link);
});

// Update Link
router.put('/:id', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const linkRepository = AppDataSource.getRepository(Link);
  let link = await getLinkById(req);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  linkRepository.merge(link, req.body);
  link = await linkRepository.save(link);
  res.status(200).json(link);
});

// Delete Link
router.delete('/:id', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const linkRepository = AppDataSource.getRepository(Link);
  let link = await getLinkById(req);
  if (!link) {
    return res.status(404).json({ error: 'Link not found' });
  }
  await linkRepository.remove(link);
  res.status(200).send();
});

export default router;
