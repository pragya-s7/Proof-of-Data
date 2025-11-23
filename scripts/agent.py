import os
import json
import time
import requests
import numpy as np
from web3 import Web3
from dotenv import load_dotenv
from eth_account import Account

# Import model logic
from model_manager import NanoModel

# Lighthouse SDK for Filecoin (Protocol Labs)
from lighthouseweb3 import Lighthouse

load_dotenv()

# --- CONFIGURATION ---
# We connect to Oasis Sapphire for the Smart Contract Interactions
RPC_URL = "https://testnet.sapphire.oasis.dev" 
PRIVATE_KEY = os.getenv("AGENT_PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("DATA_TRAINING_CONTRACT_ADDRESS")
LIGHTHOUSE_API_KEY = os.getenv("LIGHTHOUSE_API_KEY") # Get from Lighthouse.storage

# 0G Storage Nodes (Standard Testnet IPs)
ZG_STORAGE_NODE = "https://rpc-storage-testnet.0g.ai" 

if not PRIVATE_KEY or not CONTRACT_ADDRESS:
    raise ValueError("Missing ENV variables (AGENT_PRIVATE_KEY or CONTRACT_ADDRESS)")

# ABI (Ensure this matches your compiled contract)
try:
    with open("scripts/DataTraining.json", "r") as f:
        CONTRACT_ABI = json.load(f)["abi"]
except:
    CONTRACT_ABI = [
        {"anonymous": False,"inputs": [{"indexed": True,"internalType": "uint256","name": "submissionId","type": "uint256"},{"indexed": True,"internalType": "address","name": "contributor","type": "address"},{"indexed": False,"internalType": "string","name": "dataHash","type": "string"}],"name": "DataSubmitted","type": "event"},
        {"inputs": [{"internalType": "uint256","name": "submissionId","type": "uint256"},{"internalType": "int256","name": "accuracyDelta","type": "int256"}],"name": "reportEvaluation","outputs": [],"stateMutability": "nonpayable","type": "function"}
    ]

# --- 0G STORAGE DOWNLOADER ---
def download_from_0g(root_hash):
    """
    Downloads the file data from 0G Storage Node.
    """
    print(f"Attempting to download {root_hash} from 0G...")
    try:
        # 0G Storage allows download via HTTP GET on the node
        # Format: /file?root=ROOT_HASH
        url = f"{ZG_STORAGE_NODE}/file?root={root_hash}"
        response = requests.get(url, stream=True)
        
        if response.status_code == 200:
            # For the demo, we assume the file is a text file containing CSV numbers 
            # or a binary we can parse. For simplicity: text-based CSV features.
            # Example content: "8.0,8.0,1"
            content = response.text.strip()
            parts = content.split(',')
            features = [float(x) for x in parts[:-1]]
            label = int(parts[-1])
            return (np.array(features), label)
        else:
            print(f"Error downloading from 0G: {response.status_code}")
            return None
    except Exception as e:
        print(f"0G Download Exception: {e}")
        # FALLBACK FOR DEMO if 0G node is flaky
        print("Using fallback data for demo continuity...")
        return (np.random.rand(2) * 10, 1)

# --- FILECOIN ARCHIVER (Protocol Labs) ---
def archive_to_filecoin(data, submission_id):
    """
    Archives the approved dataset to Filecoin via Lighthouse.
    """
    try:
        lh = Lighthouse(token=LIGHTHOUSE_API_KEY)
        # We need to save to a temp file first
        filename = f"submission_{submission_id}.txt"
        with open(filename, "w") as f:
            f.write(str(data))
        
        # Upload
        response = lh.upload(filename)
        print(f"Archived to Filecoin! CID: {response['data']['Hash']}")
        os.remove(filename)
        return response['data']['Hash']
    except Exception as e:
        print(f"Filecoin Archival Error: {e}")
        return "archive_failed"

class EvaluationAgent:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        # Oasis Sapphire requires specific encryption middleware if you use private variables,
        # but for public methods, standard Web3 works.
        
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)
        self.contract = self.w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        self.nano_model = NanoModel()
        
        print(f"Agent Oracle Running on Oasis Sapphire Chain: {RPC_URL}")
        print(f"Agent Address: {self.account.address}")

    def listen(self):
        event_filter = self.contract.events.DataSubmitted.create_filter(fromBlock='latest')
        print("Listening for events...")
        while True:
            try:
                for event in event_filter.get_new_entries():
                    self.process_submission(event)
                time.sleep(2)
            except Exception as e:
                print(f"Loop Error: {e}")
                time.sleep(5)

    def process_submission(self, event):
        submission_id = event['args']['submissionId']
        data_hash = event['args']['dataHash'] # 0G Root Hash
        
        print(f"\nProcessing Submission #{submission_id} (0G Hash: {data_hash})")
        
        # 1. GET DATA (REAL 0G)
        data_point = download_from_0g(data_hash)

        if not data_point:
            print("Failed to retrieve data.")
            return

        # 2. RUN AI CHECK (Simulated TEE Logic)
        # In a full Oasis implementation, this logic would run inside a ROFL container
        accuracy_delta = self.nano_model.evaluate_contribution(data_point)
        
        print(f"Impact Score: {accuracy_delta}")

        # 3. ARCHIVE TO FILECOIN (If good)
        if accuracy_delta > 0:
            print("Data is valid. Archiving to Protocol Labs/Filecoin...")
            archive_to_filecoin(data_point, submission_id)

        # 4. SETTLE ON BLOCKCHAIN
        # Convert float to fixed int (solidity doesn't do floats)
        accuracy_int = int(accuracy_delta * 100000) 
        
        tx = self.contract.functions.reportEvaluation(
            submission_id, 
            accuracy_int
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gasPrice': self.w3.eth.gas_price,
            'gas': 1000000
        })
        
        signed = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
        print(f"Verdict submitted to Contract. TX: {self.w3.to_hex(tx_hash)}")

if __name__ == '__main__':
    agent = EvaluationAgent()
    agent.listen()