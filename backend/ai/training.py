import os
import json
import numpy as np
from typing import Optional, Tuple, List
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.utils.class_weight import compute_class_weight

from ai.config import (
    MODELS_DIR, IMAGE_SIZE, BATCH_SIZE, EPOCHS, LEARNING_RATE,
    NUM_CLASSES, CLASS_NAMES, TRAINING_DATA_DIR
)
from ai.preprocessing import preprocess_for_training


class OcularDataset:
    def __init__(self, data_dir: str):
        self.data_dir = data_dir
        self.images = []
        self.labels = []
        self.label_encoder = LabelEncoder()

    def load_from_directory(self) -> dict:
        class_counts = {}
        for class_name in CLASS_NAMES:
            class_dir = os.path.join(self.data_dir, class_name)
            if not os.path.exists(class_dir):
                continue
            class_counts[class_name] = 0
            for filename in os.listdir(class_dir):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')):
                    image_path = os.path.join(class_dir, filename)
                    try:
                        image = preprocess_for_training(image_path)
                        self.images.append(image)
                        self.labels.append(class_name)
                        class_counts[class_name] += 1
                    except Exception as e:
                        print(f"Warning: Could not load {image_path}: {e}")
        self.images = np.array(self.images)
        self.labels = np.array(self.labels)
        return class_counts

    def prepare(self, test_size: float = 0.2, val_size: float = 0.1) -> dict:
        from tensorflow import keras
        self.label_encoder.fit(self.labels)
        encoded_labels = self.label_encoder.transform(self.labels)
        one_hot_labels = keras.utils.to_categorical(encoded_labels, num_classes=NUM_CLASSES)
        X_train, X_test, y_train, y_test = train_test_split(
            self.images, one_hot_labels, test_size=test_size, random_state=42, stratify=encoded_labels
        )
        X_train, X_val, y_train, y_val = train_test_split(
            X_train, y_train, test_size=val_size, random_state=42
        )
        return {
            'X_train': X_train,
            'y_train': y_train,
            'X_val': X_val,
            'y_val': y_val,
            'X_test': X_test,
            'y_test': y_test,
            'num_samples': len(self.images),
            'num_classes': NUM_CLASSES,
            'class_names': self.label_encoder.classes_.tolist(),
        }

    def get_class_weights(self) -> dict:
        encoded_labels = self.label_encoder.transform(self.labels)
        weights = compute_class_weight('balanced', classes=np.unique(encoded_labels), y=encoded_labels)
        return dict(enumerate(weights))


class TrainingHistory:
    def __init__(self):
        self.history = {
            'epochs': [],
            'train_loss': [],
            'train_accuracy': [],
            'val_loss': [],
            'val_accuracy': [],
        }
        self.metrics = {}
        self.confusion_matrix = None
        self.classification_report = None

    def add_epoch(self, epoch: int, logs: dict):
        self.history['epochs'].append(epoch)
        self.history['train_loss'].append(float(logs.get('loss', 0)))
        self.history['train_accuracy'].append(float(logs.get('accuracy', 0)))
        self.history['val_loss'].append(float(logs.get('val_loss', 0)))
        self.history['val_accuracy'].append(float(logs.get('val_accuracy', 0)))

    def set_metrics(self, test_loss: float, test_accuracy: float):
        self.metrics = {
            'test_loss': test_loss,
            'test_accuracy': test_accuracy,
            'best_epoch': self.history['epochs'][np.argmin(self.history['val_loss'])],
            'total_epochs': len(self.history['epochs']),
        }

    def to_dict(self) -> dict:
        return {
            'history': self.history,
            'metrics': self.metrics,
            'confusion_matrix': self.confusion_matrix,
            'classification_report': self.classification_report,
        }


