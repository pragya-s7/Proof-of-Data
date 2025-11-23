import json
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
RPC_URL = "https://testnet.sapphire.oasis.dev"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
DEPLOYED_ADDRESSES_PATH = "backend/deployed-addresses.json"
ARTIFACTS_PATH = "backend/artifacts/contracts"

def get_contract_artifact(name):
    artifact_path = os.path.join(ARTIFACTS_PATH, f"{name}.sol", f"{name}.json")
    with open(artifact_path, 'r') as f:
        return json.load(f)

def mint_musdc():
    if not PRIVATE_KEY:
        raise ValueError("PRIVATE_KEY not found in environment variables")

    with open(DEPLOYED_ADDRESSES_PATH, 'r') as f:
        deployed_addresses = json.load(f)

    musdc_address = deployed_addresses['MockUSDC']

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    account = Account.from_key(PRIVATE_KEY)
    
    musdc_artifact = get_contract_artifact("MockUSDC")
    musdc_contract = w3.eth.contract(address=musdc_address, abi=musdc_artifact['abi'])
    
    amount_to_mint = w3.to_wei(1000, 'mwei') # Mint 1000 mUSDC (6 decimals)

    print(f"Minting {w3.from_wei(amount_to_mint, 'ether')} mUSDC to {account.address}...")

    tx = musdc_contract.functions.mint(account.address, amount_to_mint).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gasPrice': w3.eth.gas_price,
        'gas': 200000,
    })
    
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    print(f"✅ Mint transaction successful: {tx_receipt.transactionHash.hex()}")

if __name__ == "__main__":
    mint_musdc()
