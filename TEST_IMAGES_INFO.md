# Test Images for Demo

## How the Hardcoded Captions Work

The upload route `/app/api/agent/upload/route.ts` hardcodes 2 captions based on the file hash:

```typescript
const GOOD_CAPTION = "a handwritten digit on white paper";
const BAD_CAPTION = "a photograph of a cat sitting on a couch";

// Hash determines which caption (alternates)
const imageDescription = (hashNum % 2 === 0) ? GOOD_CAPTION : BAD_CAPTION;
```

## Test Images

### Test 1: `/public/test-digit.txt`
- **Caption**: "a handwritten digit on white paper"
- **Bounty**: "Handwritten Digit Recognition"
- **Expected**: ✅ PASS 0G Compute verification
- **Result**: Uploaded to 0G Storage → ROFL evaluates → Gets reward

### Test 2: `/public/test-cat.txt`
- **Caption**: "a photograph of a cat sitting on a couch"
- **Bounty**: "Handwritten Digit Recognition"
- **Expected**: ❌ FAIL 0G Compute verification
- **Result**: Rejected before 0G Storage upload

## Testing the Flow

1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/consumer/bounties/{contract_address}
3. Upload `test-digit.txt` → Should PASS
4. Upload `test-cat.txt` → Should FAIL

## What Happens

1. **File Upload** → Backend receives file
2. **Hardcoded Caption** → Based on file hash
3. **0G Compute** → LLM verifies caption matches bounty
   - Good digit → ✅ Pass
   - Cat photo → ❌ Reject
4. **0G Storage** → Only uploads if verified
5. **Contract** → User submits rootHash
6. **ROFL** → Downloads from 0G Storage, evaluates uniqueness
7. **Payout** → If unique and good quality

## Demo Script

"I'll upload two images. Watch how 0G Compute verifies them..."

**Upload test-digit.txt**:
- "This image shows a handwritten digit"
- "0G Compute verifies it matches our bounty"
- "Gets uploaded to 0G Storage"
- "ROFL agent evaluates it offchain"
- "User gets rewarded!"

**Upload test-cat.txt**:
- "This image shows a cat"
- "0G Compute rejects it - doesn't match the bounty"
- "Never gets uploaded to storage"
- "User gets nothing"

This demonstrates both 0G technologies working together for quality control.
