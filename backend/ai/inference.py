import os
import numpy as np
from typing import Optional, List
from datetime import datetime

from ai.config import MODELS_DIR, CLASS_NAMES, NUM_CLASSES, IMAGE_SIZE
from ai.preprocessing import preprocess_for_inference, validate_image


class OcularInference:
    def __init__(self):
        self.model = None
        self.model_path: Optional[str] = None
        self.is_loaded = False

    def load_model(self, model_path: Optional[str] = None) -> bool:
        from tensorflow import keras

        if model_path is None:
            model_path = os.path.join(MODELS_DIR, "ocular_model.keras")
        if not os.path.exists(model_path):
            print(f"Model not found at: {model_path}")
            return False
        try:
            self.model = keras.models.load_model(model_path)
            self.model_path = model_path
            self.is_loaded = True
            print(f"Model loaded successfully from: {model_path}")
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def predict(self, image_path: str) -> dict:
        if not self.is_loaded:
            raise RuntimeError("Model not loaded. Call load_model() first.")

        validation = validate_image(image_path)
        if not validation['valid']:
            return {
                'success': False,
                'error': validation['errors'][0] if validation['errors'] else 'Invalid image',
                'disease': None,
                'probability': None,
                'level': None,
                'confidence': None,
                'all_predictions': None,
            }

        try:
            preprocessed_image = preprocess_for_inference(image_path, IMAGE_SIZE)
            predictions = self.model.predict(preprocessed_image, verbose=0)
            prediction_array = predictions[0]

            predicted_class_idx = np.argmax(prediction_array)
            predicted_class = CLASS_NAMES[predicted_class_idx]
            probability = float(prediction_array[predicted_class_idx])

            level = self._calculate_level(probability)
            confidence = self._calculate_confidence(probability)

            all_predictions = {}
            for i, class_name in enumerate(CLASS_NAMES):
                all_predictions[class_name] = {
                    'probability': float(prediction_array[i]),
                    'percentage': float(prediction_array[i] * 100),
                }

            recommendations = self._get_recommendations(predicted_class, level)

            return {
                'success': True,
                'disease': predicted_class,
                'probability': probability,
                'probability_percentage': float(probability * 100),
                'level': level,
                'confidence': confidence,
                'all_predictions': all_predictions,
                'recommendations': recommendations,
                'image_info': validation['info'],
                'timestamp': datetime.now().isoformat(),
            }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'disease': None,
                'probability': None,
                'level': None,
                'confidence': None,
                'all_predictions': None,
            }

    def predict_batch(self, image_paths: List[str]) -> List[dict]:
        return [self.predict(p) for p in image_paths]

    def _calculate_level(self, probability: float) -> str:
        if probability < 0.5:
            return "Bajo"
        elif probability < 0.75:
            return "Moderado"
        else:
            return "Alto"

    def _calculate_confidence(self, probability: float) -> str:
        if probability < 0.5:
            return "Baja"
        elif probability < 0.75:
            return "Media"
        else:
            return "Alta"

    def _get_recommendations(self, disease: str, level: str) -> str:
        recommendations = {
            "Catarata": {
                "Bajo": "Se detectan signos tempranos de catarata. Se recomienda consulta oftalmológica para evaluación completa.",
                "Moderado": "Se detectan indicios moderados de catarata. Se recomienda consultar con un oftalmólogo para evaluación y posibles opciones de tratamiento.",
                "Alto": "Se detectan signos significativos de catarata. Se recomienda consulta urgente con oftalmólogo para evaluación y plan de tratamiento.",
            },
            "Glaucoma": {
                "Bajo": "Posibles signos tempranos de glaucoma. Se recomienda medición de presión intraocular y evaluación del nervio óptico.",
                "Moderado": "Indicios moderados de glaucoma. Se recomienda evaluación urgente con oftalmólogo para pruebas adicionales.",
                "Alto": "Signos preocupantes de glaucoma. Se requiere evaluación urgente para prevenir pérdida de visión.",
            },
            "Retinopatía diabética": {
                "Bajo": "Signos tempranos de retinopatía diabética. Se recomienda control estricto de glucemia y seguimiento oftalmológico.",
                "Moderado": "Retinopatía diabética moderada. Se recomienda consulta con oftalmólogo para posibles tratamientos (láser, inyecciones).",
                "Alto": "Retinopatía diabética avanzada. Se requiere evaluación urgente para prevenir pérdida de visión severa.",
            },
            "Degeneración macular": {
                "Bajo": "Posibles signos tempranos de degeneración macular. Se recomienda suplementación nutricional y seguimiento.",
                "Moderado": "Degeneración macular moderada. Se recomienda consulta con oftalmólogo para opciones de tratamiento.",
                "Alto": "Degeneración macular avanzada. Se requiere evaluación urgente para preservar la visión central.",
            },
            "Retina sana": {
                "Bajo": "La retina aparece saludable. Se recomienda revisiones periódicas de rutina.",
                "Moderado": "La retina aparece saludable. Continúe con revisiones periódicas.",
                "Alto": "La retina aparece saludable. Mantenga hábitos saludables y revisiones regulares.",
            },
        }
        disease_recs = recommendations.get(disease, {})
        return disease_recs.get(level, "Consulte con un especialista para una evaluación completa.")

    def get_model_info(self) -> dict:
        if not self.is_loaded:
            return {'loaded': False, 'model_path': None}
        return {
            'loaded': True,
            'model_path': self.model_path,
            'input_shape': self.model.input_shape,
            'output_shape': self.model.output_shape,
            'total_params': self.model.count_params(),
            'num_classes': NUM_CLASSES,
            'class_names': CLASS_NAMES,
        }


inference_service = OcularInference()
