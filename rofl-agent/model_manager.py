import os
import pickle
import numpy as np
from sklearn.linear_model import SGDOneClassSVM

class NanoModel:
    def __init__(self, model_path="/data/model/current_model.pkl", input_dim=49152):
        self.model_path = model_path
        self.input_dim = input_dim
        
        # ONE-CLASS SVM is perfect for "Is this data normal/valid?" vs "Is this noise?"
        # We use it here to detect NOVELTY.
        # nu=0.1 means we expect some outliers, random_state for reproducibility
        self.model = SGDOneClassSVM(nu=0.1, random_state=42)
        
        self.seen_count = 0
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, 'rb') as f:
                    state = pickle.load(f)
                    self.model = state['model']
                    self.seen_count = state.get('count', 0)
                print(f"✅ Model loaded. Processed {self.seen_count} images so far.")
            except:
                self._initialize_baseline()
        else:
            self._initialize_baseline()

    def _initialize_baseline(self):
        # Initialize with random noise just to set the dimensions
        print("✨ Initializing baseline...")
        X_init = np.random.rand(5, self.input_dim)
        self.model.partial_fit(X_init)
        self.seen_count = 0
        self.save_model()

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump({'model': self.model, 'count': self.seen_count}, f)

    def evaluate_uniqueness(self, features):
        """
        Evaluates how 'novel' the image is.
        Returns a score 0.0 to 1.0 (Higher = Better/More Novel)
        """
        X_new = features.reshape(1, -1)
        
        # 1. Predict (Is this similar to what we've seen?)
        # SGDOneClassSVM returns 1 for inlier (similar), -1 for outlier (novel/different)
        # Note: In a 'Bounty' context, usually 'Inlier' means 'Matches Requirements'
        # But for 'Data Collection', usually 'Outlier' means 'New Unique Data'.
        
        # Let's assume we want DIVERSE data.
        # We fit the model on everything we see.
        
        self.model.partial_fit(X_new)
        self.seen_count += 1
        
        # We save every 10 images to avoid disk thrashing
        if self.seen_count % 10 == 0:
            self.save_model()
            
        # For this Proof of Concept, we return a high score if the image 
        # was successfully processed and added to the manifold.
        # A real system would calculate distance from the hyperplane.
        
        return 0.05 # 5% Contribution score for valid, processed images