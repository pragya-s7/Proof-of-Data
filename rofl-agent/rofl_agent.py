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

# STANDARD INPUT FOR VERIFICATION MODEL
# We normalize all inputs to this size so the model doesn't crash.
# This does NOT affect the raw data stored on 0G, only the verification check.
TARGET_SIZE = (128, 128) 

if not CONTRACT_ADDRESS:
    raise ValueError("Missing CONTRACT_ADDRESS")

CONTRACT_ABI = [
    {"anonymous":False,"inputs":[{"indexed":True,"name":"submissionId","type":"uint256"},{"indexed":True,"name":"contributor","type":"address"},{"indexed":False,"name":"dataHash","type":"string"}],"name":"DataSubmitted","type":"event"},
    {"inputs":[{"name":"submissionId","type":"uint256"},{"name":"accuracyDelta","type":"int256"}],"name":"reportEvaluation","outputs":[],"stateMutability":"nonpayable","type":"function"}
]

w3 = Web3(Web3.HTTPProvider(RPC_URL))

def process_any_image(image_bytes):
    """
    Robust pipeline to handle ANY image size or format.
    Returns a normalized feature vector.
    """
    try:
        # 1. Load from bytes (Handle potential truncation errors)
        img = Image.open(io.BytesIO(image_bytes))
        img.load() # Force load pixel data
        
        # 2. Standardize Color: Convert to RGB (3 channels)
        # This handles Grayscale, CMYK, and RGBA (transparency) inputs automatically
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # 3. Standardize Size: Resize to fixed verification target (128x128)
        # Uses LANCZOS resampling for high quality downscaling
        img = img.resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        
        # 4. Normalize Pixel Values (0-255 -> 0.0-1.0)
        img_array = np.array(img).astype(np.float32) / 255.0
        
        # 5. Flatten to 1D Array (128*128*3 = 49,152 features)
        flat_features = img_array.flatten()
        
        # 6. Basic Quality Check: Reject empty/black images
        if np.mean(flat_features) < 0.01: # Image is basically black
            print("⚠️ Rejected: Image is too dark/empty")
            return None
            
        return flat_features

    except UnidentifiedImageError:
        print("❌ Error: File is not a valid image.")
        return None
    except Exception as e:
        print(f"❌ Processing Error: {e}")
        return None

def download_from_0g(root_hash):
    try:
        url = f"{ZG_STORAGE_NODE}/file?root={root_hash}"
        print(f"📥 Fetching: {url}")
        
        # Stream=True allows us to check headers before downloading massive files
        with requests.get(url, stream=True, timeout=30) as r:
            r.raise_for_status()
            
            # Limit download size to prevent memory crash in TEE (e.g., 50MB limit)
            content = io.BytesIO()
            for chunk in r.iter_content(chunk_size=8192):
                content.write(chunk)
                if content.tell() > 50 * 1024 * 1024: 
                    print("❌ File too large for TEE verification")
                    return None
            
            return process_any_image(content.getvalue())

    except Exception as e:
        print(f"❌ 0G Download Error: {e}")
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
        
        # Initialize model tailored to our standard size
        input_dim = TARGET_SIZE[0] * TARGET_SIZE[1] * 3 # 128*128*3
        self.nano_model = NanoModel(model_path=MODEL_PATH, input_dim=input_dim)
        
        # Init Key
        try: session.post(f"{ROFL_SOCKET}/rofl/v1/keys/generate", json={"key_id": "default", "kind": "secp256k1"})
        except: pass
        print("🚀 Universal Image Agent Initialized.")

    def listen(self):
        print("🎧 Listening for DataSubmitted events...")
        
        # Create a filter starting from the latest block
        # This is the standard Web3.py pattern for polling
        event_filter = self.contract.events.DataSubmitted.create_filter(fromBlock='latest')
        
        while True:
            try:
                # Poll for new events
                new_entries = event_filter.get_new_entries()
                
                for event in new_entries:
                    self.process(event)
                
                time.sleep(5)
            except Exception as e:
                print(f"⚠️ Loop Error: {e}")
                # Re-create filter if it crashes (e.g. connection reset)
                try:
                    time.sleep(5)
                    event_filter = self.contract.events.DataSubmitted.create_filter(fromBlock='latest')
                except:
                    pass

    def process(self, event):
        sub_id = event['args']['submissionId']
        data_hash = event['args']['dataHash']
        
        print(f"\n--- Processing #{sub_id} ---")
        
        # 1. Download & Normalize
        features = download_from_0g(data_hash)
        if features is None: return

        # 2. Evaluate (Outlier Detection / Uniqueness)
        # Since we don't have labels, we check if this data is "useful" (novel) or "garbage"
        score = self.nano_model.evaluate_uniqueness(features)
        print(f"📊 Uniqueness Score: {score:.5f}")

        # 3. Submit
        tx_data = self.contract.functions.reportEvaluation(sub_id, int(score * 100000)).build_transaction({'gas': 2000000, 'gasPrice': w3.eth.gas_price})
        sign_and_send({'to': CONTRACT_ADDRESS, 'data': Web3.to_bytes(hexstr=tx_data['data'])})

if __name__ == "__main__":
    time.sleep(2)
    agent = RoflAgent()
    agent.listen()