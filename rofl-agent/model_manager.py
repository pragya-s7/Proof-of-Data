import os
import pickle
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

class NanoModel:
    def __init__(self, model_path="/data/model/current_model.pkl", input_dim=49152):
        self.model_path = model_path
        self.input_dim = input_dim
        self.seen_hashes = set()

        if os.path.exists(self.model_path):
            print(f"Loading existing model from {self.model_path}...")
            with open(self.model_path, 'rb') as f:
                saved_state = pickle.load(f)
                self.seen_hashes = saved_state.get('seen_hashes', set())
        else:
            print("No saved model found. Initializing new baseline...")
            self.save_model()

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        state = {
            'seen_hashes': self.seen_hashes
        }
        with open(self.model_path, 'wb') as f:
            pickle.dump(state, f)
        print("Model state saved.")

    def evaluate_uniqueness(self, features):
        """
        Evaluate if the data is unique (not seen before).
        Returns a score between 0 and 1.
        1.0 = completely unique (good)
        0.0 = duplicate or low quality (bad)
        """
        # Hash the features to check for duplicates
        feature_hash = hash(features.tobytes())

        if feature_hash in self.seen_hashes:
            print("⚠️ Duplicate submission detected")
            return 0.0

        # Check if image is not too dark or too bright
        mean_val = np.mean(features)
        if mean_val < 0.05 or mean_val > 0.95:
            print("⚠️ Low quality image (too dark/bright)")
            return 0.1

        # Check variance (blurry images have low variance)
        variance = np.var(features)
        if variance < 0.01:
            print("⚠️ Low variance image (possibly blurry)")
            return 0.2

        # Image passes all checks - mark as unique and valuable
        self.seen_hashes.add(feature_hash)
        self.save_model()

        # Return a positive score
        return 0.5 + min(variance, 0.5)  # Score between 0.5 and 1.0
