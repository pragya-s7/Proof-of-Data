// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// This is a simplified smart contract for the Hackathon
contract DataTraining {
    address public oracle; // The Python agent
    address public lab;    // The AI Lab owner

    struct Submission {
        address contributor;
        string dataHash; // 0G Storage CID
        bool verified;
        int256 impactScore; // Scaled by 1000 (e.g., 500 = 0.5%)
        bool paid;
    }

    mapping(uint256 => Submission) public submissions;
    uint256 public submissionCount;
    uint256 public baseReward = 50 * 10**6; // 50 USDC (assuming 6 decimals)

    event DataSubmitted(uint256 indexed id, address indexed contributor, string dataHash);
    event Payout(uint256 indexed id, address indexed contributor, uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }

    constructor(address _oracle) {
        lab = msg.sender;
        oracle = _oracle;
    }

    // User submits data
    function submitData(string memory _dataHash) external {
        submissionCount++;
        submissions[submissionCount] = Submission({
            contributor: msg.sender,
            dataHash: _dataHash,
            verified: false,
            impactScore: 0,
            paid: false
        });
        
        emit DataSubmitted(submissionCount, msg.sender, _dataHash);
    }

    // Oracle reports back the model improvement
    function reportEvaluation(uint256 _submissionId, int256 _impactScore) external onlyOracle {
        Submission storage sub = submissions[_submissionId];
        require(!sub.verified, "Already verified");
        
        sub.verified = true;
        sub.impactScore = _impactScore;

        if (_impactScore > 0) {
            // Simple Payout Logic: Base + Bonus
            uint256 bonus = uint256(_impactScore) * 1 * 10**6; 
            uint256 totalPayout = baseReward + bonus;
            
            // In production, this would transfer ERC20 tokens
            // IERC20(usdc).transfer(sub.contributor, totalPayout);
            sub.paid = true;
            emit Payout(_submissionId, sub.contributor, totalPayout);
        }
    }

    // Lab deposits funds (mock)
    function deposit() external payable {}
}
