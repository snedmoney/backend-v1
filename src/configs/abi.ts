const abi = [
    {
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
            {
                internalType: 'address[]',
                name: '_initialRouters',
                type: 'address[]',
            },
            {
                internalType: 'address',
                name: '_wormholeBridge',
                type: 'address',
            },
            {
                internalType: 'uint16',
                name: '_currentWormChainId',
                type: 'uint16',
            },
            {
                internalType: 'address',
                name: '_pythContract',
                type: 'address',
            },
            {
                internalType: 'bytes32',
                name: '_priceId',
                type: 'bytes32',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'target',
                type: 'address',
            },
        ],
        name: 'AddressEmptyCode',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'AddressInsufficientBalance',
        type: 'error',
    },
    {
        inputs: [],
        name: 'EnforcedPause',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ExpectedPause',
        type: 'error',
    },
    {
        inputs: [],
        name: 'FailedInnerCall',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ReentrancyGuardReentrantCall',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
        ],
        name: 'SafeERC20FailedOperation',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'src',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'dest',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint16',
                name: 'destWormChainId',
                type: 'uint16',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'tokenOut',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint64',
                name: 'sequence',
                type: 'uint64',
            },
        ],
        name: 'BridgePaymentInitiated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'dest',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'PaymentSuccessful',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'bytes32',
                name: 'paymentId',
                type: 'bytes32',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'tokenIn',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'tokenOut',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amountOut',
                type: 'uint256',
            },
        ],
        name: 'SwapExecuted',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [],
        name: 'BASIS_POINTS',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'MAX_COMMISSION_RATE',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: 'allowed',
                type: 'bool',
            },
        ],
        name: 'addRouterToAllowlist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'allowlistedRouters',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'commissionRate',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'bytes',
                name: 'encodedVm',
                type: 'bytes',
            },
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'router',
                        type: 'address',
                    },
                    {
                        internalType: 'address[]',
                        name: 'route',
                        type: 'address[]',
                    },
                    {
                        internalType: 'uint24[]',
                        name: 'fees',
                        type: 'uint24[]',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amountOutMinimum',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'deadline',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'swapType',
                        type: 'uint8',
                    },
                ],
                internalType: 'struct PaymentStructs.SwapParams[]',
                name: 'swapParamsArray',
                type: 'tuple[]',
            },
        ],
        name: 'completePayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'currentWormChainId',
        outputs: [
            {
                internalType: 'uint16',
                name: '',
                type: 'uint16',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'address',
                        name: 'router',
                        type: 'address',
                    },
                    {
                        internalType: 'address[]',
                        name: 'route',
                        type: 'address[]',
                    },
                    {
                        internalType: 'uint24[]',
                        name: 'fees',
                        type: 'uint24[]',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amountOutMinimum',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'deadline',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'swapType',
                        type: 'uint8',
                    },
                ],
                internalType: 'struct PaymentStructs.SwapParams[]',
                name: 'swapParamsArray',
                type: 'tuple[]',
            },
            {
                components: [
                    {
                        internalType: 'bytes32',
                        name: 'paymentId',
                        type: 'bytes32',
                    },
                    {
                        internalType: 'address',
                        name: 'destAddress',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenIn',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'tokenOut',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amountIn',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct PaymentStructs.PaymentParams',
                name: 'paymentParams',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'uint16',
                        name: 'destWormChainId',
                        type: 'uint16',
                    },
                    {
                        internalType: 'bytes32',
                        name: 'bridgeRecipient',
                        type: 'bytes32',
                    },
                ],
                internalType: 'struct PaymentStructs.BridgeParams',
                name: 'bridgeParams',
                type: 'tuple',
            },
        ],
        name: 'makePayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'router',
                type: 'address',
            },
        ],
        name: 'removeRouterFromAllowlist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'rescueTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newRate',
                type: 'uint256',
            },
        ],
        name: 'setCommissionRate',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'updateOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

export default abi;