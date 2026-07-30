import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
TRAINING_DATA_DIR = os.path.join(BASE_DIR, "training_data")

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 30
LEARNING_RATE = 0.001
NUM_CLASSES = 5

CLASS_NAMES = [
    "Catarata",
    "Glaucoma",
    "Retinopatía diabética",
    "Degeneración macular",
    "Retina sana",
]

IMAGE_TYPES = ["retina", "fondo_de_ojo", "oct", "iris", "conjuntiva", "Catarata", "Glaucoma", "Retinopatía diabética", "Degeneración macular", "Retina sana"]

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(TRAINING_DATA_DIR, exist_ok=True)