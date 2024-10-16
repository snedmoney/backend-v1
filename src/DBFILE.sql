-- Create Enum Types
CREATE TYPE "link_type" AS ENUM (
    'tip',
    'donation',
    'payment'
);

CREATE TYPE "status_type" AS ENUM (
    'inProgress',
    'success',
    'failed'
);

CREATE TYPE "transaction_type" AS ENUM (
    'tip',
    'donation',
    'payment',
    'swap'
);

-- Create Wallet Table
CREATE TABLE "wallet" (
    "walletAddress" varchar(255) NOT NULL,
    "name" varchar NULL,
    "userName" varchar NULL,
    "email" varchar NULL,
    "twitter" varchar NULL,
    "facebook" varchar NULL,
    "tiktok" varchar NULL,
    "youtube" varchar NULL,
    "twitch" varchar NULL,
    "instagram" varchar NULL,
    "threads" varchar NULL,
    "discord" varchar NULL,
    "telegram" varchar NULL,
    "link1" varchar NULL,
    "link2" varchar NULL,
    PRIMARY KEY ("walletAddress")
);

-- Create TokenAccount Table
CREATE TABLE "token_account" (
    "id" serial PRIMARY KEY,
    "tokenAddress" varchar NOT NULL,
    "chainId" integer NOT NULL,
    "chainName" varchar NOT NULL,
    "decimals" integer NOT NULL,
    "logoURI" varchar NOT NULL,
    "name" varchar NOT NULL,
    "symbol" varchar NOT NULL
);

-- Create Link Table
CREATE TABLE "link" (
    "id" varchar(10) PRIMARY KEY,
    "name" varchar NOT NULL,
    "type" "link_type" NOT NULL,
    "destinationTokenInfoId" integer,
    "destinationWalletAddress" varchar(255),
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    FOREIGN KEY ("destinationTokenInfoId") REFERENCES "token_account" ("id"),
    FOREIGN KEY ("destinationWalletAddress") REFERENCES "wallet" ("walletAddress")
);

-- Create Transaction Table
CREATE TABLE "transaction" (
    "id" serial PRIMARY KEY,
    "transactionType" "transaction_type" NOT NULL,
    "statusType" "status_type" NOT NULL,
    "sourceTokenAmount" numeric NOT NULL,
    "sourceTotalFiat" numeric NOT NULL,
    "sourceTokenPriceFiat" numeric NOT NULL,
    "feeInFiat" numeric NOT NULL,
    "destinationTokenAmount" numeric NOT NULL,
    "destinationTotalFiat" numeric NOT NULL,
    "destinationTokenPriceFiat" numeric NOT NULL,
    "transactionHash" varchar NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "updatedAt" timestamp NOT NULL DEFAULT now(),
    "sourceWalletAddress" varchar(255),
    "sourceTokenInfoId" integer,
    "linkId" varchar(10),
    FOREIGN KEY ("sourceWalletAddress") REFERENCES "wallet" ("walletAddress"),
    FOREIGN KEY ("sourceTokenInfoId") REFERENCES "token_account" ("id"),
    FOREIGN KEY ("linkId") REFERENCES "link" ("id")
);
