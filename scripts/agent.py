import time
# import web3 # Would need web3.py installed
from model_manager import NanoModel

# Mocking Web3 for the hackathon demo script
class MockContract:
    def reportEvaluation(self, sub_id, impact):
        print(f"--- [Blockchain TX] Calling DataTraining.reportEvaluation ---")
        print(f"Submission ID: {sub_id}")
        print(f"Impact Score: {impact}")
        print(f"Status: {'PAYOUT TRIGGERED' if impact > 0 else 'REJECTED'}")
        print("-----------------------------------------------------------")

def run_agent():
    print("Starting DeTrain Agent Node...")
    
    # 1. Load Model
    ai_manager = NanoModel()
    ai_manager.initialize_mock()
    
    contract = MockContract()
    
    print("Listening for DataSubmitted events on chain...")
    
    # Mock Event Loop
    events = [
        {"id": 101, "data": [5.1, 3.5, 1.4, 0.2], "label": 0}, # Setosa
        {"id": 102, "data": [10.0, 10.0, 10.0, 10.0], "label": 0}, # Garbage data
    ]
    
    for event in events:
        time.sleep(2)
        print(f"\nNew Submission detected: ID {event['id']}")
        
        # 2. Run Evaluation
        impact = ai_manager.evaluate_contribution(event['data'], event['label'])
        print(f"Calculated Impact: {impact:.5f}")
        
        # 3. Report to Chain
        contract.reportEvaluation(event['id'], impact)

if __name__ == "__main__":
    run_agent()
