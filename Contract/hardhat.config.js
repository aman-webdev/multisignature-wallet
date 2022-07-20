require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY_SIGNER_ONE = process.env.PRIVATE_KEY_SIGNER_ONE;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_SIGNER_ONE],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    signerOne: {
      default: 1,
    },
    signerTwo: {
      default: 2,
    },
  },
};
