from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, ConfigDict


class DiseaseClassResponse(BaseModel):
    id: int
    name: str
    plant: str
    disease: str
    description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class DistributionItem(BaseModel):
    label: str
    count: int


class TrainingEpoch(BaseModel):
    epoch: int
    loss: float
    accuracy: float
    val_loss: float
    val_accuracy: float
    auc: Optional[float] = None
    val_auc: Optional[float] = None


class ClassificationMetric(BaseModel):
    class_name: str
    precision: float
    recall: float
    f1_score: float
    support: int


class OverviewResponse(BaseModel):
    total_images: int
    total_classes: int
    train_count: int
    val_count: int
    test_count: int
    best_accuracy: float
    best_val_accuracy: float
    best_loss: float
    best_val_loss: float
    total_params: str
    model_architecture: str
    status: str


class DistributionResponse(BaseModel):
    items: List[DistributionItem]
    total: int


class TrainingResponse(BaseModel):
    history: List[TrainingEpoch]
    total_epochs: int
    early_stopping: bool
    best_epoch: int
    final_train_accuracy: float
    final_val_accuracy: float
    final_train_loss: float
    final_val_loss: float


class EvaluationResponse(BaseModel):
    test_loss: float
    test_accuracy: float
    test_auc: float


class ConfusionMatrixResponse(BaseModel):
    matrix: List[List[int]]
    class_names: List[str]


class ClassificationReportResponse(BaseModel):
    metrics: List[ClassificationMetric]
    accuracy: float
    macro_avg: dict
    weighted_avg: dict


class PredictionItem(BaseModel):
    image_id: int
    actual_label: str
    predicted_label: str
    confidence: float
    correct: bool


class PredictionsResponse(BaseModel):
    predictions: List[PredictionItem]
    total: int
    correct: int
    incorrect: int
    accuracy: float


class SessionCreate(BaseModel):
    session_name: str
    total_images: int
    num_classes: int
    train_split: int = 80
    val_split: int = 10
    test_split: int = 10
    image_size: str = "224x224"
    metrics: Optional[dict] = None
    training_history: Optional[dict] = None
    confusion_matrix: Optional[dict] = None
    classification_report: Optional[dict] = None
    predictions: Optional[dict] = None


class SessionResponse(BaseModel):
    id: int
    session_name: str
    total_images: int
    num_classes: int
    status: str
    image_size: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
