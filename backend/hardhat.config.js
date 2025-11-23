require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Function to check if the PRIVATE_KEY is a valid 64-char hex string
const getAccounts = (privateKey) => {
  if (privateKey && privateKey.length === 66 && privateKey.startsWith('0x')) {
    return [privateKey];
  }
  if (privateKey && privateKey.length === 64) { // Assume 0x is omitted
    return [`0x${privateKey}`];
  }
  return [];
};

module.exports = {
  solidity: {
    version: "0.8.20", // Changed from "0.8.19"
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  networks: {
    hardhat: {},

    galileo: {
      url: "https://rpc.ankr.com/0g_galileo_testnet_evm",
      chainId: 16602,
      accounts: getAccounts(PRIVATE_KEY),
    },

    mainnet: {
      url: "https://eth-mainnet.g.alchemy.com/v2/kls8f86lGR1T0YeE-_mGfYiYMcfgKzik",
      chainId: 1,
      accounts: getAccounts(PRIVATE_KEY),
    },
  },
};
