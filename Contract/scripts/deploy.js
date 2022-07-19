const { getNamedAccounts, deployments } = require("hardhat");

const main = async () => {
  const deployer = await getNamedAccounts();
  const { deploy, log } = deployments;
  console.log(deployer);
};

main();
