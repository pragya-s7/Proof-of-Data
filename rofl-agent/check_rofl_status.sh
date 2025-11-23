#!/bin/bash

# ROFL Agent Status Checker

echo "========================================="
echo "  ROFL Agent Status Check"
echo "========================================="
echo ""

# Check if rofl CLI is installed
if ! command -v rofl &> /dev/null; then
    echo "⚠️  Oasis ROFL CLI not found"
    echo ""
    echo "Install with:"
    echo "  curl -Lo rofl https://github.com/oasisprotocol/cli/releases/download/v0.8.0/rofl"
    echo "  chmod +x rofl"
    echo "  sudo mv rofl /usr/local/bin/"
    echo ""
    exit 1
fi

# Check ROFL status
echo "Checking ROFL app status..."
rofl status 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ ROFL agent is configured"
    echo ""
    echo "To deploy (if not already deployed):"
    echo "  cd rofl-agent"
    echo "  rofl build"
    echo "  rofl deploy"
    echo ""
    echo "To view logs:"
    echo "  rofl logs"
else
    echo ""
    echo "⚠️  ROFL agent not deployed yet"
    echo ""
    echo "To deploy:"
    echo "  cd rofl-agent"
    echo "  docker build -t docker.io/pragya7/detrain-agent:v6 --platform linux/amd64 ."
    echo "  docker push docker.io/pragya7/detrain-agent:v6"
    echo "  rofl build"
    echo "  rofl deploy"
fi
