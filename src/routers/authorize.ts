import { createToken } from '@/util/jwt';
import { Router, Request } from 'express';
import { recoverMessageAddress } from 'viem';
import { AppDataSource } from '@/data-source';
import { Wallet, UserRole } from '@/models/wallet';
import { Setting } from '@/models/setting';

const router = Router();

type AuthRequest = { signature: `0x${string}`; role: UserRole };

router.post('/', async (req: Request<any, any, AuthRequest>, res) => {
  const walletRepository = AppDataSource.getRepository(Wallet);
  const settingRepository = AppDataSource.getRepository(Setting);
  const { signature, role } = req.body;
  try {
    const address = await recoverMessageAddress({
      message: 'hello world',
      signature: signature,
    });
    const wallet = walletRepository.find({ where: { walletAddress: address } });
    if (!wallet) {
      const newWallet = walletRepository.create({ walletAddress: address });
      
      if (role === UserRole.CREATOR) {
        newWallet.role = UserRole.CREATOR;
        const setting = settingRepository.create();
        newWallet.setting = setting;
      }
      await walletRepository.save(newWallet);
    }
    const token = createToken({ address });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'Bad Request' });
  }
});

export default router;