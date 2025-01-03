import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';
// import { Setting } from '@/models/setting';
import { User } from '@/models';
// import { UserRole, Wallet } from '@/models/wallet';
import { WalletService } from '@/services/wallet';
import { createToken } from '@/util/jwt';
// import { getDataSource } from '@/data-source';
import { recoverMessageAddress } from 'viem';

type AuthRequest = { signature: `0x${string}` };

export class AuthRoutes {
    walletService: WalletService;
    router: Router;
    constructor(dataSource: DataSource) {
        this.router = Router();
        this.walletService = new WalletService(dataSource);
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.post('/', this.authorize);
    }

    /**
     * @swagger
     * /api/authorize/:
     *   post:
     *     summary: Authorize a user based on their signature
     *     description: Validates a user's signature and generates a token if the user is authorized.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               signature:
     *                 type: string
     *                 pattern: '^0x[a-fA-F0-9]+$'
     *                 description: The signature to validate
     *             required:
     *               - signature
     *     responses:
     *       '200':
     *         description: Successful authorization and token generation
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 token:
     *                   type: string
     *                   description: The generated authorization token
     *       '400':
     *         description: Bad request due to missing or invalid signature
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Error message
     *       '500':
     *         description: Internal server error
     */
    authorize = async (req: Request<any, any, AuthRequest>, res: Response) => {
        const { signature } = req.body;
        if (!signature) {
            return res.status(400).json({
                error: 'Signature missing',
            });
        }
        try {
            const authMessage = `Welcome to Sned! By signing this message, you authorize Sned to view your wallet address, request transaction approvals, and display your account balance. We cannot initiate transactions, access your private keys, or transfer funds without your explicit consent. You can disconnect your wallet at any time. Sign to verify ownership and proceed.`;

            const address = await recoverMessageAddress({
                message: authMessage,
                signature: signature,
            });
            let wallet = await this.walletService.getWalletByAddress(address);
            if (!wallet) {
                wallet = await this.walletService.createWallet({
                    address,
                    user: new User(),
                });
            }
            const token = createToken({ address });
            res.json({ token, user: wallet.user });
        } catch (e) {
            res.status(400).json({ error: 'Bad Request' });
        }
    };
}
