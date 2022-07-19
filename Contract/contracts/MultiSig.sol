// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract MultiSignature {
    address[] public signers;
    uint256 public immutable i_quorum;

    constructor(address[] memory _signers, uint256 quorum) payable {
        signers = _signers;
        i_quorum = quorum;
    }

    uint256 id;

    struct Transfer {
        uint256 id;
        address payable to;
        uint256 amount;
        uint256 approvals;
        bool sent;
    }

    Transfer[] public transfers;

    mapping(address => mapping(uint => bool)) approvals;

    function fund() external payable {}

    function createTransfer(address payable to, uint256 amount)
        external
        onlySigner
    {
        transfers.push(Transfer(id, to, amount, 0, false));
        id++;
    }

    function sendTransfer(uint256 id) external onlySigner {
        Transfer memory transfer = transfers[id];
        require(transfer.sent == false, "Already sent");
        require(
            address(this).balance >= transfer.amount,
            "Not enough funds available"
        );
        if (transfer.approvals >= i_quorum) {
            transfer.to.transfer(transfer.amount);
            transfers[id].sent = true;
            return;
        }
        require(approvals[msg.sender][id] = false, "Already Approved");
        transfers[id].approvals++;
        approvals[msg.sender][id] = true;
    }

    modifier onlySigner() {
        bool isSigner = false;
        for (uint i = 0; i < signers.length; i++) {
            if (signers[i] == msg.sender) {
                isSigner = true;
            }
        }
        require(isSigner, "Only signer allowed");
        _;
    }
}
