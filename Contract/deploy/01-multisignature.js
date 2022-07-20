const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const verify = require("../scripts/verify");
const { localNetworks } = require("../helper-hardhat.config");

module.exports = async () => {
  const { deployer, signerOne, signerTwo } = await getNamedAccounts();

  const { deploy, log } = deployments;
  const args = [[signerOne, signerTwo], 2];
  const contract = await deploy("MultiSignature", {
    from: deployer,
    args,
    value: ethers.utils.parseEther("1"),
    log: true,
    waitConfirmations: 1,
  });

  if (!localNetworks.includes(network.name)) {
    await verify(contract.address, [[signerOne, signerTwo], 2]);
  }
};

module.exports.tags = ["all"];
