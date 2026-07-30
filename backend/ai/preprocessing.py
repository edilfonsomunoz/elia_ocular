import cv2
import numpy as np
from typing import Tuple, Optional
import os


def load_image(image_path: str) -> Optional[np.ndarray]:
    """Load an image from disk using OpenCV."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")
    
    return image


def resize_image(image: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """Resize image to target size."""
    return cv2.resize(image, target_size, interpolation=cv2.INTER_AREA)


def normalize_image(image: np.ndarray) -> np.ndarray:
    """Normalize image pixel values to [0, 1]."""
    return image.astype(np.float32) / 255.0


def remove_noise(image: np.ndarray, kernel_size: int = 3) -> np.ndarray:
    """Apply Gaussian blur to remove noise."""
    return cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)


def enhance_contrast(image: np.ndarray) -> np.ndarray:
    """Enhance image contrast using CLAHE."""
    if len(image.shape) == 3:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        lab = cv2.merge([l, a, b])
        return cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    else:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        return clahe.apply(image)


def rotate_image(image: np.ndarray, angle: float) -> np.ndarray:
    """Rotate image by given angle (degrees)."""
    height, width = image.shape[:2]
    center = (width // 2, height // 2)
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
    return cv2.warpAffine(image, rotation_matrix, (width, height))


def flip_image(image: np.ndarray, direction: int = 1) -> np.ndarray:
    """Flip image. direction=1 for horizontal, 0 for vertical."""
    return cv2.flip(image, direction)


def adjust_brightness(image: np.ndarray, factor: float = 1.0) -> np.ndarray:
    """Adjust image brightness."""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hsv = hsv.astype(np.float32)
    hsv[:, :, 2] = hsv[:, :, 2] * factor
    hsv[:, :, 2] = np.clip(hsv[:, :, 2], 0, 255)
    hsv = hsv.astype(np.uint8)
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)


def zoom_image(image: np.ndarray, zoom_factor: float = 1.0) -> np.ndarray:
    """Zoom into the center of the image."""
    height, width = image.shape[:2]
    new_height = int(height * zoom_factor)
    new_width = int(width * zoom_factor)
    
    resized = cv2.resize(image, (new_width, new_height))
    
    start_y = (new_height - height) // 2
    start_x = (new_width - width) // 2
    
    return resized[start_y:start_y + height, start_x:start_x + width]


def preprocess_for_inference(image_path: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Complete preprocessing pipeline for model inference.
    
    Steps:
    1. Load image
    2. Remove noise (Gaussian blur)
    3. Enhance contrast (CLAHE)
    4. Resize to target size
    5. Normalize to [0, 1]
    
    Returns:
        Preprocessed image as numpy array with shape (1, 224, 224, 3)
    """
    image = load_image(image_path)
    
    image = remove_noise(image, kernel_size=3)
    
    image = enhance_contrast(image)
    
    image = resize_image(image, target_size)
    
    image = normalize_image(image)
    
    image = np.expand_dims(image, axis=0)
    
    return image


def preprocess_for_training(image_path: str, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """
    Preprocess image for training (same as inference but without batch dimension).
    
    Returns:
        Preprocessed image as numpy array with shape (224, 224, 3)
    """
    image = load_image(image_path)
    image = remove_noise(image, kernel_size=3)
    image = enhance_contrast(image)
    image = resize_image(image, target_size)
    image = normalize_image(image)
    return image


def augment_image(image: np.ndarray) -> dict:
    """
    Apply data augmentation to an image.
    
    Returns:
        Dictionary with augmented versions of the image.
    """
    augmented = {}
    
    augmented['original'] = image
    
    augmented['rotated_15'] = rotate_image(image, 15)
    augmented['rotated_neg15'] = rotate_image(image, -15)
    
    augmented['flipped_h'] = flip_image(image, 1)
    augmented['flipped_v'] = flip_image(image, 0)
    
    augmented['brighter'] = adjust_brightness(image, 1.3)
    augmented['darker'] = adjust_brightness(image, 0.7)
    
    augmented['zoomed'] = zoom_image(image, 1.2)
    
    return augmented


def validate_image(image_path: str) -> dict:
    """
    Validate that an image is suitable for processing.
    
    Returns:
        Dictionary with validation results.
    """
    result = {
        'valid': True,
        'errors': [],
        'warnings': [],
        'info': {}
    }
    
    if not os.path.exists(image_path):
        result['valid'] = False
        result['errors'].append(f"File not found: {image_path}")
        return result
    
    image = cv2.imread(image_path)
    if image is None:
        result['valid'] = False
        result['errors'].append(f"Could not read image file: {image_path}")
        return result
    
    height, width = image.shape[:2]
    channels = image.shape[2] if len(image.shape) == 3 else 1
    
    result['info'] = {
        'width': width,
        'height': height,
        'channels': channels,
        'file_size': os.path.getsize(image_path)
    }
    
    if width < 224 or height < 224:
        result['warnings'].append(f"Image is smaller than 224x224 ({width}x{height})")
    
    if channels not in [1, 3]:
        result['warnings'].append(f"Unexpected number of channels: {channels}")
    
    if os.path.getsize(image_path) > 10 * 1024 * 1024:
        result['warnings'].append("Image file is larger than 10MB")
    
    return result