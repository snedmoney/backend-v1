import {
    ChainService,
    TokenService,
    UserService,
    WalletService,
} from '@/services/';
import { PaymentMethod, Social, User } from '@/models';
import { Request, Response, Router } from 'express';

import { DataSource } from 'typeorm';

export class UserRoutes {
    chainService: ChainService;
    userService: UserService;
    walletService: WalletService;
    tokenService: TokenService;
    router: Router;

    constructor(dataSource: DataSource) {
        this.router = Router();
        this.userService = new UserService(dataSource);
        this.chainService = new ChainService(dataSource);
        this.walletService = new WalletService(dataSource);
        this.tokenService = new TokenService(dataSource);

        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/username/:username', this.getUserByUserName);
        this.router.get(
            '/wallet/address/:address',
            this.getUserByWalletAddress
        );
        this.router.get('/:id', this.getUserProfile);
        this.router.post('/', this.createUserProfile);
    }

    /**
     * @swagger
     * /api/users/username/{username}:
     *   get:
     *     summary: Get User by Username
     *     description: Retrieve user details by their username.
     *     parameters:
     *       - name: username
     *         in: path
     *         required: true
     *         description: The username of the user to retrieve.
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: User details retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                   properties:
     *                     userName:
     *                       type: string
     *                       description: The username of the user.
     *                     name:
     *                       type: string
     *                       description: The full name of the user.
     *                     about:
     *                       type: string
     *                       description: A short description about the user.
     *                     slogan:
     *                       type: string
     *                       description: A catchy slogan or tagline for the user.
     *                     walletAddress:
     *                       type: string
     *                       description: The wallet address of the user.
     *                     paymentMethods:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           chainId:
     *                             type: string
     *                             description: The ID of the blockchain.
     *                           tokenAddress:
     *                             type: string
     *                             description: The address of the payment token.
     *                 preferredPaymentMethods:
     *                   type: array
     *                   items:
     *                     type: object
     *       '404':
     *         description: User not found.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: User not found.
     */

