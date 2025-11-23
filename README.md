# DeTrain - Decentralized AI Training Data Marketplace

A Web3-powered platform where users contribute high-quality training data and get rewarded based on actual model improvement.

## 🎯 What is DeTrain?

DeTrain is a decentralized marketplace connecting AI labs with data contributors. Unlike traditional data labeling platforms:

- **Performance-Based Rewards**: Get paid based on how much your data improves the AI model
- **Verified with Zero-Knowledge**: Data quality checked using 0G Compute's decentralized inference
- **Trustless Evaluation**: Model training happens in Oasis ROFL (TEE) - provably fair
- **Decentralized Storage**: Data stored on 0G Storage network

## 🏗️ Architecture

```
User Upload
    ↓
0G Compute (LLM verifies data matches bounty)
    ↓
0G Storage (Data stored decentralized)
    ↓
Smart Contract (Submission recorded on Oasis Sapphire)
    ↓
ROFL Agent (Evaluates if data improves model in TEE)
    ↓
Smart Contract (Pays reward if positive contribution)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (for ROFL agent)
- Wallet with Oasis Sapphire testnet tokens

### Installation

1. Clone and install dependencies:
```bash
git clone <repo>
cd Proof_of_Data
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your keys
```

3. Start the frontend:
```bash
npm run dev
```

4. Visit http://localhost:3000

## 🎮 Try It Out

### The Real Bounty

Navigate to `/consumer/bounties` and look for:

**"Handwritten Digit Recognition Dataset"**
- Lab: OpenAI Research (REAL)
- Reward: 500 USDC
- Type: Computer Vision / MNIST

This is the **only real bounty** - others are fake for demo purposes.

### How to Submit

1. Click on the bounty
2. Upload a handwritten digit image (0-9)
3. Enter the correct label
4. Click "Verify & Submit"
5. Wait ~30 seconds for evaluation
6. Get paid if your data improves the model!

## 🔧 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum interactions
- **Tailwind CSS** - Styling

### Smart Contracts
- **Solidity 0.8.20**
- **Hardhat** - Development environment
- **Oasis Sapphire** - Privacy-preserving EVM

### Offchain Compute
- **Oasis ROFL** - Trusted Execution Environment
- **0G Compute** - Decentralized LLM inference
- **0G Storage** - Decentralized storage

### ML/AI
- **scikit-learn** - Model (SGDClassifier)
- **HuggingFace** - Image captioning (BLIP)
- **PyTorch** - Feature extraction

## 📁 Project Structure

```
Proof_of_Data/
├── app/                    # Next.js app
│   ├── api/agent/upload/   # Upload endpoint
│   ├── consumer/bounties/  # Bounty marketplace
│   └── lab/               # Lab dashboard (demo)
├── backend/               # Smart contracts
│   ├── contracts/         # Solidity files
│   └── scripts/           # Deployment scripts
├── rofl-agent/            # Oasis ROFL agent
│   ├── rofl_agent.py      # Main agent logic
│   ├── model_manager.py   # ML evaluation
│   └── Dockerfile         # Container for TEE
├── scripts/               # Utility scripts
│   ├── test_e2e_flow.py   # Test full system
│   └── deploy_system.py   # Deploy contracts
└── components/            # React components
```

## 🔑 Key Contracts

### DataTraining.sol
Main contract handling submissions and rewards.

**Address**: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`

Key functions:
- `submitData(string dataHash)` - User submits data
- `reportEvaluation(uint256 submissionId, int256 accuracyDelta)` - ROFL agent reports
- `fundRewardPool(uint256 amount)` - Fund rewards

### MockUSDC.sol
Test USDC for rewards.

**Address**: `0xdAfb72a1571E0b80D846cB96b6831B53deb9644E`

## 🧪 Testing

Run the full system test:
```bash
python3 scripts/test_e2e_flow.py
```

Check reward pool:
```bash
python3 scripts/check_reward_pool.py
```

## 📊 How Rewards Work

1. **Base Reward**: 10 USDC (always paid for positive contribution)
2. **Bonus**: `accuracy_delta × 100 USDC`
   - If your data improves model by 0.5%, you get 50 USDC bonus
   - Total = 10 + 50 = 60 USDC

Example:
- Model accuracy before: 70%
- Model accuracy after: 70.5%
- Accuracy delta: +0.005
- Payout: 10 + (0.005 × 100) = 10.5 USDC

## 🔐 Security

- **Smart Contracts**: Deployed on Oasis Sapphire (privacy-preserving)
- **Data Verification**: 0G Compute (decentralized LLM inference)
- **Model Training**: Oasis ROFL (runs in TEE - tamper-proof)
- **Storage**: 0G Storage (decentralized, content-addressed)

## 🎯 Roadmap

- [x] Smart contract deployment
- [x] 0G integration (Storage + Compute)
- [x] ROFL agent
- [x] Basic frontend
- [ ] Multi-bounty support
- [ ] Advanced ML models
- [ ] Reputation system
- [ ] Mainnet launch

## 📝 License

MIT

## 🙏 Acknowledgments

- **Oasis Protocol** - ROFL TEE infrastructure
- **0G Labs** - Decentralized AI infrastructure
- **RainbowKit** - Wallet connection
- **Vercel** - Deployment platform

---

**The Real Bounty**: "Handwritten Digit Recognition Dataset"
**Status**: Live and working ✓
**Try it now**: http://localhost:3000/consumer/bounties
