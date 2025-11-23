// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * DeTrain Marketplace
 * Native-token version (0G / ETH)
 * No ERC20 required.
 */
contract DeTrainMarketplace {
    /* ========== STRUCTS ========== */

    struct Bounty {
        uint256 id;
        address labOwner;
        string description;
        string metadataURI;
        uint256 rewardAmount;      // payout per submission (in native)
        uint256 maxSubmissions;
        uint256 submissionCount;
        bool isOpen;
    }

    struct Submission {
        uint256 id;
        uint256 bountyId;
        address submitter;
        string dataHash;
        uint256 payout;
        uint256 timestamp;
    }

    /* ========== STATE ========== */

    uint256 public nextBountyId = 1;
    uint256 public nextSubmissionId = 1;

    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Submission) public submissions;
    mapping(uint256 => uint256[]) public bountySubmissions;

    /* ========== EVENTS ========== */

    event BountyCreated(uint256 indexed bountyId, address indexed labOwner);
    event BountyClosed(uint256 indexed bountyId);
    event SubmissionMade(uint256 indexed bountyId, uint256 indexed submissionId, address indexed submitter, uint256 payout);
    event LabWithdrew(uint256 indexed bountyId, address indexed labOwner, uint256 amount);

    /* ========== CREATE BOUNTY ========== */

    /**
     * Labs create a bounty by **sending native 0G tokens**
     */
    function createBounty(
        string calldata description,
        string calldata metadataURI,
        uint256 rewardAmount,
        uint256 maxSubmissions
    ) external payable {
        require(rewardAmount > 0, "Reward must be > 0");
        require(maxSubmissions > 0, "maxSubmissions must be > 0");

        uint256 required = rewardAmount * maxSubmissions;
        require(msg.value == required, "Incorrect native token sent");

        Bounty storage b = bounties[nextBountyId];
        b.id = nextBountyId;
        b.labOwner = msg.sender;
        b.description = description;
        b.metadataURI = metadataURI;
        b.rewardAmount = rewardAmount;
        b.maxSubmissions = maxSubmissions;
        b.isOpen = true;

        emit BountyCreated(nextBountyId, msg.sender);
        nextBountyId++;
    }

    /* ========== CLOSE BOUNTY ========== */

    function closeBounty(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.labOwner, "Not lab owner");
        require(b.isOpen, "Already closed");

        b.isOpen = false;
        emit BountyClosed(bountyId);
    }

    /* ========== SUBMIT DATA ========== */

    function submitData(uint256 bountyId, string calldata dataHash) external {
        Bounty storage b = bounties[bountyId];

        require(b.isOpen, "Bounty closed");
        require(b.submissionCount < b.maxSubmissions, "Full");

        uint256 submissionId = nextSubmissionId++;

        submissions[submissionId] = Submission({
            id: submissionId,
            bountyId: bountyId,
            submitter: msg.sender,
            dataHash: dataHash,
            payout: b.rewardAmount,
            timestamp: block.timestamp
        });

        bountySubmissions[bountyId].push(submissionId);

        b.submissionCount++;

        // Pay user instantly
        (bool sent, ) = msg.sender.call{value: b.rewardAmount}("");
        require(sent, "Native token transfer failed");

        emit SubmissionMade(bountyId, submissionId, msg.sender, b.rewardAmount);

        if (b.submissionCount == b.maxSubmissions) {
            b.isOpen = false;
            emit BountyClosed(bountyId);
        }
    }

    /* ========== WITHDRAW LEFTOVER FUNDS ========== */

    function withdrawLeftover(uint256 bountyId) external {
        Bounty storage b = bounties[bountyId];
        require(msg.sender == b.labOwner, "Not lab owner");
        require(!b.isOpen, "Close bounty first");

        uint256 paid = b.submissionCount * b.rewardAmount;
        uint256 totalRequired = b.maxSubmissions * b.rewardAmount;
        uint256 leftover = totalRequired - paid;

        require(leftover > 0, "Nothing to withdraw");

        // send leftover back to the lab
        (bool sent, ) = b.labOwner.call{value: leftover}("");
        require(sent, "Transfer failed");

        emit LabWithdrew(bountyId, b.labOwner, leftover);
    }

    /* ========== VIEW ========== */

    function getBountySubmissions(uint256 bountyId) external view returns (uint256[] memory) {
        return bountySubmissions[bountyId];
    }

    /* ========== RECEIVE NATIVE TOKEN (optional) ========== */
    receive() external payable {}
}