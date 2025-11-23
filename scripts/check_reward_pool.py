import json
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# --- CONFIGURATION ---
RPC_URL = "https://testnet.sapphire.oasis.dev"
DEPLOYED_ADDRESSES_PATH = "backend/deployed-addresses.json"
ARTIFACTS_PATH = "backend/artifacts/contracts"

def get_contract_artifact(name):
    artifact_path = os.path.join(ARTIFACTS_PATH, f"{name}.sol", f"{name}.json")
    with open(artifact_path, 'r') as f:
        return json.load(f)

def check_reward_pool():
    with open(DEPLOYED_ADDRESSES_PATH, 'r') as f:
        deployed_addresses = json.load(f)

    datatrain_address = deployed_addresses['DataTraining']

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    
    datatrain_artifact = get_contract_artifact("DataTraining")
    datatrain_contract = w3.eth.contract(address=datatrain_address, abi=datatrain_artifact['abi'])
    
    reward_pool = datatrain_contract.functions.rewardPool().call()
    
    print(f"Reward Pool Balance: {w3.from_wei(reward_pool, 'ether')} MockUSDC")

if __name__ == "__main__":
    check_reward_pool()
