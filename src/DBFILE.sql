-- Create chain table
CREATE TABLE chain (
    id BIGINT PRIMARY KEY NOT NULL,
    networkId BIGINT,
    name VARCHAR(255),
    allowed BOOLEAN,
    iconURL VARCHAR(255),
    nativeCurrency JSONB,
    explorerURL VARCHAR(255)
);

-- Create token table
CREATE TABLE token (
    id BIGINT PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    symbol VARCHAR(255),
    decimals FLOAT8,
    tokenAddress VARCHAR(255),
    chainId BIGINT,
    logoURI VARCHAR(255),
    FOREIGN KEY (chainId) REFERENCES chain(id)
);

-- Create transaction_type table
CREATE TABLE transaction_type (
    id BIGINT PRIMARY KEY NOT NULL,
    type VARCHAR(255)
);

-- Create transaction table
CREATE TABLE transaction (
    id BIGINT PRIMARY KEY NOT NULL,
    typeId BIGINT,
    status VARCHAR(255),
    sourceTokenAmount INT,
    sourceTotalFiat INT,
    sourceTokenPriceFiat INT,
    feeInFiat INT,
    destinationTokenAmount INT,
    destinationTotalFiat INT,
    destinationTokenPriceFiat INT,
    transactionHash VARCHAR(255),
    createdAt DATE,
    updatedAt DATE,
    sourceTokenId BIGINT,
    destinationTokenId BIGINT,
    sourceChainId BIGINT,
    destinationChainId BIGINT,
    walletId BIGINT,
    linkId BIGINT,
    fee FLOAT8,
    FOREIGN KEY (typeId) REFERENCES transaction_type(id),
    FOREIGN KEY (sourceChainId) REFERENCES chain(id),
    FOREIGN KEY (destinationChainId) REFERENCES chain(id),
    FOREIGN KEY (sourceTokenId) REFERENCES token(id),
    FOREIGN KEY (destinationTokenId) REFERENCES token(id),
    FOREIGN KEY (walletId) REFERENCES wallet(id),
    FOREIGN KEY (linkId) REFERENCES link(id)
);

-- Create wallet table
CREATE TABLE wallet (
    id BIGINT PRIMARY KEY NOT NULL,
    address VARCHAR(255),
    userId BIGINT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id)
);

-- Create user table
CREATE TABLE user (
    id BIGINT PRIMARY KEY NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    userName VARCHAR(255),
    email VARCHAR(255),
    profileURI VARCHAR(255),
    walletId BIGINT,
    slogan VARCHAR(255),
    about TEXT,
    websiteLink VARCHAR(255),
    FOREIGN KEY (walletId) REFERENCES wallet(id)
);

-- Create link table
CREATE TABLE link (
    id BIGINT PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    description TEXT,
    imageUrl VARCHAR(255),
    type VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acceptUntil TIMESTAMP,
    goalAmount FLOAT8,
    destinationTokenId BIGINT,
    destinationChainId BIGINT,
    destinationWalletId BIGINT,
    FOREIGN KEY (destinationTokenId) REFERENCES token(id),
    FOREIGN KEY (destinationChainId) REFERENCES chain(id),
    FOREIGN KEY (destinationWalletId) REFERENCES wallet(id)
);

-- Create social table
CREATE TABLE social (
    id BIGINT PRIMARY KEY NOT NULL,
    userId BIGINT,
    name VARCHAR(255),
    url VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES user(id)
);

-- Create message table
CREATE TABLE message (
    id BIGINT PRIMARY KEY NOT NULL,
    title VARCHAR(255),
    body TEXT,
    imageUrl VARCHAR(255),
    linkId BIGINT,
    userId BIGINT,
    FOREIGN KEY (linkId) REFERENCES link(id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

-- Create payment_method table
CREATE TABLE payment_method (
    id BIGINT PRIMARY KEY,
    chainId BIGINT,
    linkId BIGINT,
    userId BIGINT,
    FOREIGN KEY (chainId) REFERENCES chain(id),
    FOREIGN KEY (linkId) REFERENCES link(id),
    FOREIGN KEY (userId) REFERENCES user(id)
);

/*
-- Create tip table
CREATE TABLE tip (
    id BIGINT PRIMARY KEY NOT NULL,
    amount FLOAT8,
    tokenId BIGINT,
    linkId BIGINT,
    FOREIGN KEY (tokenId) REFERENCES token(id),
    FOREIGN KEY (linkId) REFERENCES link(id)
);
*/