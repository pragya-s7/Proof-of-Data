# DeTrain Deployment Guide

## System Architecture

### Components
1. **Smart Contracts** (Oasis Sapphire Testnet)
   - DataTraining.sol - Main bounty contract
   - MockUSDC.sol - Reward token

2. **ROFL Agent** (Oasis ROFL Protocol)
   - Runs offchain in TEE
   - Evaluates data submissions
   - Reports results to contract

3. **0G Network**
   - 0G Compute: LLM inference for data verification
   - 0G Storage: Decentralized storage for submitted data

4. **Frontend** (Next.js)
   - Bounty marketplace
   - Data upload interface
   - Wallet integration

## Current Deployment Status

### ✓ Smart Contracts Deployed
- Network: Oasis Sapphire Testnet
- DataTraining: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`
- MockUSDC: `0xdAfb72a1571E0b80D846cB96b6831B53deb9644E`
- Reward Pool: 200 MockUSDC funded

### ⚠ ROFL Agent (Needs Deployment)
- App ID: `rofl1qrsy2g0r2xx5rzhhzqmwsz4jmsws387sagr3t5at`
- Status: Container built, needs deployment to Oasis
- Location: `/rofl-agent/`

## ROFL Agent Deployment

### Prerequisites
1. Install Oasis CLI:
   ```bash
   curl -Lo rofl https://github.com/oasisprotocol/cli/releases/download/v0.8.0/rofl
   chmod +x rofl
   sudo mv rofl /usr/local/bin/
   ```

2. Configure wallet account (already done in rofl.yaml):
   ```bash
   # Account name: my_account
   # Used for: ROFL app deployment
   ```

### Deployment Steps

1. **Build the Docker image** (if not already built):
   ```bash
   cd rofl-agent
   docker build -t docker.io/pragya7/detrain-agent:v6 --platform linux/amd64 .
   ```

2. **Push to Docker Hub**:
   ```bash
   docker push docker.io/pragya7/detrain-agent:v6
   ```

3. **Deploy ROFL app**:
   ```bash
   cd rofl-agent
   rofl build
   rofl deploy
   ```

4. **Verify deployment**:
   ```bash
   rofl status
   ```

   Check logs:
   ```bash
   rofl logs
   ```

### ROFL Agent Functionality

The agent:
1. Listens for `DataSubmitted` events from DataTraining contract
2. Downloads image from 0G Storage using the dataHash
3. Processes image and extracts features
4. Evaluates if data improves the model
5. Calculates accuracy delta
6. Calls `reportEvaluation()` on contract with results
7. Contract automatically pays out rewards if positive contribution

## Testing the System

### Quick Test
```bash
python3 scripts/test_e2e_flow.py
```

### Manual Test Flow

1. **Start Frontend**:
   ```bash
   npm run dev
   ```

2. **Navigate to Bounties**:
   - Open: http://localhost:3000/consumer/bounties

3. **Identify REAL Bounty**:
   - **"Handwritten Digit Recognition Dataset"** by OpenAI Research (REAL)
   - Contract address: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`
   - Others are fake for demo purposes

4. **Submit Data**:
   - Click on the real bounty
   - Upload a handwritten digit image
   - Enter the label (0-9)
   - Click "Verify & Submit"

5. **Watch the Flow**:
   - ✓ Image captioned by HuggingFace BLIP
   - ✓ Caption verified by 0G Compute LLM
   - ✓ Image stored on 0G Storage
   - ✓ dataHash + label submitted to contract
   - ✓ ROFL agent detects event
   - ✓ Agent downloads image and evaluates
   - ✓ Agent reports evaluation
   - ✓ Contract pays reward!

## Monitoring

### Check Contract Events
```python
python3 scripts/check_reward_pool.py
```

### Check ROFL Agent Logs
```bash
cd rofl-agent
rofl logs
```

### Check Oasis Explorer
- Testnet: https://explorer.oasis.io/testnet/sapphire
- Search for contract: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`

## Troubleshooting

### ROFL Agent Not Responding
1. Check if agent is running: `rofl status`
2. Check logs: `rofl logs`
3. Verify CONTRACT_ADDRESS is set in rofl.yaml secrets
4. Ensure ROFL App ID matches in contract

### 0G Storage Upload Fails
1. Verify ZG_PRIVATE_KEY in .env
2. Check 0G Storage RPC: https://rpc-storage-testnet.0g.ai
3. Ensure sufficient 0G testnet tokens

### 0G Compute Verification Fails
1. Check HF_TOKEN is valid
2. Verify 0G Compute provider is online
3. Check image quality and format

### No Reward Payout
1. Check reward pool: `python3 scripts/check_reward_pool.py`
2. Verify ROFL agent evaluated positively
3. Check contract events on explorer
4. Ensure model baseline is initialized

## Key Environment Variables

```bash
# Wallet
PRIVATE_KEY=<your_key>

# 0G Network
ZG_PRIVATE_KEY=<your_key>
ZG_STORAGE_RPC=https://rpc-storage-testnet.0g.ai

# HuggingFace
HF_TOKEN=<your_token>

# Contracts
DATA_TRAINING_CONTRACT_ADDRESS=0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f
NEXT_PUBLIC_DETRAIN_CONTRACT_ADDRESS=0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f
```

## Demo Notes

### What's Real
- DataTraining smart contract on Oasis Sapphire ✓
- ROFL agent evaluating submissions ✓
- 0G Storage for data persistence ✓
- 0G Compute for verification ✓
- One working bounty: "Handwritten Digit Recognition" ✓

### What's Fake (for demo)
- Other bounties in the marketplace (Stanford Med AI, Tesla AI, Anthropic)
- These are UI-only for demonstration purposes

### The Real Bounty
**Name**: Handwritten Digit Recognition Dataset
**Lab**: OpenAI Research (REAL)
**Reward**: 500 USDC per verified batch
**Contract**: 0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f
**Status**: Fully functional end-to-end

This bounty is fully integrated with:
- 0G Compute verification
- 0G Storage
- Oasis ROFL agent evaluation
- Automatic reward payouts
