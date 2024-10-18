import { createToken } from '@/util/jwt';
import { Router, Request } from 'express';
import { recoverMessageAddress } from 'viem';

const router = Router();

type AuthRequest = { signature: `0x${string}` };

router.post('/', async (req: Request<any, any, AuthRequest>, res) => {
    try {
        const address = await recoverMessageAddress({
            message: 'hello world',
            signature: req.body.signature,
        });
        // if it doesnt exist initialize/create wallet entity
        const token = createToken({ address });
        res.json({ token });
    } catch (e) {
        res.status(400).json({ error: 'Bad Request' });
    }
});

export default router;
