-- Create wallet table
CREATE TABLE wallet (
    walletAddress VARCHAR(255) PRIMARY KEY,
    role ENUM('creator', 'follower') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create token_account table
CREATE TABLE token_account (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tokenAddress VARCHAR(255) NOT NULL,
    chainId INT NOT NULL,
    chainName VARCHAR(255) NOT NULL,
    decimals INT NOT NULL,
    logoURI VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(255) NOT NULL
);

-- Create link table
CREATE TABLE link (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('tip', 'donation', 'payment') NOT NULL,
    destinationTokenInfoId INT,
    destinationWalletAddress VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destinationTokenInfoId) REFERENCES token_account(id),
    FOREIGN KEY (destinationWalletAddress) REFERENCES wallet(walletAddress)
);

-- Create transaction table
CREATE TABLE transaction (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transactionType ENUM('tip', 'donation', 'payment', 'swap') NOT NULL,
    statusType ENUM('inProgress', 'success', 'failed') NOT NULL,
    sourceTokenAmount DECIMAL(20, 10) NOT NULL,
    sourceTotalFiat DECIMAL(20, 10) NOT NULL,
    sourceTokenPriceFiat DECIMAL(20, 10) NOT NULL,
    feeInFiat DECIMAL(20, 10) NOT NULL,
    destinationTokenAmount DECIMAL(20, 10) NOT NULL,
    destinationTotalFiat DECIMAL(20, 10) NOT NULL,
    destinationTokenPriceFiat DECIMAL(20, 10) NOT NULL,
    transactionHash VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sourceWalletAddress VARCHAR(255),
    sourceTokenInfoId INT,
    linkId VARCHAR(10),
    FOREIGN KEY (sourceWalletAddress) REFERENCES wallet(walletAddress),
    FOREIGN KEY (sourceTokenInfoId) REFERENCES token_account(id),
    FOREIGN KEY (linkId) REFERENCES link(id)
);

-- Create setting table
CREATE TABLE setting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    userName VARCHAR(255),
    email VARCHAR(255),
    twitter VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    youtube VARCHAR(255),
    twitch VARCHAR(255),
    instagram VARCHAR(255),
    threads VARCHAR(255),
    discord VARCHAR(255),
    telegram VARCHAR(255),
    link1 VARCHAR(255),
    link2 VARCHAR(255),
    walletAddress VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (walletAddress) REFERENCES wallet(walletAddress)
);