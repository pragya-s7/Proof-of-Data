// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DataTraining
 * @dev This contract manages data submissions for an AI model, evaluates their contribution,
 * and rewards the contributors based on the performance improvement.
 */
contract DataTraining is Ownable {
    enum SubmissionStatus { Pending, Evaluated }

    struct Submission {
        address contributor;
        string dataHash; // 0G Storage CID
        SubmissionStatus status;
        int256 accuracyDelta; // The improvement score
        uint256 payout;
    }

    IERC20 public rewardToken; // The ERC20 token for payouts (e.g., USDC)
    
    mapping(uint256 => Submission) public submissions;
    uint256 public nextSubmissionId;

    // The address of the trusted AI agent that reports evaluation results
    address public evaluationAgent;

    // Total funds deposited by the AI Lab
    uint256 public rewardPool;

    // A base reward per submission, can be adjusted
    uint256 public baseReward = 10 * 1e6; // Example: 10 USDC with 6 decimals

    // A multiplier for the accuracy delta to calculate the bonus
    uint256 public bonusMultiplier = 100;

    event DataSubmitted(uint256 indexed submissionId, address indexed contributor, string dataHash);
    event EvaluationReported(uint256 indexed submissionId, int256 accuracyDelta, uint256 payout);
    event RewardPoolFunded(uint256 amount);

    modifier onlyEvaluationAgent() {
        require(msg.sender == evaluationAgent, "Caller is not the evaluation agent");
        _;
    }

    constructor(address initialRewardToken, address initialAgent, address initialOwner) Ownable(initialOwner) {
        rewardToken = IERC20(initialRewardToken);
        evaluationAgent = initialAgent;
    }

    /**
     * @dev Allows the AI Lab (owner) to fund the contract's reward pool.
     */
    function fundRewardPool(uint256 amount) public payable {
        require(amount > 0, "Amount must be greater than zero");
        // For ETH-based rewards
        if (address(rewardToken) == address(0)) {
            rewardPool += msg.value;
        } else { // For ERC20-based rewards
            require(msg.value == 0, "Do not send ETH when using an ERC20 token");
            uint256 initialBalance = rewardToken.balanceOf(address(this));
            rewardToken.transferFrom(msg.sender, address(this), amount);
            uint256 finalBalance = rewardToken.balanceOf(address(this));
            rewardPool += (finalBalance - initialBalance);
        }
        emit RewardPoolFunded(amount);
    }

    /**
     * @dev Allows a user to submit a hash of their data (CID from 0G Storage).
     */
    function submitData(string calldata dataHash) external {
        uint256 submissionId = nextSubmissionId++;
        submissions[submissionId] = Submission({
            contributor: msg.sender,
            dataHash: dataHash,
            status: SubmissionStatus.Pending,
            accuracyDelta: 0,
            payout: 0
        });
        emit DataSubmitted(submissionId, msg.sender, dataHash);
    }

    /**
     * @dev Called by the evaluation agent to report the accuracy improvement and trigger payment.
     * @param submissionId The ID of the data submission being evaluated.
     * @param accuracyDelta The change in model accuracy (can be negative).
     *        It's a fixed-point number, e.g., 1000 represents +1.000% accuracy change.
     */
    function reportEvaluation(uint256 submissionId, int256 accuracyDelta) external onlyEvaluationAgent {
        Submission storage submission = submissions[submissionId];
        require(submission.status == SubmissionStatus.Pending, "Submission already evaluated");

        submission.status = SubmissionStatus.Evaluated;
        submission.accuracyDelta = accuracyDelta;

        uint256 payout = 0;
        if (accuracyDelta > 0) {
            // Calculate payout: base reward + bonus for positive contribution
            // Bonus is proportional to the accuracy improvement
            uint256 bonus = (uint256(accuracyDelta) * bonusMultiplier);
            payout = baseReward + bonus;

            if (payout > rewardPool) {
                payout = rewardPool; // Cap payout at available pool funds
            }

            if (payout > 0) {
                submission.payout = payout;
                rewardPool -= payout;
                rewardToken.transfer(submission.contributor, payout);
            }
        }
        // If accuracyDelta is <= 0, payout remains 0.

        emit EvaluationReported(submissionId, accuracyDelta, payout);
    }
    
    /**
     * @dev Allows the owner to withdraw any remaining funds from the reward pool.
     */
    function withdrawRemainingFunds() public onlyOwner {
        uint256 balance = rewardToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        rewardPool = 0;
        rewardToken.transfer(owner(), balance);
    }

    /**
     * @dev Updates the address of the evaluation agent.
     */
    function setEvaluationAgent(address newAgent) public onlyOwner {
        evaluationAgent = newAgent;
    }

    /**
     * @dev Updates the base reward.
     */
    function setBaseReward(uint256 newBaseReward) public onlyOwner {
        baseReward = newBaseReward;
    }

    /**
     * @dev Updates the bonus multiplier.
     */
    function setBonusMultiplier(uint256 newMultiplier) public onlyOwner {
        bonusMultiplier = newMultiplier;
    }
}