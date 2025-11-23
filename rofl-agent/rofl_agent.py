import os
import time
import io
import requests
import requests_unixsocket
import numpy as np
from web3 import Web3
from PIL import Image, UnidentifiedImageError
from model_manager import NanoModel

# --- CONFIGURATION ---
ROFL_SOCKET = "http+unix://%2Frun%2Frofl-appd.sock"
session = requests_unixsocket.Session()

RPC_URL = "https://testnet.sapphire.oasis.dev"
ZG_STORAGE_NODE = "https://rpc-storage-testnet.0g.ai"
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
MODEL_PATH = "/data/model/current_model.pkl"
TARGET_SIZE = (224, 224) # Increased target size for better feature extraction

if not CONTRACT_ADDRESS:
    print("⚠️  WARNING: CONTRACT_ADDRESS not found in env, using placeholder")
    CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"

CONTRACT_ABI = [
    {"anonymous":False,"inputs":[{"indexed":True,"name":"submissionId","type":"uint256"},{"indexed":True,"name":"contributor","type":"address"},{"indexed":False,"name":"dataHash","type":"string"}],"name":"DataSubmitted","type":"event"},
    {"inputs":[{"name":"submissionId","type":"uint256"},{"name":"accuracyDelta","type":"int256"}],"name":"reportEvaluation","outputs":[],"stateMutability":"nonpayable","type":"function"}
]

w3 = Web3(Web3.HTTPProvider(RPC_URL))

def process_any_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.load()
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        img_array = np.array(img).astype(np.float32) / 255.0
        flat_features = img_array.flatten()
        if np.mean(flat_features) < 0.01:
            return None, None
        # TODO: This is a placeholder label. The actual label should be extracted from the image or provided in the data.
        label = 1 
        return flat_features, label
    except Exception as e:
        print(f"❌ Processing Error: {e}")
        return None, None

def download_from_0g(root_hash):
    try:
        url = f"{ZG_STORAGE_NODE}/file?root={root_hash}"
        print(f"📥 Fetching: {url}")
        with requests.get(url, stream=True, timeout=30) as r:
            r.raise_for_status()
            content = io.BytesIO()
            for chunk in r.iter_content(chunk_size=8192):
                content.write(chunk)
                if content.tell() > 50 * 1024 * 1024: 
                    print("❌ File too large")
                    return None
            features, _ = process_any_image(content.getvalue())
            return features
    except Exception as e:
        print(f"❌ 0G Error: {e}")
        return None

def sign_and_send(tx_params):
    data_hex = tx_params['data']
    if data_hex.startswith('0x'): data_hex = data_hex[2:]
    try:
        payload = { "tx": { "kind": "eth", "data": { "to": tx_params['to'], "value": 0, "data": data_hex, "gas_limit": 2000000 }}, "encrypt": True }
        resp = session.post(f"{ROFL_SOCKET}/rofl/v1/tx/sign-submit", json=payload)
        if resp.status_code == 200:
            print(f"✅ TX Submitted: {resp.json()}")
        else:
            print(f"❌ TX Failed: {resp.text}")
    except Exception as e:
        print(f"❌ ROFL Socket Error: {e}")

class RoflAgent:
    def __init__(self):
        self.contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        input_dim = TARGET_SIZE[0] * TARGET_SIZE[1] * 3
        self.nano_model = NanoModel(model_path=MODEL_PATH, input_dim=input_dim)
        try: session.post(f"{ROFL_SOCKET}/rofl/v1/keys/generate", json={"key_id": "default", "kind": "secp256k1"})
        except: pass
        print("🚀 Universal Image Agent Initialized.")

    def listen(self):
        print("🎧 Listening via Block Polling...")
        try:
            last_block = w3.eth.block_number
        except:
            last_block = 0

        while True:
            try:
                current_block = w3.eth.block_number
                if current_block > last_block:
                    events = self.contract.events.DataSubmitted.get_logs(
                        from_block=last_block + 1,
                        to_block=current_block
                    )
                    
                    for event in events:
                        self.process(event)
                    
                    last_block = current_block
                
                time.sleep(5)
            except Exception as e:
                print(f"⚠️ Polling Error: {e}")
                time.sleep(5)

    def process(self, event):
        try:
            sub_id = event['args']['submissionId']
            data_hash_with_label = event['args']['dataHash']
            print(f"\n--- Processing #{sub_id} ---")
            
            root_hash, label_str = data_hash_with_label.split('|')
            label = int(label_str)

            features, _ = download_from_0g(root_hash)
            if features is None: return
            
            accuracy_delta = self.nano_model.evaluate_contribution((features, label))
            print(f"📊 Accuracy Delta: {accuracy_delta:.5f}")
            
            tx_data = self.contract.functions.reportEvaluation(sub_id, int(accuracy_delta * 100000)).build_transaction({'gas': 2000000, 'gasPrice': w3.eth.gas_price})
            sign_and_send({'to': CONTRACT_ADDRESS, 'data': Web3.to_bytes(hexstr=tx_data['data'])})
        except Exception as e:
            print(f"❌ Processing Logic Error: {e}")

if __name__ == "__main__":
    time.sleep(2)
    agent = RoflAgent()
    agent.listen()