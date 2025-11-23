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
        self.model = SGDClassifier(loss='log_loss', max_iter=1000, tol=1e-3, random_state=42)
        
        if os.path.exists(self.model_path):
            print(f"Loading existing model from {self.model_path}...")
            with open(self.model_path, 'rb') as f:
                saved_state = pickle.load(f)
                self.model = saved_state['model']
                self._validation_set = saved_state['validation_set']
        else:
            print("No saved model found. Initializing new baseline...")
            self._initialize_baseline()
            self.save_model()

    def _initialize_baseline(self):
        X, y = make_classification(
            n_samples=100, 
            n_features=self.input_dim, 
            n_informative=10, 
            n_redundant=0, 
            n_classes=2, 
            random_state=42
        )
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
        self._validation_set = (X_val, y_val)
        self.model.fit(X_train, y_train)

    def get_accuracy(self):
        X_val, y_val = self._validation_set
        return self.model.score(X_val, y_val)

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        state = {
            'model': self.model,
            'validation_set': self._validation_set
        }
        with open(self.model_path, 'wb') as f:
            pickle.dump(state, f)
        print("Model state saved.")

    def evaluate_contribution(self, new_data_point):
        features, label = new_data_point
        features_reshaped = features.reshape(1, -1)
        label_reshaped = np.array([label])

        accuracy_before = self.get_accuracy()
        self.model.partial_fit(features_reshaped, label_reshaped, classes=np.array([0, 1]))
        accuracy_after = self.get_accuracy()
        
        accuracy_delta = accuracy_after - accuracy_before
        
        if accuracy_delta > 0:
            self.save_model() 
            
        return accuracy_delta
