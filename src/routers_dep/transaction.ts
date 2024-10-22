import { Router, Request, Response } from 'express';
import { getDataSource } from '@/data-source';
import { Transaction, TransactionType } from '@/models_dep/transaction';

const router = Router();

/* ************ */
// TODO: need to have some sort of auth protect middleware that way some random person cannot query random transactions
// TODO: add more routes as needed like sorting and filtering by date
/* ************ */

// Create a new transaction
router.post('/', async (req: Request, res: Response) => {
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transaction = transactionRepository.create(req.body);
  const result = await transactionRepository.save(transaction);
  res.status(201).json(result);
});

// Get transaction by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transaction = await transactionRepository.findOne({
    where: { id: parseInt(id, 10) },
    relations: ['sourceWalletAddress', 'sourceTokenInfo', 'link'],
  });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.status(200).json(transaction);
});

// Update a transaction by ID
router.put('/:id', async (req: Request<Transaction>, res: Response) => {
  const { id } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transaction = await transactionRepository.findOneBy({ id: id });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  transactionRepository.merge(transaction, req.body);
  const result = await transactionRepository.save(transaction);
  res.status(200).json(result);
});

// Delete a transaction by ID
router.delete('/:id', async (req: Request<Transaction>, res: Response) => {
  const { id } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transaction = await transactionRepository.findOneBy({ id: id });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  await transactionRepository.remove(transaction);
  res.status(200).send();
});

// Get transactions by source wallet address
router.get('/source/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transactions = await transactionRepository.find({
    where: { sourceWalletAddress: { walletAddress: address } },
    relations: ['sourceWalletAddress', 'sourceTokenInfo', 'link'],
  });

  if (transactions.length === 0) {
    return res
      .status(404)
      .json({ message: 'No transactions found for this address' });
  }

  res.status(200).json(transactions);
});

// Get transactions by transaction type and source wallet address
router.get(
  'type/:transactionType/source/:address',
  async (req: Request, res: Response) => {
    const { address, transactionType } = req.params;
    const AppDataSource = await getDataSource();
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const type = transactionType as TransactionType;

    const transactions = await transactionRepository.find({
      where: {
        transactionType: type,
        sourceWalletAddress: { walletAddress: address },
      },
      relations: ['sourceWalletAddress', 'sourceTokenInfo', 'link'],
    });

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({
          message:
            'No transactions found for this address and transaction type',
        });
    }

    res.status(200).json(transactions);
  }
);

// Get transactions by link ID
router.get('/link/:linkId', async (req: Request, res: Response) => {
  const { linkId } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transactions = await transactionRepository.find({
    where: { link: { id: linkId } },
    relations: ['sourceWalletAddress', 'sourceTokenInfo', 'link'],
  });

  if (transactions.length === 0) {
    return res
      .status(404)
      .json({ message: 'No transactions found for this link' });
  }

  res.status(200).json(transactions);
});

// Get transactions by destination wallet address through link
router.get('/destination/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  const AppDataSource = await getDataSource();
  const transactionRepository = AppDataSource.getRepository(Transaction);
  const transactions = await transactionRepository.find({
    where: { link: { destinationWallet: { walletAddress: address } } },
    relations: [
      'sourceWalletAddress',
      'sourceTokenInfo',
      'sourceTokenInfo.chainInfo',
      'link',
      'link.destinationWallet',
      'link.destinationTokenInfo',
      'link.destinationTokenInfo.chainInfo'
    ],
  });

  if (transactions.length === 0) {
    return res
      .status(404)
      .json({
        message: 'No transactions found for this destination wallet address',
      });
  }

  res.status(200).json(transactions);
});

export default router;
