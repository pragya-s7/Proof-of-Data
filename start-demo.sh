#!/bin/bash

# DeTrain Demo Startup Script

echo "========================================="
echo "  DeTrain - Data Marketplace Demo"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please create .env with required variables"
    exit 1
fi

# Run system check
echo "Running system check..."
python3 scripts/test_e2e_flow.py

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  System check failed. Please review the errors above."
    exit 1
fi

echo ""
echo -e "${GREEN}✓ System check passed!${NC}"
echo ""

# Start the dev server
echo "Starting Next.js development server..."
echo ""
echo -e "${YELLOW}The REAL bounty:${NC} Handwritten Digit Recognition Dataset"
echo -e "${YELLOW}Navigate to:${NC} http://localhost:3000/consumer/bounties"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
