require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
    },
    rinkeby: {
      chainId: 4,
      blockConfirmations: 6,
      url: "",
    },
  },
  etherscan: {
    apiKey: "",
  },

  namedAccounts: {
    deployerrr: {
      default: 0,
    },
    tester: {
      default: 1,
    },
  },
};
