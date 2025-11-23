# DeTrain Deployment Status

## ✅ WORKING - Already Deployed

### Smart Contracts on Oasis Sapphire Testnet
- **DataTraining Contract**: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`
- **MockUSDC**: `0xdAfb72a1571E0b80D846cB96b6831B53deb9644E`
- **Reward Pool**: 200 USDC funded
- **Network**: Oasis Sapphire Testnet

Verify: https://explorer.oasis.io/testnet/sapphire/address/0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f

### Frontend
- Next.js app ready
- Upload interface configured
- Wallet integration working
- 0G Storage integration in upload route

## ⚠️ NEEDS DEPLOYMENT - Critical

### 1. ROFL Agent on Oasis
**Status**: Container built, NOT deployed yet
**App ID**: `rofl1qrsy2g0r2xx5rzhhzqmwsz4jmsws387sagr3t5at`
**Location**: `/rofl-agent/`

**What it does**:
- Listens for DataSubmitted events from contract
- Downloads images from 0G Storage
- Evaluates uniqueness (checks for duplicates, quality)
- Reports evaluation score back to contract
- Contract pays out rewards based on score

**To deploy**:
```bash
cd rofl-agent
rofl build
rofl deploy
rofl status  # verify it's running
rofl logs    # check logs
```

**Critical files**:
- `rofl_agent.py` - Main agent logic
- `model_manager.py` - Uniqueness evaluation
- `Dockerfile` - Container definition
- `compose.yaml` - Docker compose config
- `rofl.yaml` - ROFL configuration

### 2. 0G Infrastructure

#### 0G Storage
**Status**: SDK integrated in upload route
**Code**: `/app/api/agent/upload/route.ts` lines 104-117
**RPC**: `https://rpc-storage-testnet.0g.ai`

**What happens**:
1. User uploads image via frontend
2. Backend receives file
3. File uploaded to 0G Storage
4. Returns `rootHash` (content ID)
5. User submits `rootHash` to contract

**Testing**: Upload works via the API route - 0G Storage SDK is functional

#### 0G Compute/Inference
**Status**: SDK integrated, provider may be offline
**Code**: `/app/api/agent/upload/route.ts` lines 49-102
**Provider**: `0xf07240Efa67755B5311bc75784a061eDB47165Dd`

**What it does** (OPTIONAL - fails gracefully):
1. Captions image using HuggingFace
2. Sends caption to 0G Compute LLM
3. LLM verifies if image matches bounty requirements
4. Rejects if clearly wrong (e.g., cat when expecting dog)

**Current behavior**: If 0G Compute unavailable, it proceeds anyway (demo mode)

## 🎯 THE CRITICAL PATH

For the demo to work, you MUST:

1. **Deploy ROFL Agent**
   ```bash
   cd rofl-agent
   rofl build
   rofl deploy
   ```

2. **Verify ROFL is running**
   ```bash
   rofl status
   rofl logs
   ```

3. **Test the flow**:
   - Start frontend: `npm run dev`
   - Go to http://localhost:3000/consumer/bounties
   - Click "Handwritten Digit Recognition" (the REAL bounty)
   - Upload an image
   - Watch it flow through:
     - ✓ 0G Storage (upload works)
     - ✓ Contract submission (works)
     - ⚠️ ROFL evaluation (NEEDS deployment)
     - ⚠️ Reward payout (NEEDS ROFL)

## 📝 What Actually Gets Used

### Used in Demo (MUST work):
- ✅ Oasis Sapphire (contract deployed)
- ✅ 0G Storage (SDK integrated, works)
- ⚠️ Oasis ROFL (built, NOT deployed)
- ~ 0G Compute (integrated but fails gracefully)

### Not Used (Can be fake):
- ❌ Bounty creation (not connected)
- ❌ Multiple bounties (fake UI only)
- ❌ User profiles (not implemented)

## 🚀 Quick Deploy Script

```bash
#!/bin/bash
# Deploy ROFL Agent

cd rofl-agent

# Build the container
echo "Building ROFL container..."
docker build -t docker.io/pragya7/detrain-agent:v6 --platform linux/amd64 .

# Push to registry (if needed)
echo "Pushing to Docker Hub..."
docker push docker.io/pragya7/detrain-agent:v6

# Build ROFL app
echo "Building ROFL app..."
rofl build

# Deploy
echo "Deploying ROFL agent..."
rofl deploy

# Check status
echo "Checking deployment status..."
rofl status

# Show logs
echo "Recent logs:"
rofl logs --tail 50

echo "✅ Deployment complete!"
echo "Contract address: 0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f"
echo "ROFL App ID: rofl1qrsy2g0r2xx5rzhhzqmwsz4jmsws387sagr3t5at"
```

## 🔍 How to Verify Everything Works

### 1. Check Contract
```python
python3 scripts/test_e2e_flow.py
```

### 2. Check ROFL Agent
```bash
cd rofl-agent
rofl status
rofl logs
```

### 3. Test Upload
- Go to http://localhost:3000/consumer/bounties/{contract_address}
- Upload test image
- Check browser console for upload logs
- Check ROFL logs for evaluation

### 4. Check Payout
```python
python3 scripts/check_reward_pool.py
```

## 💡 The Real Bounty

**Name**: Handwritten Digit Recognition Dataset
**Contract**: `0xbd10d0eC2B534A1d1E5A5228b7B3909C92af902f`
**Reward**: Up to 500 USDC per unique submission
**How it works**: ROFL agent checks if image is unique + good quality

**Other bounties on the page are FAKE** - just UI for demo purposes.

## 🎬 Demo Flow

1. User connects wallet
2. User navigates to the REAL bounty
3. User uploads an image
4. Image gets uploaded to 0G Storage → rootHash
5. User submits rootHash to contract
6. ROFL agent detects event
7. ROFL downloads from 0G Storage
8. ROFL evaluates uniqueness
9. ROFL reports score to contract
10. Contract pays reward if score > 0

**Total time**: ~20-30 seconds

## ❗ BLOCKER

**The ONLY blocker is deploying the ROFL agent.**

Everything else is working:
- ✅ Contracts deployed
- ✅ Funded with rewards
- ✅ Frontend ready
- ✅ 0G Storage integrated
- ⚠️ ROFL agent built but not deployed

**Deploy command**:
```bash
cd rofl-agent && rofl deploy
```