    getUserByUserName = async (req, res) => {
        const { userName = '' } = req.params;
        const user = this.userService.getUserByUserName(userName);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }
        return res.status(200).json({
            user,
        });
    };

    /**
     * @swagger
     * /api/users/wallet/address/{address}:
     *   get:
     *     summary: Get user by wallet address
     *     tags: [Users]
     *     parameters:
     *       - name: address
     *         in: path
     *         required: true
     *         type: string
     *         description: Wallet address of the user
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/definitions/User'
     *       400:
     *         description: Address is required
     *       404:
     *         description: User not found
     */
    getUserByWalletAddress = async (req, res) => {
        const { address = '' } = req.params;
        if (!address) {
            return res.status(400).json({
                error: 'address is required',
            });
        }
        const user = await this.userService.getUserByWalletAddress(address);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }
        return res.status(200).json({
            user,
        });
    };

    /**
     * @swagger
     * components:
     *   securitySchemes:
     *     BearerAuth:
     *       type: http
     *       scheme: bearer
     *       bearerFormat: JWT
     */

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Get User Profile
     *     description: Retrieve the user profile by user ID.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the user to retrieve.
     *         schema:
     *           type: string
     *     responses:
     *       '200':
     *         description: User profile retrieved successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   type: object
     *                 preferredPaymentMethods:
     *                   type: array
     *                   items:
     *                     type: object
     *       '400':
     *         description: Invalid user ID.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *       '404':
     *         description: User not found.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    getUserProfile = async (req: Request, res: Response) => {
        const { id } = req.params;
        let userId: bigint;
        try {
            userId = BigInt(id);
        } catch (error) {
            return res.status(400).json({
                error: 'Invalid user ID',
            });
        }

        const user = await this.userService.getUserById(userId, [
            'PaymentMethods',
            'Socials',
        ]);

        if (!user) {
            return res.status(404).json({
                error: 'No user found.',
            });
        }

        return res.status(200).json({
            user,
        });
    };
    /**
     * @swagger
     * /api/users/:
     *   post:
     *     summary: Create User Profile
     *     description: Create a new user profile.
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               walletAddress:
     *                 type: string
     *                 description: The wallet address of the user.
     *               name:
     *                 type: string
     *                 description: The full name of the user.
     *               slogan:
     *                 type: string
     *                 description: A catchy slogan or tagline for the user.
     *               userName:
     *                 type: string
     *                 description: The username of the user.
     *               about:
     *                 type: string
     *                 description: A short description about the user.
     *               paymentMethod:
     *                 type: object
     *                 properties:
     *                   chainId:
     *                     type: string
     *                     description: The ID of the blockchain.
     *                   tokenAddress:
     *                     type: string
     *                     description: The address of the payment token.
     *               websiteLink:
     *                 type: string
     *                 description: The user's personal or professional website link.
     *               socialAccounts:
     *                 type: object
     *                 properties:
     *                   youtube:
     *                     type: string
     *                     description: The user's YouTube profile URL.
     *                   facebook:
     *                     type: string
     *                     description: The user's Facebook profile URL.
     *                   twitter:
     *                     type: string
     *                     description: The user's Twitter profile URL.
     *                   instagram:
     *                     type: string
     *                     description: The user's Instagram profile URL.
     *                   discord:
     *                     type: string
     *                     description: The user's Discord profile URL.
     *                   tiktok:
     *                     type: string
     *                     description: The user's TikTok profile URL.
     *                   url:
     *                     type: string
     *                     description: An additional link for "Other".
     *                   link2:
     *                     type: string
     *                     description: A second additional link for "Other".
     *     responses:
     *       '200':
     *         description: User profile created successfully.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: User profile created successfully.
     *       '400':
     *         description: Invalid input data.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: Invalid wallet address or Invalid chain ID.
     */

    createUserProfile = async (req: Request, res: Response) => {
        const {
            walletAddress,
            name,
            slogan,
            userName,
            about,
            paymentMethod: preferredPaymentMethod,
            websiteLink,
            socialAccounts,
        } = req.body;

        const { chainId, tokenAddress } = preferredPaymentMethod;

        const wallet = await this.walletService.getWalletByAddress(
            walletAddress,
            ['User']
        );

        if (!wallet) {
            return res.status(400).json({
                error: 'Invalid wallet address',
            });
        }

        const chain = await this.chainService.getChain(chainId);

        if (!chain) {
            return res.status(400).json({
                error: 'Invalid chain id',
            });
        }

        const token = await this.tokenService.getTokenByAddress(
            tokenAddress.trim()
        );

        const user = wallet.user ?? new User();

        const paymentMethod = new PaymentMethod();

        const socialPlatforms = [
            'youtube',
            'facebook',
            'twitter',
            'instagram',
            'discord',
            'tiktok',
            'url',
            'link2',
        ];

        const userSocials = socialPlatforms
            .map((socialPlatform) => {
                if (socialAccounts?.[socialPlatform]) {
                    const social = new Social();
                    social.name = `${socialPlatform.charAt(0).toLocaleUpperCase()}${socialPlatform.slice(1)}`;
                    social.url = socialAccounts[socialPlatform];
                    return social;
                }
            })
            .filter(Boolean);

        if (chain) {
            paymentMethod.chain = chain;
        }

        if (token) {
            paymentMethod.token = token;
        }

        user.userName = userName || user.userName;
        user.name = name || user.name;
        user.about = about || user.about;
        user.slogan = slogan || user.slogan;
        user.paymentMethods = [...(user?.paymentMethods ?? []), paymentMethod];
        user.websiteLink = websiteLink || user.websiteLink;
        user.socials = [...(user?.socials ?? []), ...userSocials];

        const savedUser = await this.userService.createUser(user);
        return res.status(200).json({
            savedUser,
        });
    };
}
