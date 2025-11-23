from web3 import Web3
from eth_account import Account
import json
import os
import subprocess
import bech32
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
RPC_URL = "https://testnet.sapphire.oasis.dev"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
ROFL_APP_ID_BECH32 = "rofl1qrsy2g0r2xx5rzhhzqmwsz4jmsws387sagr3t5at"
ARTIFACTS_PATH = "backend/artifacts/contracts"
DEPLOYED_ADDRESSES_PATH = "backend/deployed-addresses.json"

def get_contract_factory(w3, name):
    artifact_path = os.path.join(ARTIFACTS_PATH, f"{name}.sol", f"{name}.json")
    with open(artifact_path, 'r') as f:
        artifact = json.load(f)
    return w3.eth.contract(abi=artifact['abi'], bytecode=artifact['bytecode'])

def deploy():
    print(f"DEBUG: PRIVATE_KEY is {PRIVATE_KEY}")
    if not PRIVATE_KEY:
        raise ValueError("PRIVATE_KEY not found in environment variables")

    # --- COMPILE CONTRACTS ---
    print("Compiling contracts...")
    subprocess.run("npx hardhat compile", shell=True, check=True, cwd="backend")
    print("✅ Contracts compiled successfully")

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    account = Account.from_key(PRIVATE_KEY)

    # Get a reasonable gas price for the testnet
    gas_price = w3.eth.gas_price

    # --- DEPLOY MockUSDC ---
    print("Deploying MockUSDC...")
    MockUSDC = get_contract_factory(w3, "MockUSDC")
    tx = MockUSDC.constructor().build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gasPrice': gas_price,
        'gas': 2000000, # A reasonable gas limit for deployment
    })
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    usdc_address = tx_receipt['contractAddress']
    print(f"✅ MockUSDC deployed at: {usdc_address}")

    # --- DEPLOY DataTraining ---
    print("Deploying DataTraining...")
    hrp, data = bech32.bech32_decode(ROFL_APP_ID_BECH32)
    rofl_app_id_bytes_list = bech32.convertbits(data, 5, 8)
    rofl_app_id_bytes = bytes(rofl_app_id_bytes_list)[1:] # Truncate the first byte to make it 21 bytes long
    print(f"DEBUG: rofl_app_id_bytes: {rofl_app_id_bytes} (length: {len(rofl_app_id_bytes)})")

    DataTraining = get_contract_factory(w3, "DataTraining")
    tx = DataTraining.constructor(
        usdc_address,       # Reward Token
        rofl_app_id_bytes,  # Agent (ROFL App ID)
        account.address     # Owner
    ).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gasPrice': gas_price,
        'gas': 2000000, # A reasonable gas limit for deployment
    })
    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    datatrain_address = tx_receipt['contractAddress']
    print(f"✅ DataTraining deployed at: {datatrain_address}")

    # --- SAVE ADDRESSES ---
    deployed_addresses = {
        "network": "sapphire-testnet",
        "DataTraining": datatrain_address,
        "MockUSDC": usdc_address
    }
    with open(DEPLOYED_ADDRESSES_PATH, 'w') as f:
        json.dump(deployed_addresses, f, indent=2)
    print(f"✅ Deployed addresses saved to {DEPLOYED_ADDRESSES_PATH}")

if __name__ == "__main__":
    deploy()