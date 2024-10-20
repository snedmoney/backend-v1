import { getDataSource } from '@/data-source';
import { Setting } from '@/models/setting';
import { Router, Request, Response } from 'express';

const router = Router();

/* ************ */
// TODO: need to append Setting model in Wallet router to automatically initialize setting table duration creation of wallet Table.
// Cascade is already set to true. Hence I don't have setting creation route in here.
/* ************ */

/* ************ */
// TODO: need to have some sort of auth protect middleware that way some random person cannot query user settings
/* ************ */

const getSettingByAddress = async (
  address: string
): Promise<Setting | null> => {
  const AppDataSource = await getDataSource();
  const settingRepository = AppDataSource.getRepository(Setting);
  const setting = await settingRepository.findOne({
    where: { wallet: { walletAddress: address } },
    relations: ['wallet'],
  });
  return setting;
};

// Get setting by address
router.get('/', async (req: Request, res: Response) => {
  const address = req.headers.address as string;
  if (!address) {
    return res
      .status(400)
      .json({ message: 'Address in request header is required' });
  }

  const setting = await getSettingByAddress(address);
  if (!setting) return res.status(404).json({ message: 'Setting not found' });
  res.status(200).json(setting);
});

// Update setting by address
router.put('/', async (req: Request, res: Response) => {
  const address = req.headers.address as string;
  if (!address) {
    return res
      .status(400)
      .json({ message: 'Address in request header is required' });
  }
  const AppDataSource = await getDataSource();
  const settingRepository = AppDataSource.getRepository(Setting);
  const setting = await getSettingByAddress(address);
  if (!setting) return res.status(404).json({ message: 'Setting not found' });

  settingRepository.merge(setting, req.body);
  const result = await settingRepository.save(setting);
  res.status(200).json(result);
});

// Delete setting
router.delete('/', async (req: Request, res: Response) => {
  const address = req.headers.address as string;
  if (!address) {
    return res
      .status(400)
      .json({ message: 'Address in request header is required' });
  }
  const AppDataSource = await getDataSource();
  const settingRepository = AppDataSource.getRepository(Setting);
  const setting = await getSettingByAddress(address);
  if (!setting) return res.status(404).json({ message: 'Setting not found' });

  await settingRepository.remove(setting);
  res.status(200).send();
});

export default router;
