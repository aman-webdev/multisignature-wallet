const { run } = require("hardhat");

module.exports = async (address, args) => {
  console.log("Verifying address: " + address);
  await run("verify:verify", {
    address,
    constructorArguments: args,
  });
};