class OcularTrainer:
    def __init__(self):
        self.model = None
        self.dataset = None
        self.history = TrainingHistory()
        self.is_training = False
        self.training_progress = 0

    def load_dataset(self, data_dir: str) -> dict:
        self.dataset = OcularDataset(data_dir)
        class_counts = self.dataset.load_from_directory()
        return class_counts

    def prepare_data(self, test_size: float = 0.2, val_size: float = 0.1) -> dict:
        return self.dataset.prepare(test_size, val_size)

    def build_model(self, learning_rate: float = LEARNING_RATE):
        from ai.model import build_efficientnet_b0
        self.model = build_efficientnet_b0(
            num_classes=NUM_CLASSES,
            input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3),
            learning_rate=learning_rate
        )
        return self.model

    def train(
        self,
        data: dict,
        epochs: int = EPOCHS,
        batch_size: int = BATCH_SIZE,
        model_name: str = "ocular_model"
    ) -> dict:
        import tensorflow as tf
        from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
        from ai.model import save_model, get_model_info

        if self.model is None:
            self.build_model()

        self.is_training = True
        self.history = TrainingHistory()

        callbacks = [
            EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True, verbose=1),
            ModelCheckpoint(
                os.path.join(MODELS_DIR, f"{model_name}_best.keras"),
                monitor='val_accuracy', save_best_only=True, verbose=1
            ),
            ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-7, verbose=1),
        ]

        class_weights = self.dataset.get_class_weights()

        print(f"\nStarting training...")
        print(f"Training samples: {len(data['X_train'])}")
        print(f"Validation samples: {len(data['X_val'])}")
        print(f"Test samples: {len(data['X_test'])}")
        print(f"Number of classes: {NUM_CLASSES}")
        print(f"Class names: {CLASS_NAMES}")
        print(f"Epochs: {epochs}")
        print(f"Batch size: {batch_size}")
        print(f"Class weights: {class_weights}\n")

        training_history = self.model.fit(
            data['X_train'],
            data['y_train'],
            batch_size=batch_size,
            epochs=epochs,
            validation_data=(data['X_val'], data['y_val']),
            callbacks=callbacks,
            class_weight=class_weights,
            verbose=1
        )

        for i in range(len(training_history.history.get('loss', []))):
            self.history.add_epoch(i + 1, {
                'loss': training_history.history['loss'][i],
                'accuracy': training_history.history['accuracy'][i],
                'val_loss': training_history.history['val_loss'][i],
                'val_accuracy': training_history.history['val_accuracy'][i],
            })

        test_loss, test_accuracy = self.model.evaluate(data['X_test'], data['y_test'], verbose=0)
        self.history.set_metrics(test_loss, test_accuracy)

        model_path = os.path.join(MODELS_DIR, f"{model_name}.keras")
        save_model(self.model, model_path)
        model_info = get_model_info(self.model)

        predictions = self.model.predict(data['X_test'])
        y_pred = np.argmax(predictions, axis=1)
        y_true = np.argmax(data['y_test'], axis=1)

        from sklearn.metrics import confusion_matrix, classification_report
        cm = confusion_matrix(y_true, y_pred)
        cr = classification_report(y_true, y_pred, target_names=CLASS_NAMES, output_dict=True)

        self.history.confusion_matrix = cm.tolist()
        self.history.classification_report = cr
        self.is_training = False

        results = {
            'model_path': model_path,
            'model_info': model_info,
            'training_history': self.history.to_dict(),
            'test_loss': test_loss,
            'test_accuracy': test_accuracy,
            'confusion_matrix': cm.tolist(),
            'classification_report': cr,
        }

        results_path = os.path.join(MODELS_DIR, f"{model_name}_results.json")
        with open(results_path, 'w') as f:
            json.dump(results, f, indent=2, default=str)

        print(f"\nTraining complete!")
        print(f"Test Loss: {test_loss:.4f}")
        print(f"Test Accuracy: {test_accuracy:.4f}")
        print(f"Model saved to: {model_path}")
        print(f"Results saved to: {results_path}")

        return results

    def get_status(self) -> dict:
        return {
            'is_training': self.is_training,
            'training_progress': self.training_progress,
            'has_model': self.model is not None,
        }


trainer = OcularTrainer()
