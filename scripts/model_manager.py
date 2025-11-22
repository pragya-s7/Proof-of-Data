import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
import joblib
import os

class NanoModel:
    def __init__(self):
        # Using SGDClassifier because it supports partial_fit (incremental learning)
        self.model = SGDClassifier(loss='log_loss', max_iter=1000, tol=1e-3)
        self.is_initialized = False
        self.validation_X = None
        self.validation_y = None

    def initialize_mock(self):
        """Initialize with some dummy data to simulate a pre-trained model"""
        iris = load_iris()
        X, y = iris.data, iris.target
        
        # Split: We keep a validation set to measure improvement
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.validation_X = X_val
        self.validation_y = y_val
        
        # Initial training
        self.model.partial_fit(X_train, y_train, classes=np.unique(y))
        self.is_initialized = True
        
        print(f"Model initialized. Baseline Accuracy: {self.model.score(self.validation_X, self.validation_y):.4f}")

    def evaluate_contribution(self, new_data_X, new_data_y):
        """
        1. Measure current accuracy
        2. Train on new data point
        3. Measure new accuracy
        4. Return delta
        """
        if not self.is_initialized:
            self.initialize_mock()

        # Step 1: Baseline
        score_a = self.model.score(self.validation_X, self.validation_y)

        # Step 2: Train (Incremental)
        # Note: In real life, we'd handle classes carefully
        self.model.partial_fit([new_data_X], [new_data_y])

        # Step 3: New Score
        score_b = self.model.score(self.validation_X, self.validation_y)

        delta = score_b - score_a
        return delta

# Test run
if __name__ == "__main__":
    manager = NanoModel()
    manager.initialize_mock()
    
    # Simulate a user submitting good data (from the validation set itself, cheating but works for test)
    # In reality, this would be new data
    dummy_data = manager.validation_X[0]
    dummy_label = manager.validation_y[0]
    
    impact = manager.evaluate_contribution(dummy_data, dummy_label)
    print(f"User Contribution Impact: {impact}")
