from web3 import Web3
from eth_account import Account
import json
import os

# Connect to Oasis
w3 = Web3(Web3.HTTPProvider("https://testnet.sapphire.oasis.dev"))
account = Account.from_key(os.getenv("PRIVATE_KEY"))

def deploy():
    # 1. DEPLOY MOCK USDC
    # Load MockUSDC compiled JSON...
    # usdc_address = ...
    print(f"Mock USDC deployed at: {usdc_address}")

    # 2. DEPLOY DATA TRAINING
    # Load DataTraining compiled JSON...
    DataTraining = w3.eth.contract(abi=..., bytecode=...)
    tx = DataTraining.constructor(
        usdc_address,       # Reward Token
        account.address,    # Agent (Self)
        account.address     # Owner
    ).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
    })
    # Sign and Send...
    print(f"DataTraining deployed at: {contract_address}")

deploy()