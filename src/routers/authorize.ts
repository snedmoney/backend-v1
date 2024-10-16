import { createToken } from '@/util/jwt';
import { Router, Request } from 'express';
import { recoverMessageAddress } from 'viem';
const router = Router();
type AuthRequest = { signature: `0x${string}`; address: `0x${string}` };
router.post('/', async (req: Request<any, any, AuthRequest>, res) => {
    try {
        const address = await recoverMessageAddress({
            message: 'hello world',
            signature: req.body.signature,
        });
        if (address === req.body.address) {
            const token = createToken({ address });
            res.json({ token });
        } else {
            res.status(400).json({ error: 'Bad Request' });
        }
    } catch (e) {
        res.status(400).json({ error: 'Bad Request' });
    }
});
export default router;
