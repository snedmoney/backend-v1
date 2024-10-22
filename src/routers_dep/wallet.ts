import { Router, Request, Response } from 'express';
import { AppDataSource } from '@/data-source';
import { Wallet } from '@/models_dep/wallet';

const router = Router();

// Get a wallet by address
router.get('/:walletAddress', async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const walletRepository = AppDataSource.getRepository(Wallet);

  const wallet = await walletRepository.findOne({
    where: { walletAddress },
    relations: ['transactions', 'links', 'setting'],
  });

  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  res.status(200).json(wallet);
});

// Update a wallet by address
router.put('/:walletAddress', async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const walletRepository = AppDataSource.getRepository(Wallet);

  const wallet = await walletRepository.findOne({ where: { walletAddress } });
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  walletRepository.merge(wallet, req.body);
  const updatedWallet = await walletRepository.save(wallet);

  res.status(200).json(updatedWallet);
});

// Delete a wallet by address
router.delete('/:walletAddress', async (req: Request, res: Response) => {
  const { walletAddress } = req.params;
  const walletRepository = AppDataSource.getRepository(Wallet);

  const wallet = await walletRepository.findOne({ where: { walletAddress } });
  if (!wallet) {
    return res.status(404).json({ message: 'Wallet not found' });
  }

  await walletRepository.remove(wallet);
  res.status(204).send();
});

export default router;