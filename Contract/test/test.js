const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { expect, assert } = require("chai");

describe("MultiSignature Wallet", () => {
  let contract;
  let deployer, SignerOne, SignerTwo;
  beforeEach(async () => {
    [deployer, SignerOne, SignerTwo, receiver] = await ethers.getSigners();

    await deployments.fixture("all");
    contract = await ethers.getContract("MultiSignature", deployer);
  });

  describe("Deployment", () => {
    it("Should deploy the contract", async () => {
      const signerOne = await contract.signers(0);
      const signerTwo = await contract.signers(1);
      const quorum = await contract.i_quorum();
      assert.equal(signerOne, SignerOne.address);
      assert.equal(signerTwo, SignerTwo.address);
      assert.equal(quorum.toString(), "2");
    });
  });

  describe("Create Transfer", () => {
    it("Should not create a transfer if the func caller is not a signer", async () => {
      await expect(contract.createTransfer(10, receiver.address)).to.be
        .reverted;
    });

    it("Should create transfer", async () => {
      const signerOneConnected = contract.connect(SignerOne);
      await signerOneConnected.createTransfer(10, receiver.address);
      const [id, amount, to, approvals, isSent] = await contract.transfers(0);

      assert.equal(id.toString(), 0);
      assert.equal(amount.toString(), "10");
      assert.equal(to, receiver.address);
      assert.equal(approvals.toString(), 0);
      assert.equal(isSent, false);
    });
  });

  describe("Send Transaction", () => {
    let signerOneConnected, signerTwoConnected;

    beforeEach(async () => {
      signerOneConnected = contract.connect(SignerOne);
      signerTwoConnected = contract.connect(SignerTwo);
      await signerOneConnected.createTransfer(10, receiver.address);
    });

    it("should approve the transfer", async () => {
      const [id, , , approvalsInit] = await contract.transfers(0);
      await signerOneConnected.sendTransfer(0);
      const approvedTransfer = await contract.approvedTransfer(
        SignerOne.address,
        0
      );

      const [, , , appprovalsNew] = await contract.transfers(0);
      assert.equal(appprovalsNew.toString(), "1");
      assert(approvedTransfer);
    });

    it("Should not approve transfer", async () => {
      await expect(contract.sendTransfer(0)).to.be.revertedWith(
        "Only Signer allowed"
      );
      const approvedTransfer = await contract.approvedTransfer(
        deployer.address,
        0
      );
      const [, , , approvals] = await contract.transfers(0);
      assert(!approvedTransfer);
      assert.equal(approvals.toString(), "0");
    });

    it("Should Send the Transfer", async () => {
      const receiverInitBalance = await receiver.provider.getBalance(
        receiver.address
      );

      await signerOneConnected.sendTransfer(0);
      await signerTwoConnected.sendTransfer(0);
      await signerTwoConnected.sendTransfer(0);
      const approvedTransferDeployer = await contract.approvedTransfer(
        deployer.address,
        0
      );
      const approvedTransferSignerOne = await contract.approvedTransfer(
        SignerOne.address,
        0
      );
      const approvedTransferSignerTwo = await contract.approvedTransfer(
        SignerTwo.address,
        0
      );
      const receiverAfterBalance = await receiver.provider.getBalance(
        receiver.address
      );
      const [, , , approval, isSent] = await contract.transfers(0);
      assert.equal(
        receiverAfterBalance.sub(receiverInitBalance).toString(),
        "10"
      );
      assert.equal(approval.toString(), "2");
      assert.equal(isSent, true);
      assert.equal(approvedTransferDeployer, false);
      assert(approvedTransferSignerOne);
      assert(approvedTransferSignerTwo);
    });

    it("Should not approve a transfer twice by same signer", async () => {
      await signerOneConnected.sendTransfer(0);
      await expect(signerOneConnected.sendTransfer(0)).to.be.reverted;
      const [, , , approvals] = await contract.transfers(0);
      assert(approvals.toString(), "1");
    });

    it("Should not send already sent transfer", async () => {
      await signerOneConnected.sendTransfer(0);
      await signerTwoConnected.sendTransfer(0);
      await signerTwoConnected.sendTransfer(0);
      const [, , , approval, isSent] = await contract.transfers(0);
      assert(isSent);
      await expect(signerOneConnected.sendTransfer(0)).to.be.reverted;
    });
  });
});
