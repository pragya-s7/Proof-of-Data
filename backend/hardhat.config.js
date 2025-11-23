require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  networks: {
    hardhat: {},

    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/kls8f86lGR1T0YeE-_mGfYiYMcfgKzik",
      chainId: 11155111,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },

    mainnet: {
      url: "https://eth-mainnet.g.alchemy.com/v2/kls8f86lGR1T0YeE-_mGfYiYMcfgKzik",
      chainId: 1,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
