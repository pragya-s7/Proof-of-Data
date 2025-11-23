import pickle
import os

class NanoModel:
    def __init__(self, model_path="current_model.pkl"):
        self.model_path = model_path
        self.model = SGDClassifier(loss='log_loss', max_iter=1000, tol=1e-3, random_state=42)
        
        # TRY TO LOAD EXISTING MODEL
        if os.path.exists(self.model_path):
            print(f"Loading existing model from {self.model_path}...")
            with open(self.model_path, 'rb') as f:
                saved_state = pickle.load(f)
                self.model = saved_state['model']
                self._baseline_accuracy = saved_state['accuracy']
        else:
            print("No saved model found. Initializing new baseline...")
            self._initialize_baseline()
            self.save_model()

    def save_model(self):
        """Persist model to disk"""
        state = {
            'model': self.model,
            'accuracy': self.get_accuracy()
        }
        with open(self.model_path, 'wb') as f:
            pickle.dump(state, f)
        print("Model state saved.")

    def evaluate_contribution(self, new_data_point):
        # ... existing logic ...
        
        # IF POSITIVE IMPACT, SAVE THE NEW STATE
        if accuracy_delta > 0:
            self.save_model() 
            
        return accuracy_delta