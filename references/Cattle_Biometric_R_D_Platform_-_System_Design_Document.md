# Cattle Biometric R&D Platform - System Design Document

**Version:** 1.0  
**Date:** 2026-01-24  
**Purpose:** Research & Product Development Platform (Not Deployment)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Principles](#architecture-principles)
4. [System Architecture](#system-architecture)
5. [Stage Specifications](#stage-specifications)
6. [Engineering Design](#engineering-design)
7. [Configuration Management](#configuration-management)
8. [Artifact Management](#artifact-management)
9. [Parallelization Strategy](#parallelization-strategy)
10. [Experiment Tracking](#experiment-tracking)
11. [Appendices](#appendices)

---

## 1. Executive Summary

### 1.1 Purpose

This document specifies the design of a **cattle biometric R&D platform** - a modular, config-driven system for researching, developing, and evaluating visual cattle identification methods. This is NOT a production deployment system; it is a research laboratory in code.

### 1.2 Core Problem

**Input:**
- Cattle images (one or more per animal)
- Cattle ID labels
- Optional metadata (quality, timestamps, location)

**Goal:**
- Extract rich feature sets (classical + deep learning)
- Enable 1:N cattle identification
- Provide deep attribution analysis (WHY matches succeed/fail)
- Generate comprehensive diagnostics and reports
- Support systematic experimentation

### 1.3 Key System Properties

- **Modular:** Each stage independently runnable
- **Config-driven:** Single YAML controls entire experiment
- **Resumable:** Crash-safe at every stage
- **Parallelizable:** CPU multiprocessing + GPU batching
- **Reproducible:** Deterministic, tracked experiments
- **Diagnostic-rich:** Extensive plots, reports, metrics at every stage

---

## 2. System Overview

### 2.1 High-Level Pipeline

```
┌──────────────┐
│  Raw Images  │
│   + Labels   │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│                   STAGE 1: INPUT & DATA MODEL             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              STAGE 2: DATA QUALITY ANALYSIS               │
│  • Blur, brightness, noise, resolution metrics            │
│  • Per-image and per-identity statistics                  │
│  • Quality reports and recommendations                    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│             STAGE 3: DATASET ORGANIZATION                 │
│  • Train/val/test splits (stratified by ID)               │
│  • Leakage detection                                      │
│  • Data selection rules                                   │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              STAGE 4: ROI EXTRACTION                      │
│  • SAM / YOLO / Hybrid / Skip                             │
│  • Mask quality scoring                                   │
│  • Fallback strategies                                    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│         STAGE 5: CLASSICAL FEATURE EXTRACTION             │
│  • Color (histograms, moments, dominant colors)           │
│  • Texture (LBP, Gabor, GLCM, wavelets)                   │
│  • Ridge/muzzle patterns (orientation, frequency, beads)  │
│  • Shape (moments, contours, curvature)                   │
│  • Edges/gradients (HOG, edge stats)                      │
│  • Frequency domain (FFT, DCT)                            │
│  • Keypoints (ORB, AKAZE)                                 │
│  • Quality metrics                                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│            STAGE 6: DEEP FEATURE EXTRACTION               │
│  • ResNet family (18/34/50/101/152/ResNeXt)               │
│  • EfficientNet (B0-B7)                                   │
│  • ConvNeXt (Tiny/Small/Base/Large/XLarge)                │
│  • Vision Transformers (ViT, DeiT, Swin)                  │
│  • Self-supervised (DINO, MAE, MoCo, SimCLR, BYOL)        │
│  • Face/biometric models (ArcFace, CosFace, FaceNet)      │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│          STAGE 7: TRAINING/FINE-TUNING (Optional)         │
│  • Self-supervised pretraining                            │
│  • Metric learning (ArcFace, SupCon, Triplet, etc.)       │
│  • Training diagnostics and checkpointing                 │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                STAGE 8: FEATURE FUSION                    │
│  • Concatenation / Weighted / Learned / Hierarchical      │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              STAGE 9: GALLERY CONSTRUCTION                │
│  • Multi-vector per cattle                                │
│  • Prototype strategies                                   │
│  • Quality-weighted templates                             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│               STAGE 10: VECTOR INDEXING                   │
│  • FAISS / Milvus indexing                                │
│  • Distance metrics (cosine, euclidean, etc.)             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              STAGE 11: QUERY & MATCHING                   │
│  • 1:N retrieval                                          │
│  • Top-K ranking                                          │
│  • Threshold policies                                     │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│            STAGE 12: FEATURE ATTRIBUTION                  │
│  • Per-feature similarity                                 │
│  • Contribution analysis                                  │
│  • Agreement/disagreement diagnostics                     │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                 STAGE 13: EVALUATION                      │
│  • Top-K accuracy, ROC, CMC, TAR@FAR                      │
│  • Failure taxonomy                                       │
│  • Statistical confidence                                 │
│  • Identity difficulty analysis                           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│               STAGE 14: VISUALIZATION                     │
│  • Quality plots, embedding plots, training curves        │
│  • Attribution heatmaps, failure galleries                │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              STAGE 15: REPORT GENERATION                  │
│  • HTML/PDF comprehensive reports                         │
│  • Executive summary + technical details                  │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│             STAGE 16: EXPERIMENT TRACKING                 │
│  • Experiment database                                    │
│  • Cross-experiment comparison                            │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Data Model

#### Core Entities

```
Cattle Entity (Identity)
├── cattle_id: str (unique identifier)
├── images: List[ImageSample]
├── metadata: Optional[Dict]
│   ├── breed: Optional[str]
│   ├── age: Optional[int]
│   ├── region: Optional[str]
│   └── custom: Dict
└── lifecycle_status: Enum[ACTIVE, SOLD, DECEASED, UNCERTAIN]

ImageSample
├── image_path: Path
├── cattle_id: str (label)
├── quality_metrics: QualityMetrics
├── roi_info: Optional[ROIInfo]
├── features: Dict[str, FeatureVector]
├── metadata: ImageMetadata
│   ├── capture_date: Optional[datetime]
│   ├── camera_id: Optional[str]
│   ├── location: Optional[str]
│   └── custom: Dict
└── split: Enum[TRAIN, VAL, TEST, EXCLUDED]

FeatureVector
├── feature_type: str (e.g., "resnet50", "lbp_texture", "color_hist")
├── vector: np.ndarray
├── dimension: int
├── extraction_params: Dict
└── extraction_metadata: ExtractionMetadata
```

---

## 3. Architecture Principles

### 3.1 Design Philosophy

**1. Modularity over Monoliths**
- Each stage is independently executable
- Clear input/output contracts
- No tight coupling between stages

**2. Configuration over Code**
- Experiments defined via YAML, not code changes
- Same codebase, infinite experimental variations

**3. Artifacts over Logs**
- Every stage produces persistent artifacts
- Logs are supplementary, artifacts are primary

**4. Reproducibility by Design**
- Deterministic execution (fixed seeds)
- Version tracking (code, data, models)
- Complete lineage preservation

**5. Fail-Safe, Not Fail-Fast**
- Graceful degradation
- Partial results are valuable
- Resume capability at every stage

### 3.2 Module Interface Contract

Every stage module must implement:

```python
class StageModule(ABC):
    """Abstract base for all pipeline stages"""
    
    @abstractmethod
    def validate_config(self, config: Dict) -> bool:
        """Validate stage-specific configuration"""
        pass
    
    @abstractmethod
    def check_prerequisites(self, run_dir: Path) -> bool:
        """Check if required inputs from previous stages exist"""
        pass
    
    @abstractmethod
    def execute(self, config: Dict, run_dir: Path) -> StageOutput:
        """Execute the stage"""
        pass
    
    @abstractmethod
    def resume(self, config: Dict, run_dir: Path) -> StageOutput:
        """Resume from checkpoint if exists"""
        pass
    
    @abstractmethod
    def generate_artifacts(self, output: StageOutput, run_dir: Path):
        """Save stage outputs to artifact directory"""
        pass
```

### 3.3 Artifact Contract

Every stage produces:

```
{run_dir}/{stage_name}/
├── outputs/
│   ├── {stage_outputs}.{pkl,npy,csv,parquet}
│   └── ...
├── checkpoints/
│   ├── checkpoint_{timestamp}.pkl
│   └── ...
├── plots/
│   ├── {plot_name}.png
│   └── ...
├── metadata/
│   ├── config.yaml (stage-specific config)
│   ├── timing.json (execution time breakdown)
│   ├── stats.json (summary statistics)
│   └── manifest.json (list of all produced artifacts)
└── logs/
    └── stage.log
```

---

## 4. System Architecture

### 4.1 Folder Structure

```
cattle_biometric_rnd/
├── configs/
│   ├── defaults/
│   │   ├── data.yaml
│   │   ├── roi.yaml
│   │   ├── features.yaml
│   │   ├── training.yaml
│   │   └── evaluation.yaml
│   ├── experiments/
│   │   ├── baseline_pretrained.yaml
│   │   ├── finetune_arcface.yaml
│   │   └── ridge_focus.yaml
│   └── schema.yaml (config validation schema)
├── src/
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py (config loading & validation)
│   │   ├── registry.py (module registry)
│   │   ├── runner.py (pipeline orchestration)
│   │   └── utils.py
│   ├── stages/
│   │   ├── __init__.py
│   │   ├── s01_input.py
│   │   ├── s02_quality_analysis.py
│   │   ├── s03_dataset_organization.py
│   │   ├── s04_roi_extraction.py
│   │   ├── s05_classical_features.py
│   │   ├── s06_deep_features.py
│   │   ├── s07_training.py
│   │   ├── s08_fusion.py
│   │   ├── s09_gallery.py
│   │   ├── s10_indexing.py
│   │   ├── s11_matching.py
│   │   ├── s12_attribution.py
│   │   ├── s13_evaluation.py
│   │   ├── s14_visualization.py
│   │   ├── s15_reporting.py
│   │   └── s16_tracking.py
│   ├── features/
│   │   ├── __init__.py
│   │   ├── classical/
│   │   │   ├── color.py
│   │   │   ├── texture.py
│   │   │   ├── ridge.py
│   │   │   ├── shape.py
│   │   │   └── ...
│   │   └── deep/
│   │       ├── resnet.py
│   │       ├── efficientnet.py
│   │       ├── vit.py
│   │       └── ...
│   ├── roi/
│   │   ├── __init__.py
│   │   ├── sam.py
│   │   ├── yolo.py
│   │   └── hybrid.py
│   ├── matching/
│   │   ├── __init__.py
│   │   ├── embedding.py
│   │   ├── classical.py
│   │   └── hybrid.py
│   ├── training/
│   │   ├── __init__.py
│   │   ├── losses.py
│   │   ├── trainers.py
│   │   └── augmentation.py
│   ├── evaluation/
│   │   ├── __init__.py
│   │   ├── metrics.py
│   │   ├── attribution.py
│   │   └── failure_analysis.py
│   ├── visualization/
│   │   ├── __init__.py
│   │   ├── quality_plots.py
│   │   ├── embedding_plots.py
│   │   ├── training_plots.py
│   │   └── attribution_plots.py
│   └── reporting/
│       ├── __init__.py
│       ├── html_generator.py
│       └── pdf_generator.py
├── runs/
│   ├── {experiment_id}/
│   │   ├── config.yaml (full resolved config)
│   │   ├── metadata.json (git hash, env, timestamp)
│   │   ├── s01_input/
│   │   ├── s02_quality_analysis/
│   │   ├── ...
│   │   └── final_report.html
│   └── ...
├── data/
│   ├── raw/
│   │   ├── images/
│   │   └── labels.csv
│   └── processed/
│       └── {dataset_version}/
├── models/
│   ├── pretrained/
│   │   ├── resnet50_imagenet.pth
│   │   └── ...
│   └── trained/
│       └── {experiment_id}/
├── experiments/
│   └── experiments.db (SQLite tracking database)
├── scripts/
│   ├── run_experiment.py
│   ├── compare_experiments.py
│   └── generate_report.py
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
│   ├── design.md (this document)
│   ├── config_guide.md
│   └── api_reference.md
├── requirements.txt
├── setup.py
└── README.md
```

### 4.2 Module Registry Pattern

```python
# Simplified registry implementation concept

class FeatureExtractorRegistry:
    """Registry for all feature extractors"""
    _extractors = {}
    
    @classmethod
    def register(cls, name: str):
        def decorator(extractor_cls):
            cls._extractors[name] = extractor_cls
            return extractor_cls
        return decorator
    
    @classmethod
    def get(cls, name: str):
        return cls._extractors.get(name)
    
    @classmethod
    def list_all(cls):
        return list(cls._extractors.keys())

# Usage in feature modules
@FeatureExtractorRegistry.register("color_histogram")
class ColorHistogramExtractor(FeatureExtractor):
    def extract(self, image: np.ndarray) -> np.ndarray:
        # Implementation
        pass

# Similar registries for:
# - ROIExtractorRegistry
# - LossRegistry
# - MatcherRegistry
# - MetricRegistry
```

---

## 5. Stage Specifications

### STAGE 1: Input & Data Model

**Purpose:** Load and validate raw data, establish data model

**Inputs:**
- Image directory or image list file
- Labels CSV: `image_path, cattle_id`
- Optional metadata CSV

**Processing:**
1. Scan image directory
2. Load labels and validate
3. Check for:
   - Missing images
   - Missing labels
   - Duplicate image paths
   - Invalid cattle IDs
4. Create internal data index
5. Compute dataset statistics

**Outputs:**
```
s01_input/
├── outputs/
│   ├── data_index.parquet (full dataset index)
│   ├── cattle_inventory.csv (unique cattle IDs)
│   └── dataset_stats.json
├── plots/
│   ├── images_per_cattle_histogram.png
│   └── data_overview.png
└── metadata/
    └── validation_report.json
```

**Configuration:**
```yaml
input:
  image_dir: "data/raw/images"
  labels_file: "data/raw/labels.csv"
  metadata_file: null
  allowed_extensions: [".jpg", ".jpeg", ".png"]
  validate_images: true
  min_images_per_cattle: 1
```

---

### STAGE 2: Data Quality Analysis

**Purpose:** Assess image quality, identify problematic samples

**Quality Metrics Computed:**

**Per-Image:**
- Blur score (Laplacian variance)
- Brightness (mean luminance)
- Contrast (std luminance)
- Noise estimate (local variance)
- Resolution (width × height)
- Aspect ratio
- File size
- Color balance
- Specular reflection detection (for muzzles)
- Edge density

**Processing:**
1. Batch process all images
2. Compute all quality metrics
3. Detect outliers
4. Flag problematic images
5. Compute per-cattle quality distributions
6. Generate recommendations

**Outputs:**
```
s02_quality_analysis/
├── outputs/
│   ├── quality_metrics.parquet (per-image metrics)
│   ├── quality_summary_by_cattle.csv
│   ├── recommended_keep.csv
│   ├── recommended_reject.csv
│   └── review_required.csv
├── plots/
│   ├── blur_distribution.png
│   ├── brightness_distribution.png
│   ├── quality_heatmap.png
│   ├── quality_vs_cattle_count.png
│   ├── best_images_grid.png
│   └── worst_images_grid.png
└── metadata/
    ├── quality_thresholds.json
    └── outlier_detection_params.json
```

**Configuration:**
```yaml
quality_analysis:
  enabled: true
  metrics:
    blur:
      method: "laplacian_variance"
      threshold: 100.0
    brightness:
      method: "mean_luminance"
      min: 30
      max: 225
    noise:
      method: "local_variance"
      threshold: 0.05
  outlier_detection:
    method: "iqr"  # or "zscore", "isolation_forest"
    factor: 1.5
  recommendations:
    auto_reject_blur_below: 50.0
    flag_brightness_outside: [30, 225]
  parallel:
    num_workers: 8
    batch_size: 100
```

**Design Decision:**
- Quality analysis is **descriptive, not prescriptive** - it provides information but does not automatically exclude data
- Final inclusion/exclusion decisions happen in Stage 3

---

### STAGE 3: Dataset Organization

**Purpose:** Create train/val/test splits, apply selection rules

**Processing:**

1. **Label Validation:**
   - Detect duplicate images (perceptual hashing)
   - Detect label noise (same image, different IDs)
   - Detect outlier identities (embedding-based, if features exist)

2. **Data Selection Rules:**
   Apply configurable filters:
   - Minimum quality thresholds
   - Maximum images per cattle (for balance)
   - Quality-based sampling

3. **Stratified Splitting:**
   - Split by cattle ID (not by image)
   - Ensure each cattle appears in only one split
   - Handle imbalanced classes (cattle with 1 vs 50 images)

4. **Leakage Prevention:**
   - Check for near-duplicates across splits
   - Verify no cattle ID overlap

**Outputs:**
```
s03_dataset_organization/
├── outputs/
│   ├── train_index.parquet
│   ├── val_index.parquet
│   ├── test_index.parquet
│   ├── excluded_index.parquet (with reasons)
│   ├── split_statistics.json
│   └── leakage_report.json
├── plots/
│   ├── split_distribution.png
│   ├── quality_by_split.png
│   └── images_per_cattle_by_split.png
└── metadata/
    ├── selection_rules.json
    └── split_config.json
```

**Configuration:**
```yaml
dataset_organization:
  enabled: true
  
  selection_rules:
    quality_filters:
      min_blur_score: 100.0
      brightness_range: [40, 220]
    sampling:
      max_images_per_cattle: null  # null = no limit
      sampling_strategy: "quality_weighted"  # or "random", "best_k"
  
  splitting:
    train_ratio: 0.7
    val_ratio: 0.15
    test_ratio: 0.15
    stratify_by: "cattle_id"
    min_images_per_split: 1
    random_seed: 42
  
  leakage_detection:
    enabled: true
    duplicate_threshold: 0.95  # perceptual hash similarity
    
  handling_single_image_cattle:
    strategy: "keep_in_test"  # or "keep_in_train", "exclude"
```

**Design Decision:**
- **Cattle-level splitting** prevents leakage (same animal in train and test)
- **Exclusion is tracked**, not deleted - can be re-evaluated
- **Reproducibility via fixed seed**

---

### STAGE 4: ROI Extraction

**Purpose:** Extract region of interest (cattle face/muzzle), remove background

**Methods Available:**

1. **No ROI (Skip)**
   - Use full image
   - Apply only to training augmentation

2. **SAM (Segment Anything Model)**
   - Generate segmentation masks
   - Select best mask via heuristics
   - Apply mask (crop or background removal)

3. **YOLO Object Detection**
   - Detect cattle bounding box
   - Crop to box
   - Optional refinement

4. **Hybrid (YOLO → SAM)**
   - YOLO provides initial box
   - SAM refines within box
   - Best of both worlds

5. **Manual Boxes (if provided)**
   - Use pre-annotated bounding boxes

**Processing:**

1. Load ROI extractor based on config
2. Process images in batches (GPU-accelerated)
3. For each image:
   - Extract ROI
   - Compute ROI quality score
   - Handle failures (fallback strategies)
4. Save ROI artifacts
5. Generate diagnostic visualizations

**ROI Quality Scoring:**
- Mask area (too small/large flags)
- Mask compactness
- Mask confidence (model-specific)
- Coverage of expected region

**Outputs:**
```
s04_roi_extraction/
├── outputs/
│   ├── roi_info.parquet (per-image ROI metadata)
│   ├── masks/ (if SAM)
│   │   ├── {image_id}_mask.png
│   │   └── ...
│   ├── crops/ (cropped images)
│   │   ├── {image_id}_crop.jpg
│   │   └── ...
│   └── roi_stats.json
├── plots/
│   ├── roi_quality_distribution.png
│   ├── extraction_success_rate.png
│   ├── before_after_grid.png (samples)
│   └── failure_examples_grid.png
└── metadata/
    ├── extractor_config.json
    └── failure_log.json
```

**Configuration:**
```yaml
roi_extraction:
  enabled: true
  method: "sam"  # or "yolo", "hybrid", "skip", "manual"
  
  sam:
    model_type: "vit_h"  # or "vit_l", "vit_b"
    checkpoint: "models/pretrained/sam_vit_h.pth"
    device: "cuda:0"
    batch_size: 4
    points_per_side: 32
    pred_iou_thresh: 0.88
    stability_score_thresh: 0.95
    mask_selection:
      strategy: "largest_central"  # or "highest_confidence", "composite"
      area_ratio_range: [0.1, 0.9]  # reject if mask is <10% or >90% of image
    postprocess:
      fill_holes: true
      morphological_closing: 5
  
  yolo:
    model: "yolov8x.pt"
    confidence_threshold: 0.5
    device: "cuda:0"
    batch_size: 32
  
  hybrid:
    yolo_config: {...}
    sam_config: {...}
    expand_box_factor: 0.1  # expand YOLO box by 10% before SAM
  
  fallback:
    enabled: true
    strategy: "center_crop"  # or "full_image"
    fallback_on_failures: true
  
  output:
    save_masks: true
    save_crops: true
    save_visualizations: true
    crop_format: "jpg"
  
  caching:
    enabled: true  # critical for reproducibility
    cache_dir: "cache/roi"
  
  parallel:
    num_workers: 2
    prefetch_factor: 2
```

**Design Decisions:**
- **Offline preprocessing** - ROI extracted once, cached forever
- **Failure handling** - graceful degradation, not crash
- **Quality scoring** - enables filtering or weighting downstream
- **Visualization-first** - always save diagnostic grids

---

### STAGE 5: Classical Feature Extraction

**Purpose:** Extract handcrafted features using image processing

**Feature Families:**

#### 5.1 Color Features
- RGB histograms (per channel, 256 bins)
- HSV histograms
- LAB histograms
- Color moments (mean, std, skewness, kurtosis per channel)
- Dominant colors (k-means, k=5)
- Color coherence vector
- Color correlogram

#### 5.2 Texture Features
- **LBP (Local Binary Patterns)**
  - Uniform LBP
  - Rotation-invariant LBP
  - Multi-scale LBP
- **Gabor Filters**
  - Multiple scales (4-6)
  - Multiple orientations (8-12)
  - Mean and std of responses
- **GLCM (Gray-Level Co-occurrence Matrix)**
  - Contrast, correlation, energy, homogeneity
  - Multiple distances and angles
- **Wavelets**
  - Haar, Daubechies
  - Multi-level decomposition
  - Statistics of coefficients
- **Laws Texture Energy**
  - L5E5, E5E5, S5S5, etc.

#### 5.3 Ridge/Muzzle Pattern Features
- **Ridge Orientation Field**
  - Local orientation at each pixel
  - Coherence and curvature
- **Ridge Frequency Map**
  - Dominant frequency per region
- **Ridge Density**
  - Ridges per unit area
- **Bead Detection**
  - LoG (Laplacian of Gaussian) blob detection
  - Bead locations and sizes
- **Ridge Topology**
  - Junction detection (bifurcations, endings)
  - Ridge skeleton graph
- **Minutiae-like Features**
  - Inspired by fingerprint features

#### 5.4 Shape Features
- Contour descriptors
- Hu moments (7 invariant moments)
- Zernike moments
- Aspect ratio, solidity, extent
- Curvature statistics

#### 5.5 Edge/Gradient Features
- HOG (Histogram of Oriented Gradients)
- Edge density and statistics
- Gradient magnitude distributions

#### 5.6 Frequency Domain Features
- FFT (Fast Fourier Transform) statistics
- DCT (Discrete Cosine Transform) coefficients
- Spectral peak analysis

#### 5.7 Keypoint Features
- ORB descriptors
- AKAZE descriptors
- Keypoint statistics (count, distribution)

#### 5.8 Quality Features
- Blur estimation
- Noise estimation
- Contrast measures
- Sharpness scores

**Processing:**

1. Load feature extractor classes from registry
2. For each enabled feature type:
   - Initialize extractor with config
   - Batch process images
   - Save feature vectors
   - Track extraction time and stats
3. Handle extraction failures gracefully

**Outputs:**
```
s05_classical_features/
├── outputs/
│   ├── color/
│   │   ├── rgb_histogram.npy (shape: [N, 768])
│   │   ├── color_moments.npy
│   │   └── ...
│   ├── texture/
│   │   ├── lbp_uniform.npy
│   │   ├── gabor_responses.npy
│   │   └── ...
│   ├── ridge/
│   │   ├── orientation_field.npy
│   │   ├── bead_features.npy
│   │   └── ...
│   ├── shape/
│   ├── edge/
│   ├── frequency/
│   ├── keypoints/
│   └── feature_manifest.json (registry of all extracted features)
├── plots/
│   ├── feature_extraction_time.png
│   ├── feature_dimension_summary.png
│   └── sample_visualizations/ (ridge orientations, beads, etc.)
└── metadata/
    ├── extractor_configs.json
    └── extraction_stats.json
```

**Configuration:**
```yaml
classical_features:
  enabled: true
  
  extractors:
    color:
      rgb_histogram:
        enabled: true
        bins: 256
      color_moments:
        enabled: true
      dominant_colors:
        enabled: true
        k: 5
    
    texture:
      lbp:
        enabled: true
        variants: ["uniform", "rotation_invariant"]
        radius: [1, 2, 3]
        points: [8, 16, 24]
      gabor:
        enabled: true
        scales: [4, 8, 16, 32]
        orientations: [0, 45, 90, 135, 180, 225, 270, 315]
      glcm:
        enabled: true
        distances: [1, 2, 4]
        angles: [0, 45, 90, 135]
    
    ridge:
      enabled: true  # Cattle muzzle-specific
      orientation_field:
        block_size: 16
        smoothing_sigma: 5
      frequency_map:
        block_size: 16
      bead_detection:
        log_sigma_range: [1.0, 5.0]
        num_sigma: 10
        threshold: 0.01
      minutiae_extraction:
        enabled: true
    
    shape:
      hu_moments:
        enabled: true
      zernike_moments:
        enabled: true
        radius: 21
    
    edge:
      hog:
        enabled: true
        orientations: 9
        pixels_per_cell: [8, 8]
        cells_per_block: [2, 2]
    
    frequency:
      fft_stats:
        enabled: true
      dct_coefficients:
        enabled: true
        num_coefficients: 64
    
    keypoints:
      orb:
        enabled: true
        nfeatures: 500
      akaze:
        enabled: true
  
  parallel:
    num_workers: 16
    batch_size: 50
  
  output:
    format: "npy"  # or "hdf5", "parquet"
    save_intermediate: false
    save_visualizations: true
```

**Design Decisions:**
- **Each feature type saved separately** - enables selective loading
- **Pluggable extractors** - easy to add new feature types
- **Metadata tracking** - know exactly how each feature was extracted
- **Batch processing** - efficient CPU utilization

---

### STAGE 6: Deep Feature Extraction

**Purpose:** Extract embeddings from pretrained/fine-tuned deep models

**Model Families:**

1. **ResNet Family**
   - ResNet18/34/50/101/152
   - ResNeXt50/101

2. **EfficientNet**
   - B0 through B7

3. **ConvNeXt**
   - Tiny, Small, Base, Large, XLarge

4. **Vision Transformers**
   - ViT-Tiny/Small/Base/Large
   - DeiT variants
   - Swin-Tiny/Small/Base/Large

5. **Self-Supervised Models**
   - DINO (ViT and ResNet backbones)
   - MAE (Masked Autoencoder)
   - MoCo v3
   - SimCLR
   - BYOL

6. **Face/Biometric Models**
   - ArcFace (ResNet backbones)
   - CosFace
   - FaceNet

**Extraction Modes:**

- **Pretrained Frozen:** Use ImageNet or self-supervised weights
- **User Fine-Tuned:** Load weights from Stage 7

**Layer Selection:**
- Final embedding layer (before classifier)
- Intermediate layers (configurable)
- Multi-layer fusion

**Processing:**

1. Load model from registry
2. Load weights (pretrained or fine-tuned)
3. Set to evaluation mode
4. Batch process images through GPU
5. Extract embeddings from specified layer(s)
6. L2-normalize if configured
7. Save embeddings

**Outputs:**
```
s06_deep_features/
├── outputs/
│   ├── resnet50_imagenet.npy (shape: [N, 2048])
│   ├── efficientnet_b0_imagenet.npy
│   ├── vit_base_dino.npy
│   ├── resnet50_finetuned_exp42.npy (if from Stage 7)
│   └── ...
├── plots/
│   ├── extraction_throughput.png
│   └── embedding_dimension_summary.png
└── metadata/
    ├── model_registry.json
    └── extraction_stats.json
```

**Configuration:**
```yaml
deep_features:
  enabled: true
  
  models:
    - name: "resnet50_imagenet"
      architecture: "resnet50"
      weights: "IMAGENET1K_V2"
      source: "torchvision"
      layer: "avgpool"
      normalize: true
      device: "cuda:0"
    
    - name: "efficientnet_b0"
      architecture: "efficientnet_b0"
      weights: "IMAGENET1K_V1"
      source: "torchvision"
      layer: "avgpool"
      normalize: true
      device: "cuda:0"
    
    - name: "vit_base_dino"
      architecture: "vit_base_patch16_224"
      weights: "dino"
      source: "torch.hub"
      repo: "facebookresearch/dino:main"
      layer: "head"
      normalize: true
      device: "cuda:0"
    
    - name: "resnet50_finetuned"
      architecture: "resnet50"
      weights: "runs/{train_experiment_id}/models/best_model.pth"
      source: "custom"
      layer: "avgpool"
      normalize: true
      device: "cuda:0"
      enabled_if_exists: true  # skip if weights don't exist
  
  preprocessing:
    resize: 224
    center_crop: 224
    normalization:
      mean: [0.485, 0.456, 0.406]
      std: [0.229, 0.224, 0.225]
  
  batch_processing:
    batch_size: 128
    num_workers: 4
    prefetch_factor: 2
    pin_memory: true
  
  output:
    format: "npy"
    dtype: "float32"
    save_per_model: true
  
  caching:
    enabled: true
    cache_dir: "cache/embeddings"
```

**Design Decisions:**
- **Model weights versioned** - explicit source tracking
- **Conditional extraction** - skip if fine-tuned weights don't exist yet
- **GPU batch processing** - maximize throughput
- **L2 normalization** - standard for metric learning embeddings

---

### STAGE 7: Training/Fine-Tuning (Optional)

**Purpose:** Train or fine-tune models on cattle data

**Training Modes:**

#### 7A: Self-Supervised Pretraining
- Use ALL cattle images (even without IDs)
- Learn cattle-specific representations
- Methods: SimCLR, MoCo, DINO, MAE

#### 7B: Supervised Metric Learning
- Use images with cattle IDs
- Learn to distinguish individuals
- Losses: ArcFace, CosFace, SupCon, Triplet, ProxyAnchor, CircleLoss

**Training Strategies:**
- Freeze backbone, train embedding head only
- Fine-tune entire model
- Progressive unfreezing
- Multi-task learning

**Processing:**

1. Load backbone model
2. Initialize loss function and optimizer
3. Create dataloaders
4. Training loop:
   - Forward pass
   - Loss computation
   - Backward pass
   - Log metrics every N iterations
   - Save checkpoint every N epochs
   - Evaluate on validation set
5. Save best model
6. Generate training visualizations

**Training Diagnostics Tracked:**

**Per Epoch:**
- Train loss, validation loss
- Learning rate
- Positive pair similarity (mean, std)
- Negative pair similarity (mean, std)
- Similarity gap (positive - negative)
- Embedding collapse metrics (std of embeddings)
- Top-1/Top-5 validation accuracy
- ROC-AUC

**Per Checkpoint:**
- Full model state
- Optimizer state
- Epoch number, iteration number

**Outputs:**
```
s07_training/
├── outputs/
│   ├── models/
│   │   ├── checkpoint_epoch_10.pth
│   │   ├── checkpoint_epoch_20.pth
│   │   ├── ...
│   │   ├── best_model.pth
│   │   └── final_model.pth
│   ├── embeddings/ (validation embeddings per epoch)
│   │   ├── epoch_10_val_embeddings.npy
│   │   └── ...
│   └── training_history.csv
├── plots/
│   ├── loss_curves.png
│   ├── similarity_evolution.png
│   ├── embedding_std_over_time.png
│   ├── roc_curves_by_epoch.png
│   ├── embedding_umap_epoch_10.png
│   └── ...
└── metadata/
    ├── training_config.json
    ├── final_metrics.json
    └── tensorboard_logs/
```

**Configuration:**
```yaml
training:
  enabled: false  # Optional stage
  
  mode: "metric_learning"  # or "self_supervised"
  
  model:
    backbone: "resnet50"
    pretrained: true
    pretrained_weights: "IMAGENET1K_V2"
    freeze_backbone: false
    embedding_dim: 512
  
  loss:
    type: "arcface"  # or "cosface", "supcon", "triplet", "proxyanchor"
    params:
      margin: 0.5
      scale: 64
  
  optimizer:
    type: "adamw"
    lr: 0.0001
    weight_decay: 0.0001
  
  scheduler:
    type: "cosine"
    T_max: 100
    eta_min: 0.00001
  
  training:
    epochs: 100
    batch_size: 64
    num_workers: 8
    mixed_precision: true
    gradient_accumulation_steps: 1
    gradient_clip_norm: 1.0
  
  augmentation:
    train:
      - random_resized_crop: {size: 224, scale: [0.8, 1.0]}
      - random_horizontal_flip: {p: 0.5}
      - color_jitter: {brightness: 0.2, contrast: 0.2, saturation: 0.2}
      - random_rotation: {degrees: 15}
      - gaussian_blur: {p: 0.3, sigma: [0.1, 2.0]}
    val:
      - resize: {size: 256}
      - center_crop: {size: 224}
  
  validation:
    frequency: 1  # epochs
    metrics: ["top1", "top5", "roc_auc"]
  
  checkpointing:
    save_frequency: 10  # epochs
    save_best_only: false
    monitor_metric: "val_top1"
    mode: "max"
  
  logging:
    tensorboard: true
    wandb: false
    log_frequency: 10  # iterations
  
  multi_gpu:
    enabled: false
    strategy: "ddp"  # or "dp"
    devices: [0, 1, 2, 3]
  
  early_stopping:
    enabled: true
    patience: 15
    monitor: "val_top1"
    mode: "max"
```

**Design Decisions:**
- **Comprehensive diagnostics** - track everything that matters
- **Checkpoint everything** - never lose training progress
- **Embedding quality tracking** - detect collapse early
- **Reproducibility** - fixed seeds, deterministic operations

---

### STAGE 8: Feature Fusion

**Purpose:** Combine multiple feature representations

**Fusion Strategies:**

#### 8.1 Concatenation
- Stack all features horizontally
- Result: very high-dimensional vector
- Pro: Simple, preserves all info
- Con: Curse of dimensionality

#### 8.2 Weighted Combination
- Linear combination with learned or fixed weights
- `fused = w1*feat1 + w2*feat2 + ...`
- Weights sum to 1

#### 8.3 Learned Fusion (Neural Network)
- Small MLP takes all features as input
- Learns optimal combination
- Outputs final embedding

#### 8.4 Hierarchical Fusion
- First: fuse classical features
- Second: fuse deep features
- Third: fuse both groups
- Preserves semantic structure

#### 8.5 Quality-Aware Fusion
- Weight features by image quality
- Low-quality images get lower weight

**Processing:**

1. Load all feature vectors
2. Apply fusion method
3. Save fused vectors
4. Compute fusion statistics

**Outputs:**
```
s08_fusion/
├── outputs/
│   ├── fused_features.npy
│   ├── fusion_weights.json (if weighted/learned)
│   └── fusion_stats.json
├── plots/
│   ├── feature_contribution.png
│   └── dimensionality_comparison.png
└── metadata/
    └── fusion_config.json
```

**Configuration:**
```yaml
fusion:
  enabled: true
  method: "weighted"  # or "concat", "learned", "hierarchical"
  
  weighted:
    features:
      - name: "ridge_orientation_field"
        weight: 0.4
      - name: "resnet50_imagenet"
        weight: 0.3
      - name: "lbp_uniform"
        weight: 0.2
      - name: "color_moments"
        weight: 0.1
    normalize_before: true
    normalize_after: true
  
  learned:
    hidden_dims: [1024, 512, 256]
    output_dim: 512
    activation: "relu"
    dropout: 0.2
    training:
      epochs: 50
      batch_size: 256
      lr: 0.001
  
  hierarchical:
    groups:
      classical: ["color_*", "texture_*", "shape_*"]
      deep: ["resnet*", "efficientnet*", "vit*"]
      ridge: ["ridge_*"]
    group_fusion_method: "weighted"
    final_fusion_method: "weighted"
  
  quality_aware:
    enabled: false
    quality_feature: "blur_score"
    weighting_function: "sigmoid"
```

**Design Decision:**
- **Multiple strategies available** - experiment to find best
- **Modular fusion** - easy to add new methods
- **Metadata tracking** - know exactly how fusion was done

---

### STAGE 9: Gallery Construction

**Purpose:** Build searchable gallery of cattle representations

**Gallery Strategies:**

#### 9.1 Single Vector Per Cattle
- Use best quality image
- Or average all embeddings

#### 9.2 Multi-Vector Per Cattle
- Store all embeddings
- Match against all, aggregate scores

#### 9.3 Quality-Weighted Template
- Weighted average based on image quality

#### 9.4 Prototype Selection
- Select K most representative embeddings per cattle

**Processing:**

1. Group embeddings by cattle ID
2. Apply gallery strategy
3. Build gallery index
4. Compute gallery statistics

**Outputs:**
```
s09_gallery/
├── outputs/
│   ├── gallery_vectors.npy (or per-cattle files)
│   ├── gallery_metadata.parquet (cattle_id, num_images, quality, etc.)
│   └── gallery_stats.json
├── plots/
│   ├── gallery_size_distribution.png
│   └── quality_distribution.png
└── metadata/
    └── gallery_config.json
```

**Configuration:**
```yaml
gallery:
  enabled: true
  strategy: "multi_vector"  # or "single_best", "average", "weighted_average", "prototypes"
  
  single_best:
    selection_criterion: "quality_score"  # or "random"
  
  average:
    method: "mean"  # or "median"
  
  weighted_average:
    weights_from: "quality_scores"
    normalization: "softmax"
  
  multi_vector:
    max_vectors_per_cattle: 10
    selection_method: "quality_top_k"  # or "all"
  
  prototypes:
    k: 5
    selection_method: "k_medoids"  # or "k_means"
  
  filtering:
    min_quality_score: 0.3
    exclude_poor_quality: true
```

**Design Decision:**
- **Flexible strategies** - one size doesn't fit all
- **Quality-aware** - leverage quality metrics from Stage 2
- **Metadata-rich** - track provenance of gallery vectors

---

### STAGE 10: Vector Indexing

**Purpose:** Build fast nearest neighbor search index

**Indexing Backends:**

1. **FAISS (Facebook AI Similarity Search)**
   - Supports CPU and GPU
   - Multiple index types
   - Highly optimized

2. **Milvus**
   - Distributed vector database
   - Good for very large scale

3. **Annoy**
   - Simple, lightweight
   - Read-only after build

**Index Types (FAISS):**
- **Flat** (exact search, slow but accurate)
- **IVF** (Inverted File, approximate)
- **HNSW** (Hierarchical Navigable Small World, very fast)
- **PQ** (Product Quantization, memory-efficient)

**Distance Metrics:**
- Cosine similarity (convert to inner product)
- Euclidean distance (L2)
- Inner product

**Processing:**

1. Load gallery vectors
2. Select index type and parameters
3. Build index
4. Optionally train index (for approximate methods)
5. Add vectors to index
6. Save index to disk

**Outputs:**
```
s10_indexing/
├── outputs/
│   ├── faiss_index.bin
│   ├── index_metadata.json
│   └── vector_ids_mapping.parquet (index_id -> cattle_id)
├── plots/
│   └── index_build_time.png
└── metadata/
    ├── index_config.json
    └── index_stats.json
```

**Configuration:**
```yaml
indexing:
  enabled: true
  backend: "faiss"  # or "milvus", "annoy"
  
  faiss:
    index_type: "HNSW"  # or "Flat", "IVF", "IVFPQ"
    distance_metric: "cosine"  # or "euclidean", "inner_product"
    
    hnsw:
      M: 32  # number of connections
      efConstruction: 200
      efSearch: 100
    
    ivf:
      nlist: 100  # number of clusters
      nprobe: 10  # number of clusters to search
    
    pq:
      m: 8  # number of subquantizers
      nbits: 8  # bits per subquantizer
    
    use_gpu: false
    gpu_id: 0
  
  normalization:
    normalize_vectors: true  # for cosine similarity
  
  output:
    save_index: true
    save_mapping: true
```

**Design Decision:**
- **Backend abstraction** - easy to swap FAISS for Milvus
- **Index type configurable** - trade accuracy vs speed
- **GPU support** - optional acceleration

---

### STAGE 11: Query & Matching

**Purpose:** Perform 1:N cattle identification

**Query Types:**

1. **Single Query**
   - One image → Top-K matches

2. **Batch Queries**
   - Multiple images → results for each

3. **Evaluation Queries**
   - Run all test set through gallery

**Matching Process:**

1. Extract features from query image (same pipeline as gallery)
2. Search vector index
3. Retrieve Top-K candidates
4. Apply threshold filtering
5. Return ranked results

**Decision Modes:**

1. **Top-1 Only**
   - Return best match if above threshold

2. **Top-K Candidates**
   - Return K best matches with scores

3. **Tri-State Decision**
   - **Match:** High confidence (score > high_threshold)
   - **Review:** Uncertain (low_threshold < score < high_threshold)
   - **Unknown:** No match (score < low_threshold)

**Outputs:**
```
s11_matching/
├── outputs/
│   ├── query_results.parquet (query_id, rank, cattle_id, score)
│   ├── match_decisions.csv (query_id, decision, top1_id, top1_score)
│   └── matching_stats.json
├── plots/
│   ├── score_distribution.png
│   ├── top1_vs_top2_gap.png
│   └── decision_distribution.png (match/review/unknown counts)
└── metadata/
    └── matching_config.json
```

**Configuration:**
```yaml
matching:
  enabled: true
  
  query_processing:
    feature_extraction: "same_as_gallery"
    preprocessing: "same_as_gallery"
  
  search:
    top_k: 20
    search_params: {}  # backend-specific
  
  decision:
    mode: "tri_state"  # or "top_k", "threshold"
    
    tri_state:
      high_threshold: 0.85  # confident match
      low_threshold: 0.70   # uncertain, review needed
      gap_threshold: 0.05   # top1-top2 gap for confidence
    
    threshold:
      min_score: 0.75
    
    top_k_only:
      k: 5
  
  post_processing:
    re_ranking: false  # optional: use different features for re-ranking
    re_ranking_features: "classical"
  
  quality_gating:
    enabled: true
    reject_query_below_quality: 0.3
```

**Design Decision:**
- **Tri-state decision** - acknowledges uncertainty
- **Configurable thresholds** - domain-specific tuning
- **Quality gating** - reject obviously poor queries upfront

---

### STAGE 12: Feature Attribution

**Purpose:** Explain WHY matches ranked high or low

This is a **key differentiator** for R&D - understanding contribution of each feature.

**Attribution Analysis:**

For each query → match pair:

1. **Compute Individual Feature Similarities**
   - For all 150+ features
   - Example:
     - `color_similarity = cosine(query_color, match_color)`
     - `ridge_similarity = cosine(query_ridge, match_ridge)`
     - `resnet_similarity = cosine(query_resnet, match_resnet)`

2. **Calculate Contributions**
   - Normalize similarities
   - Compute percentage contribution
   - Example: "Ridge contributed 52%, ResNet 25%, Color 5%"

3. **Analyze Agreement**
   - Do all features agree this is a match?
   - Or do they disagree?
   - High disagreement = uncertain match

**Attribution Metrics:**

- **Per-Feature Similarity:** Individual similarity scores
- **Contribution Percentage:** Weighted importance
- **Agreement Score:** Variance across features
- **Dominant Feature:** Which feature drove the decision

**Processing:**

1. Load all feature vectors (query and gallery)
2. For each query:
   - For each Top-K match:
     - Compute per-feature similarities
     - Calculate contributions
     - Compute agreement metrics
3. Aggregate statistics across queries
4. Identify patterns (e.g., "Ridge dominates 65% of correct matches")

**Outputs:**
```
s12_attribution/
├── outputs/
│   ├── per_query_attribution.parquet
│   │   Columns: query_id, match_rank, cattle_id, 
│   │            feature1_sim, feature2_sim, ..., 
│   │            feature1_contrib%, feature2_contrib%, ...,
│   │            agreement_score, dominant_feature
│   ├── aggregated_attribution.json
│   │   {
│   │     "overall_feature_importance": {...},
│   │     "correct_match_patterns": {...},
│   │     "failed_match_patterns": {...}
│   │   }
│   └── feature_correlation_matrix.npy
├── plots/
│   ├── feature_contribution_bars.png
│   ├── contribution_heatmap.png (queries × features)
│   ├── agreement_distribution.png
│   ├── feature_similarity_distributions.png
│   └── dominant_feature_pie_chart.png
└── metadata/
    └── attribution_config.json
```

**Example Attribution Output:**

```
Query: cattle_523.jpg (ID: CATTLE_523)

Top-1 Match: cattle_042.jpg (ID: CATTLE_523) ✓ Correct
  Overall Similarity: 0.91
  
  Feature Similarities:
    ridge_orientation:  0.88
    resnet50:           0.92
    lbp_texture:        0.85
    efficientnet_b0:    0.89
    color_histogram:    0.65
  
  Contributions:
    Ridge patterns:    48% (dominant)
    ResNet50:          21%
    Texture (LBP):     15%
    EfficientNet:      13%
    Color:             3%
  
  Agreement Score: 0.87 (high agreement)
  Dominant Feature: ridge_orientation

Top-3 Match: cattle_201.jpg (ID: CATTLE_104) ✗ Wrong
  Overall Similarity: 0.82
  
  Feature Similarities:
    ridge_orientation:  0.65  ← weak!
    resnet50:           0.91  ← strong!
    lbp_texture:        0.88
    efficientnet_b0:    0.87
    color_histogram:    0.72
  
  Contributions:
    ResNet50:          42% (dominant - mismatch!)
    Texture:           28%
    EfficientNet:      22%
    Ridge patterns:    5%   ← should be higher!
    Color:             3%
  
  Agreement Score: 0.52 (low - features disagree!)
  Issue: Ridge weak (likely muzzle occlusion)
```

**Global Attribution Summary:**

```
Across 1000 queries:

Average Feature Importance:
  Ridge Patterns:  41% ← Most important
  ResNet50:        26%
  EfficientNet:    18%
  Texture (LBP):   10%
  Color:           5%

For Correct Top-1 Matches:
  Ridge-driven:     65% (ridge contributed >40%)
  Deep-driven:      25%
  Texture-driven:   8%
  Mixed:            2%

For Failed Matches:
  Ridge occluded:   45%
  All features weak: 30%
  Feature conflict:  25%

Insights:
  ✓ Ridge patterns are KEY
  ✓ Deep features good fallback
  ⚠ Color contributes <5% - consider removing
  ⚠ When ridge + deep disagree, review manually
```

**Configuration:**
```yaml
attribution:
  enabled: true
  
  analysis:
    compute_per_query: true
    compute_aggregated: true
    top_k_for_attribution: 10
  
  features_to_analyze:
    - "ridge_orientation_field"
    - "resnet50_imagenet"
    - "efficientnet_b0"
    - "lbp_uniform"
    - "color_histogram"
    - "fused_features"  # overall
  
  metrics:
    similarity_metrics: ["cosine", "euclidean"]
    contribution_method: "softmax"  # or "linear", "rank"
    agreement_metric: "std"  # or "entropy"
  
  aggregation:
    group_by: ["correct_vs_incorrect", "quality_tier"]
    statistics: ["mean", "median", "std", "percentiles"]
  
  visualization:
    generate_per_query_cards: true
    max_cards: 100
    generate_aggregated_plots: true
```

**Design Decision:**
- **Explainability first** - critical for R&D
- **Per-query + aggregated** - both perspectives needed
- **Disagreement detection** - identifies when to not trust results

---

### STAGE 13: Evaluation

**Purpose:** Comprehensive performance assessment

**Metrics Computed:**

#### 13.1 Identification Metrics
- **Top-K Accuracy** (k=1, 5, 10, 20)
  - % of queries where correct ID appears in top-K
- **Mean Average Precision (mAP)**
- **Mean Reciprocal Rank (MRR)**

#### 13.2 Biometric Metrics
- **ROC Curve** (Receiver Operating Characteristic)
  - True Accept Rate vs False Accept Rate
- **CMC Curve** (Cumulative Match Characteristic)
  - Identification rate vs rank
- **TAR @ FAR** (True Accept Rate at various False Accept Rates)
  - TAR @ FAR=0.1%, 1%, 10%
- **EER** (Equal Error Rate)
  - Where FAR = FRR (False Reject Rate)
- **DET Curve** (Detection Error Tradeoff)

#### 13.3 Stratified Analysis
Break down performance by:
- Image quality (high/medium/low)
- ROI method (SAM vs YOLO vs none)
- Number of gallery images per cattle ID
- Cattle characteristics (if metadata available)
- Query difficulty

#### 13.4 Failure Analysis
- **Failure Taxonomy**
  - Blur-induced failures
  - ROI extraction failures
  - Occlusion failures
  - Pose/angle failures
  - Look-alike confusion
- **Hard Identity Detection**
  - Which cattle are systematically confused
  - Confusion matrices
- **Feature-Level Failure Patterns**
  - Which features fail for which failure types

#### 13.5 Statistical Validation
- **Confidence Intervals** (bootstrap)
- **Significance Tests** (comparing experiments)
- **Cross-Validation Results** (if applicable)

**Processing:**

1. Load query results and ground truth
2. Compute all metrics
3. Perform stratified analysis
4. Analyze failures
5. Generate statistical reports
6. Create comprehensive visualizations

**Outputs:**
```
s13_evaluation/
├── outputs/
│   ├── metrics_summary.json
│   │   {
│   │     "top1_accuracy": 0.873,
│   │     "top5_accuracy": 0.951,
│   │     "map": 0.892,
│   │     "tar_at_far_0.01": 0.847,
│   │     "eer": 0.052,
│   │     ...
│   │   }
│   ├── stratified_results.csv
│   ├── confusion_matrix.csv (identity-level)
│   ├── failure_cases.parquet
│   ├── hard_identities.csv
│   └── statistical_tests.json
├── plots/
│   ├── roc_curve.png
│   ├── cmc_curve.png
│   ├── tar_at_far_bars.png
│   ├── det_curve.png
│   ├── topk_accuracy_bars.png
│   ├── confusion_heatmap.png
│   ├── performance_by_quality.png
│   ├── performance_by_roi_method.png
│   ├── failure_type_distribution.png
│   ├── hard_identities_scatter.png
│   └── confidence_intervals.png
└── metadata/
    ├── evaluation_config.json
    └── statistical_params.json
```

**Failure Taxonomy Example:**

```
Failure Analysis (Top-1 Errors):

Total Failures: 127 / 1000 queries (12.7%)

Breakdown by Cause:
  Blur-induced:           57 (45%)
    - Query too blurry:   42
    - Gallery too blurry: 15
  
  ROI Extraction:         31 (24%)
    - Muzzle not found:   18
    - Incorrect crop:     13
  
  Occlusion:              23 (18%)
    - Mud on muzzle:      14
    - Feed covering face:  9
  
  Look-alike Confusion:   12 (9%)
    - Same breed, similar: 10
    - Same family:          2
  
  Pose/Angle:             4 (3%)
    - Extreme side view:   4

Top Confused Pairs:
  CATTLE_042 ↔ CATTLE_104: 5 cases
  CATTLE_201 ↔ CATTLE_305: 3 cases
  ...
```

**Configuration:**
```yaml
evaluation:
  enabled: true
  
  metrics:
    identification:
      - top_k_accuracy: [1, 5, 10, 20]
      - map: true
      - mrr: true
    
    biometric:
      - roc: true
      - cmc: true
      - tar_at_far: [0.001, 0.01, 0.1]
      - eer: true
      - det: true
  
  stratification:
    enabled: true
    factors:
      - quality_tier: ["high", "medium", "low"]
      - roi_method: ["sam", "yolo", "none"]
      - gallery_size_per_id: ["single", "few", "many"]
  
  failure_analysis:
    enabled: true
    taxonomy:
      - blur_induced
      - roi_failure
      - occlusion
      - look_alike
      - pose_angle
      - unknown
    save_failure_examples: true
    max_examples_per_type: 20
  
  statistical_validation:
    bootstrap:
      enabled: true
      n_iterations: 1000
      confidence_level: 0.95
    
    hypothesis_testing:
      enabled: false  # for comparing experiments
      test: "mcnemar"  # or "permutation"
      alpha: 0.05
  
  hard_identity_detection:
    enabled: true
    threshold: 0.5  # IDs with <50% Top-1 accuracy
  
  confusion_analysis:
    enabled: true
    min_confusion_count: 2
```

**Design Decision:**
- **Biometric-standard metrics** - not just ML accuracy
- **Failure taxonomy** - actionable insights
- **Statistical rigor** - know when results are significant
- **Stratified analysis** - understand conditional performance

---

### STAGE 14: Visualization

**Purpose:** Generate comprehensive visual diagnostics

**Plot Categories:**

#### 14.1 Data Quality Plots
- Quality metric distributions
- Quality heatmaps
- Best/worst image grids
- Quality vs performance correlation

#### 14.2 ROI Extraction Plots
- Mask quality distributions
- Before/after grids
- Success/failure rates
- ROI method comparisons

#### 14.3 Feature Analysis Plots
- t-SNE / UMAP embeddings (2D projections)
- Feature correlation heatmaps
- Feature importance bars
- Per-feature similarity distributions

#### 14.4 Training Plots (if Stage 7 ran)
- Loss curves (train vs val)
- Accuracy over epochs
- Similarity evolution (positive vs negative)
- Embedding std over time (collapse detection)
- Learning rate schedule
- ROC/CMC curves by epoch

#### 14.5 Attribution Plots
- Feature contribution bars
- Contribution heatmaps (queries × features)
- Agreement vs accuracy scatter
- Top-K contribution trends

#### 14.6 Evaluation Plots
- ROC, CMC, DET curves
- Top-K accuracy bars
- Confusion matrices
- Performance by stratification
- Failure type distribution

#### 14.7 Comparison Plots (cross-experiment)
- Metric comparison bars
- ROC curve overlays
- Feature importance comparison

**Processing:**

1. Load artifacts from all previous stages
2. Generate plots based on config
3. Save plots in multiple formats
4. Create interactive HTML versions (optional)

**Outputs:**
```
s14_visualization/
├── plots/
│   ├── quality/
│   │   ├── blur_distribution.png
│   │   ├── quality_heatmap.png
│   │   └── ...
│   ├── roi/
│   │   ├── before_after_grid.png
│   │   └── ...
│   ├── features/
│   │   ├── umap_embeddings.png
│   │   ├── tsne_embeddings.png
│   │   ├── feature_correlation.png
│   │   └── ...
│   ├── training/ (if applicable)
│   │   ├── loss_curves.png
│   │   ├── similarity_evolution.png
│   │   └── ...
│   ├── attribution/
│   │   ├── feature_contributions.png
│   │   ├── contribution_heatmap.png
│   │   └── ...
│   ├── evaluation/
│   │   ├── roc_curve.png
│   │   ├── cmc_curve.png
│   │   ├── confusion_matrix.png
│   │   └── ...
│   └── interactive/
│       ├── embeddings_interactive.html
│       └── ...
└── metadata/
    └── visualization_config.json
```

**Configuration:**
```yaml
visualization:
  enabled: true
  
  output:
    formats: ["png", "pdf"]
    dpi: 300
    style: "seaborn-v0_8"
    figsize: [10, 8]
    save_interactive: true
  
  plots:
    quality:
      - blur_distribution
      - quality_heatmap
      - best_worst_grids:
          n_best: 16
          n_worst: 16
    
    roi:
      - before_after_grid:
          n_samples: 16
      - mask_quality_dist
    
    features:
      - umap_embeddings:
          n_components: 2
          n_neighbors: 15
          min_dist: 0.1
          color_by: "cattle_id"
      - tsne_embeddings:
          perplexity: 30
          n_iter: 1000
      - feature_correlation
    
    training:  # if Stage 7 ran
      - loss_curves
      - accuracy_curves
      - similarity_evolution
      - embedding_collapse_check
    
    attribution:
      - feature_contribution_bars
      - contribution_heatmap
      - agreement_scatter
    
    evaluation:
      - roc_curve
      - cmc_curve
      - det_curve
      - topk_accuracy_bars
      - confusion_matrix
      - stratified_performance
      - failure_distribution
  
  interactive:
    enabled: true
    backend: "plotly"  # or "bokeh"
    plots:
      - embeddings_3d
      - interactive_confusion_matrix
```

**Design Decision:**
- **Comprehensive, not overwhelming** - prioritize useful plots
- **Publication-quality** - high DPI, clean styling
- **Interactive where useful** - embeddings, confusion matrices

---

### STAGE 15: Report Generation

**Purpose:** Auto-generate comprehensive experiment report

**Report Structure:**

```
1. Executive Summary
   - Experiment name and description
   - Key findings (top-1 accuracy, best feature, etc.)
   - Recommendations

2. Configuration
   - Full experiment config (YAML)
   - Dataset info
   - Model info
   - Key parameters

3. Dataset Analysis
   - Total images and cattle IDs
   - Split statistics
   - Quality distributions
   - Data issues detected

4. ROI Extraction (if enabled)
   - Method used
   - Success rate
   - Quality metrics

5. Feature Extraction
   - Features extracted
   - Dimensions
   - Extraction time

6. Training (if applicable)
   - Training configuration
   - Final metrics
   - Best epoch
   - Training curves embedded

7. Matching & Attribution
   - Top-K accuracy
   - Feature importance rankings
   - Attribution insights

8. Evaluation Results
   - All metrics
   - ROC/CMC curves
   - Stratified results
   - Failure analysis

9. Visualizations
   - All plots embedded
   - Interactive elements

10. Failure Case Studies
    - Top failure cases
    - Analysis per case

11. Recommendations
    - What worked well
    - What to improve
    - Next experiments to try

12. Technical Details
    - Software versions
    - Hardware used
    - Execution time
    - Git commit
```

**Output Formats:**

1. **HTML Report** (interactive)
   - Embedded plots
   - Expandable sections
   - Searchable
   - Linked artifacts

2. **PDF Report** (printable)
   - Professional formatting
   - Executive summary upfront
   - Technical details in appendix

3. **JSON Report** (machine-readable)
   - All metrics
   - Structured data
   - For programmatic access

**Outputs:**
```
s15_reporting/
├── outputs/
│   ├── report.html
│   ├── report.pdf
│   ├── report_data.json
│   └── executive_summary.txt
└── metadata/
    └── report_config.json
```

**Configuration:**
```yaml
reporting:
  enabled: true
  
  formats:
    html: true
    pdf: true
    json: true
  
  sections:
    executive_summary: true
    configuration: true
    dataset_analysis: true
    roi_extraction: true
    feature_extraction: true
    training: true  # if applicable
    matching: true
    attribution: true
    evaluation: true
    visualizations: true
    failure_cases: true
    recommendations: true
    technical_details: true
  
  style:
    theme: "professional"  # or "academic", "minimal"
    logo: "assets/logo.png"
    author: "Cattle Biometric R&D Team"
  
  executive_summary:
    max_length: 500  # words
    highlight_metrics: ["top1_accuracy", "tar_at_far_0.01"]
  
  failure_cases:
    max_cases: 10
    include_images: true
  
  recommendations:
    auto_generate: true
    based_on:
      - low_performing_features
      - high_failure_types
      - attribution_insights
```

**Design Decision:**
- **Multi-format** - HTML for interactive, PDF for sharing, JSON for APIs
- **Auto-generated insights** - system suggests next steps
- **Executive summary first** - decision-makers see key info immediately

---

### STAGE 16: Experiment Tracking

**Purpose:** Track all experiments in searchable database

**Tracked Information:**

**Per Experiment:**
- Experiment ID (timestamp-based)
- Experiment name and description
- Full configuration (YAML)
- Dataset version
- Git commit hash
- Environment snapshot (Python, PyTorch, CUDA versions)
- Execution timestamps (start, end, duration)
- Hardware used (CPU, GPU models)
- Final metrics (all from Stage 13)
- Artifact paths

**Database Schema:**

```sql
CREATE TABLE experiments (
    experiment_id TEXT PRIMARY KEY,
    name TEXT,
    description TEXT,
    config_yaml TEXT,
    dataset_version TEXT,
    git_commit TEXT,
    created_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    status TEXT,  -- running, completed, failed
    hardware_info JSON,
    final_metrics JSON,
    artifact_dir TEXT
);

CREATE TABLE experiment_metrics (
    experiment_id TEXT,
    metric_name TEXT,
    metric_value REAL,
    split TEXT,  -- train, val, test
    FOREIGN KEY (experiment_id) REFERENCES experiments(experiment_id)
);

CREATE TABLE experiment_comparisons (
    comparison_id TEXT PRIMARY KEY,
    experiment_ids TEXT[],  -- list of compared experiments
    created_at TIMESTAMP,
    comparison_results JSON
);
```

**Features:**

1. **Experiment Registry**
   - List all experiments
   - Filter by date, status, metrics
   - Search by name or description

2. **Metric Comparison**
   - Compare metrics across experiments
   - Generate comparison reports
   - Visualize metric trends

3. **Best Model Tracking**
   - Track current best model
   - Track improvements over time

4. **Reproducibility**
   - Retrieve exact config for any experiment
   - Reproduce experiment from ID

**Outputs:**
```
s16_tracking/
├── outputs/
│   └── experiments.db (SQLite database)
├── dashboards/
│   ├── experiment_comparison.html
│   ├── metric_trends.html
│   └── best_models.html
└── metadata/
    └── tracking_config.json
```

**Configuration:**
```yaml
tracking:
  enabled: true
  
  database:
    backend: "sqlite"  # or "postgresql", "mongodb"
    path: "experiments/experiments.db"
  
  tracked_info:
    config: true
    metrics: true
    git_commit: true
    environment: true
    hardware: true
    artifacts: true
  
  comparison:
    enabled: true
    default_metrics: ["top1_accuracy", "top5_accuracy", "tar_at_far_0.01"]
    generate_dashboard: true
  
  best_model_tracking:
    enabled: true
    criterion: "top1_accuracy"
    mode: "max"
```

**Design Decision:**
- **Lightweight tracking** - SQLite for simplicity, can scale to PostgreSQL
- **Git integration** - reproducibility via code version
- **Dashboard generation** - visual experiment comparison

---

## 6. Engineering Design

### 6.1 Configuration System

**Config Schema (YAML):**

```yaml
# experiment_config.yaml

experiment:
  name: "baseline_pretrained_sam"
  description: "Baseline using pretrained models with SAM ROI extraction"
  version: "1.0"
  random_seed: 42

dataset:
  image_dir: "data/raw/images"
  labels_file: "data/raw/labels.csv"
  metadata_file: null

stages:
  # Enable/disable stages
  s01_input: true
  s02_quality_analysis: true
  s03_dataset_organization: true
  s04_roi_extraction: true
  s05_classical_features: true
  s06_deep_features: true
  s07_training: false  # Skip training in this experiment
  s08_fusion: true
  s09_gallery: true
  s10_indexing: true
  s11_matching: true
  s12_attribution: true
  s13_evaluation: true
  s14_visualization: true
  s15_reporting: true
  s16_tracking: true

# Stage-specific configs (detailed earlier)
input: {...}
quality_analysis: {...}
dataset_organization: {...}
roi_extraction: {...}
classical_features: {...}
deep_features: {...}
training: {...}
fusion: {...}
gallery: {...}
indexing: {...}
matching: {...}
attribution: {...}
evaluation: {...}
visualization: {...}
reporting: {...}
tracking: {...}

# Global settings
global:
  output_dir: "runs"
  cache_dir: "cache"
  num_workers: 8
  device: "cuda:0"
  log_level: "INFO"
```

**Config Validation:**

```python
# Concept: Pydantic-based validation

from pydantic import BaseModel, Field, validator

class ExperimentConfig(BaseModel):
    name: str
    description: str
    version: str
    random_seed: int = 42
    
    @validator('random_seed')
    def seed_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('random_seed must be non-negative')
        return v

class DatasetConfig(BaseModel):
    image_dir: Path
    labels_file: Path
    metadata_file: Optional[Path] = None
    
    @validator('image_dir', 'labels_file')
    def path_must_exist(cls, v):
        if not v.exists():
            raise ValueError(f'Path {v} does not exist')
        return v

# Full config with all stage configs
class FullConfig(BaseModel):
    experiment: ExperimentConfig
    dataset: DatasetConfig
    stages: StageEnableConfig
    # ... all stage-specific configs
    global_settings: GlobalConfig
```

### 6.2 Run Folder Structure

```
runs/{experiment_id}/
├── config.yaml              # Full resolved config
├── config_raw.yaml          # Original user config
├── metadata.json            # Git hash, env, timestamps
├── logs/
│   ├── main.log            # Overall pipeline log
│   └── {stage_name}.log    # Per-stage logs
├── s01_input/
│   ├── outputs/
│   ├── plots/
│   ├── metadata/
│   └── logs/
├── s02_quality_analysis/
│   └── ...
├── s03_dataset_organization/
│   └── ...
├── ...
├── s16_tracking/
│   └── ...
└── final_report.html        # Generated report
```

### 6.3 Resumability Implementation

**Checkpoint Format:**

```python
# Per-stage checkpoint

checkpoint = {
    'stage_name': 's05_classical_features',
    'config': stage_config,
    'progress': {
        'total_items': 10000,
        'completed_items': 7500,
        'completed_ids': ['img_0001', 'img_0002', ...]
    },
    'partial_outputs': {
        'color_histogram': 'outputs/color/checkpoint_7500.npy',
        'lbp_texture': 'outputs/texture/checkpoint_7500.npy'
    },
    'timestamp': '2026-01-24T10:30:00'
}
```

**Resume Logic:**

```python
def execute_stage(stage_name, config, run_dir):
    checkpoint_path = run_dir / stage_name / "checkpoints" / "latest.pkl"
    
    if checkpoint_path.exists():
        checkpoint = load_checkpoint(checkpoint_path)
        
        # Verify config match
        if checkpoint['config'] != config:
            logger.warning("Config changed, starting from scratch")
            return execute_from_scratch(stage_name, config, run_dir)
        
        # Resume from checkpoint
        logger.info(f"Resuming from {checkpoint['progress']['completed_items']} items")
        return resume_execution(stage_name, checkpoint, run_dir)
    else:
        return execute_from_scratch(stage_name, config, run_dir)
```

**Checkpoint Frequency:**

- Save checkpoint every N items (configurable)
- Save checkpoint every M minutes (time-based)
- Save on graceful shutdown (signal handling)

### 6.4 Parallel Execution

#### CPU Parallelism (Image Processing)

```python
from multiprocessing import Pool
from functools import partial

def process_image_batch(image_paths, extractor, config):
    results = []
    for path in image_paths:
        result = extractor.extract(path, config)
        results.append(result)
    return results

def parallel_extract(image_paths, extractor, config, num_workers=8):
    # Split into chunks
    chunk_size = len(image_paths) // num_workers
    chunks = [image_paths[i:i+chunk_size] 
              for i in range(0, len(image_paths), chunk_size)]
    
    # Parallel processing
    with Pool(num_workers) as pool:
        func = partial(process_image_batch, extractor=extractor, config=config)
        results = pool.map(func, chunks)
    
    # Flatten results
    return [item for sublist in results for item in sublist]
```

#### GPU Parallelism (Deep Features)

```python
import torch
from torch.utils.data import DataLoader

class ImageDataset(Dataset):
    def __init__(self, image_paths, transform):
        self.paths = image_paths
        self.transform = transform
    
    def __getitem__(self, idx):
        image = load_image(self.paths[idx])
        return self.transform(image), self.paths[idx]

def extract_features_gpu(image_paths, model, config):
    dataset = ImageDataset(image_paths, transform=get_transform(config))
    loader = DataLoader(
        dataset, 
        batch_size=config['batch_size'],
        num_workers=config['num_workers'],
        pin_memory=True
    )
    
    model.eval()
    features = []
    
    with torch.no_grad():
        for batch, paths in loader:
            batch = batch.to(config['device'])
            feats = model(batch)
            features.append(feats.cpu().numpy())
    
    return np.concatenate(features)
```

#### Multi-GPU Training

```python
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel

def train_multi_gpu(config):
    # Initialize process group
    dist.init_process_group(backend='nccl')
    
    # Create model and wrap
    model = create_model(config)
    model = model.to(config['local_rank'])
    model = DistributedDataParallel(model, device_ids=[config['local_rank']])
    
    # Create distributed sampler
    train_sampler = DistributedSampler(train_dataset)
    train_loader = DataLoader(
        train_dataset, 
        batch_size=config['batch_size'],
        sampler=train_sampler
    )
    
    # Training loop
    for epoch in range(config['epochs']):
        train_sampler.set_epoch(epoch)
        train_epoch(model, train_loader, optimizer, epoch)
```

### 6.5 Logging & Monitoring

**Logging Strategy:**

```python
import logging
from pathlib import Path

def setup_logger(name, log_file, level=logging.INFO):
    """Setup logger with file and console handlers"""
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # File handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setFormatter(formatter)
    
    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Usage
logger = setup_logger(
    'stage_05', 
    run_dir / 's05_classical_features' / 'logs' / 'stage.log'
)

logger.info("Starting feature extraction")
logger.debug(f"Processing image: {image_path}")
logger.warning(f"Low quality detected: {quality_score}")
logger.error(f"Failed to extract features: {error}")
```

**Progress Monitoring:**

```python
from tqdm import tqdm

def process_with_progress(items, process_func, desc="Processing"):
    results = []
    for item in tqdm(items, desc=desc):
        result = process_func(item)
        results.append(result)
    return results
```

### 6.6 Error Handling

**Graceful Degradation:**

```python
def robust_feature_extraction(image_path, extractors, config):
    """Extract features with fallback handling"""
    
    results = {}
    
    for name, extractor in extractors.items():
        try:
            features = extractor.extract(image_path, config)
            results[name] = {
                'features': features,
                'status': 'success',
                'error': None
            }
        except Exception as e:
            logger.warning(f"Feature extraction failed for {name}: {e}")
            results[name] = {
                'features': None,
                'status': 'failed',
                'error': str(e)
            }
            
            # Use fallback if available
            if config.get('use_fallback', False):
                try:
                    features = extractor.extract_fallback(image_path)
                    results[name]['features'] = features
                    results[name]['status'] = 'fallback'
                except:
                    pass
    
    return results
```

**Partial Results Preservation:**

```python
def process_batch_with_error_handling(batch, process_func, checkpoint_func):
    """Process batch and save partial results on failure"""
    
    results = []
    
    try:
        for i, item in enumerate(batch):
            result = process_func(item)
            results.append(result)
            
            # Checkpoint every N items
            if (i + 1) % 100 == 0:
                checkpoint_func(results)
                
    except Exception as e:
        logger.error(f"Batch processing failed: {e}")
        logger.info(f"Saving {len(results)} partial results")
        checkpoint_func(results)
        raise
    
    return results
```

### 6.7 Determinism & Reproducibility

```python
import random
import numpy as np
import torch

def set_seeds(seed):
    """Set all random seeds for reproducibility"""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    
    # Deterministic CUDA operations (may slow down)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def get_environment_snapshot():
    """Capture environment for reproducibility"""
    return {
        'python_version': sys.version,
        'torch_version': torch.__version__,
        'cuda_version': torch.version.cuda,
        'cudnn_version': torch.backends.cudnn.version(),
        'numpy_version': np.__version__,
        'opencv_version': cv2.__version__,
        'git_commit': get_git_commit_hash(),
        'hostname': socket.gethostname(),
        'timestamp': datetime.now().isoformat()
    }
```

---

## 7. Configuration Management

### 7.1 Config Inheritance

**Base Config:**

```yaml
# configs/defaults/base.yaml

experiment:
  version: "1.0"
  random_seed: 42

global:
  num_workers: 8
  log_level: "INFO"

dataset_organization:
  splitting:
    train_ratio: 0.7
    val_ratio: 0.15
    test_ratio: 0.15
    random_seed: 42
```

**Experiment-Specific Config:**

```yaml
# configs/experiments/exp_ridge_focus.yaml

# Inherit from base
_base_: "configs/defaults/base.yaml"

experiment:
  name: "ridge_focus_experiment"
  description: "Focus on ridge features with weighted fusion"

# Override only what's different
fusion:
  method: "weighted"
  weighted:
    features:
      - name: "ridge_orientation_field"
        weight: 0.6  # High weight on ridge!
      - name: "resnet50_imagenet"
        weight: 0.3
      - name: "lbp_uniform"
        weight: 0.1
```

### 7.2 Config Validation

```python
# Validate before execution

def validate_config(config):
    """Validate experiment configuration"""
    
    errors = []
    
    # Check required fields
    required = ['experiment.name', 'dataset.image_dir', 'dataset.labels_file']
    for field in required:
        if not get_nested(config, field):
            errors.append(f"Missing required field: {field}")
    
    # Check file paths exist
    if not Path(config['dataset']['image_dir']).exists():
        errors.append(f"Image directory not found: {config['dataset']['image_dir']}")
    
    # Check stage dependencies
    if config['stages']['s08_fusion'] and not config['stages']['s05_classical_features']:
        errors.append("Fusion requires classical features to be enabled")
    
    # Check value ranges
    if not 0 <= config['dataset_organization']['splitting']['train_ratio'] <= 1:
        errors.append("train_ratio must be between 0 and 1")
    
    if errors:
        raise ConfigValidationError("\n".join(errors))
```

---

## 8. Artifact Management

### 8.1 Artifact Versioning

**Feature Version Tracking:**

```python
# When saving features
feature_metadata = {
    'feature_type': 'ridge_orientation_field',
    'version': '1.2',
    'extractor_class': 'RidgeOrientationExtractor',
    'extraction_params': {
        'block_size': 16,
        'smoothing_sigma': 5
    },
    'extraction_date': '2026-01-24T10:00:00',
    'code_commit': 'abc123def456',
    'dimension': 1024
}

np.save('ridge_orientation_field.npy', features)
save_json('ridge_orientation_field_metadata.json', feature_metadata)
```

### 8.2 Artifact Cleanup

**Retention Policy:**

```python
def cleanup_old_artifacts(run_dir, retention_config):
    """Clean up artifacts based on retention policy"""
    
    # Keep final outputs forever
    keep_always = ['final_report.html', 'config.yaml', 'metadata.json']
    
    # Delete large intermediate files after N days
    if retention_config['delete_intermediate_after_days']:
        cutoff = datetime.now() - timedelta(
            days=retention_config['delete_intermediate_after_days']
        )
        
        for stage_dir in run_dir.glob('s*_*/'):
            checkpoints_dir = stage_dir / 'checkpoints'
            if checkpoints_dir.exists():
                for ckpt in checkpoints_dir.glob('*.pkl'):
                    if ckpt.stat().st_mtime < cutoff.timestamp():
                        ckpt.unlink()
```

---

## 9. Parallelization Strategy

### 9.1 Execution Graph

```
Quality Analysis ─┐
                  ├──> Dataset Org ──> ROI Extraction ─┬──> Classical Features ─┐
                  │                                     │                        │
Input ────────────┘                                     └──> Deep Features ──────┤
                                                                                   │
                                                                                   ├──> Fusion ──> Gallery ──> Index ──> Match ──> Attrib ──> Eval ──> Viz ──> Report
                                                                                   │
Training (optional, can run parallel to features) ─────────────────────────────>──┘
```

**Parallelizable Stages:**
- Stages 5 & 6 (Classical & Deep Features) can run in parallel
- Stage 7 (Training) can run independently after data prep
- Stages 12-14 (Attribution, Eval, Viz) can partially overlap

### 9.2 Resource Allocation

**CPU-Heavy Stages:**
- Stage 2 (Quality Analysis)
- Stage 5 (Classical Features)

**GPU-Heavy Stages:**
- Stage 4 (ROI Extraction - SAM/YOLO)
- Stage 6 (Deep Features)
- Stage 7 (Training)

**Memory-Heavy Stages:**
- Stage 10 (Vector Indexing - loading all embeddings)
- Stage 13 (Evaluation - large similarity matrices)

**Optimal Resource Allocation:**

```yaml
resources:
  quality_analysis:
    cpu_workers: 16
    gpu: null
    memory_limit: "8GB"
  
  roi_extraction:
    cpu_workers: 2
    gpu: "cuda:0"
    batch_size: 8
    memory_limit: "16GB"
  
  classical_features:
    cpu_workers: 16
    gpu: null
    memory_limit: "8GB"
  
  deep_features:
    cpu_workers: 4
    gpu: "cuda:0"
    batch_size: 128
    memory_limit: "24GB"
  
  training:
    cpu_workers: 8
    gpu: ["cuda:0", "cuda:1", "cuda:2", "cuda:3"]
    batch_size: 64
    memory_limit: "32GB"
```

---

## 10. Experiment Tracking

### 10.1 Experiment Comparison Dashboard

**Features:**

1. **Metric Comparison Table**
   - Side-by-side metrics
   - Highlight best values
   - Delta from baseline

2. **ROC Curve Overlay**
   - Multiple experiments on same plot
   - Color-coded by experiment

3. **Feature Importance Comparison**
   - Stacked bar charts
   - See how feature importance changes

4. **Execution Time Comparison**
   - Which config is faster

**Example Dashboard:**

```html
<!-- Auto-generated HTML dashboard -->

<h2>Experiment Comparison</h2>

<table>
  <tr>
    <th>Experiment</th>
    <th>Top-1 Acc</th>
    <th>Top-5 Acc</th>
    <th>TAR@FAR=0.01</th>
    <th>Runtime</th>
  </tr>
  <tr class="best">
    <td>exp_ridge_focus</td>
    <td>0.931</td>
    <td>0.978</td>
    <td>0.897</td>
    <td>2h 15m</td>
  </tr>
  <tr>
    <td>exp_baseline</td>
    <td>0.873</td>
    <td>0.951</td>
    <td>0.847</td>
    <td>1h 45m</td>
  </tr>
  <tr>
    <td>exp_deep_only</td>
    <td>0.901</td>
    <td>0.965</td>
    <td>0.872</td>
    <td>1h 30m</td>
  </tr>
</table>

<div id="roc_comparison">
  <!-- Plotly interactive ROC curves -->
</div>
```

### 10.2 Best Model Registry

```python
# Track best model across experiments

best_model_registry = {
    'metric': 'top1_accuracy',
    'current_best': {
        'experiment_id': 'exp_20260124_123456_ridge_focus',
        'value': 0.931,
        'model_path': 'runs/exp_20260124_123456_ridge_focus/s07_training/outputs/models/best_model.pth',
        'date': '2026-01-24',
        'config': {...}
    },
    'history': [
        {'experiment_id': 'exp_20260120_...',  'value': 0.901, 'date': '2026-01-20'},
        {'experiment_id': 'exp_20260122_...',  'value': 0.918, 'date': '2026-01-22'},
        {'experiment_id': 'exp_20260124_...',  'value': 0.931, 'date': '2026-01-24'}
    ]
}
```

---

## 11. Appendices

### Appendix A: Feature Registry

**Complete List of Registered Features:**

**Classical Features (~100+):**

```python
CLASSICAL_FEATURES = {
    # Color
    'color_rgb_histogram': {'dim': 768, 'type': 'color'},
    'color_hsv_histogram': {'dim': 768, 'type': 'color'},
    'color_lab_histogram': {'dim': 768, 'type': 'color'},
    'color_moments_rgb': {'dim': 12, 'type': 'color'},
    'color_dominant_kmeans': {'dim': 15, 'type': 'color'},
    
    # Texture
    'texture_lbp_uniform_r1': {'dim': 59, 'type': 'texture'},
    'texture_lbp_uniform_r2': {'dim': 59, 'type': 'texture'},
    'texture_lbp_ri_r1': {'dim': 10, 'type': 'texture'},
    'texture_gabor_4scales_8orient': {'dim': 64, 'type': 'texture'},
    'texture_glcm_contrast': {'dim': 4, 'type': 'texture'},
    'texture_wavelet_haar_l3': {'dim': 32, 'type': 'texture'},
    
    # Ridge/Muzzle
    'ridge_orientation_field': {'dim': 1024, 'type': 'ridge'},
    'ridge_frequency_map': {'dim': 256, 'type': 'ridge'},
    'ridge_density': {'dim': 16, 'type': 'ridge'},
    'ridge_beads_log': {'dim': 128, 'type': 'ridge'},
    'ridge_minutiae': {'dim': 64, 'type': 'ridge'},
    
    # Shape
    'shape_hu_moments': {'dim': 7, 'type': 'shape'},
    'shape_zernike_moments': {'dim': 25, 'type': 'shape'},
    'shape_contour_features': {'dim': 20, 'type': 'shape'},
    
    # Edge/Gradient
    'edge_hog': {'dim': 3780, 'type': 'edge'},
    'edge_statistics': {'dim': 12, 'type': 'edge'},
    
    # Frequency
    'freq_fft_stats': {'dim': 32, 'type': 'frequency'},
    'freq_dct_coeffs': {'dim': 64, 'type': 'frequency'},
    
    # Keypoints
    'keypoint_orb': {'dim': 32000, 'type': 'keypoint', 'variable_length': True},
    'keypoint_akaze': {'dim': 61000, 'type': 'keypoint', 'variable_length': True},
}
```

**Deep Features (~50+):**

```python
DEEP_FEATURES = {
    # ResNet
    'resnet18_imagenet': {'dim': 512, 'type': 'deep_cnn'},
    'resnet34_imagenet': {'dim': 512, 'type': 'deep_cnn'},
    'resnet50_imagenet': {'dim': 2048, 'type': 'deep_cnn'},
    'resnet101_imagenet': {'dim': 2048, 'type': 'deep_cnn'},
    'resnet152_imagenet': {'dim': 2048, 'type': 'deep_cnn'},
    'resnext50_imagenet': {'dim': 2048, 'type': 'deep_cnn'},
    'resnext101_imagenet': {'dim': 2048, 'type': 'deep_cnn'},
    
    # EfficientNet
    'efficientnet_b0': {'dim': 1280, 'type': 'deep_cnn'},
    'efficientnet_b1': {'dim': 1280, 'type': 'deep_cnn'},
    'efficientnet_b2': {'dim': 1408, 'type': 'deep_cnn'},
    'efficientnet_b3': {'dim': 1536, 'type': 'deep_cnn'},
    'efficientnet_b4': {'dim': 1792, 'type': 'deep_cnn'},
    'efficientnet_b5': {'dim': 2048, 'type': 'deep_cnn'},
    'efficientnet_b6': {'dim': 2304, 'type': 'deep_cnn'},
    'efficientnet_b7': {'dim': 2560, 'type': 'deep_cnn'},
    
    # ConvNeXt
    'convnext_tiny': {'dim': 768, 'type': 'deep_cnn'},
    'convnext_small': {'dim': 768, 'type': 'deep_cnn'},
    'convnext_base': {'dim': 1024, 'type': 'deep_cnn'},
    'convnext_large': {'dim': 1536, 'type': 'deep_cnn'},
    
    # Vision Transformers
    'vit_tiny_patch16': {'dim': 192, 'type': 'transformer'},
    'vit_small_patch16': {'dim': 384, 'type': 'transformer'},
    'vit_base_patch16': {'dim': 768, 'type': 'transformer'},
    'vit_large_patch16': {'dim': 1024, 'type': 'transformer'},
    
    # Swin Transformer
    'swin_tiny': {'dim': 768, 'type': 'transformer'},
    'swin_small': {'dim': 768, 'type': 'transformer'},
    'swin_base': {'dim': 1024, 'type': 'transformer'},
    
    # Self-Supervised
    'dino_vits16': {'dim': 384, 'type': 'self_supervised'},
    'dino_vitb16': {'dim': 768, 'type': 'self_supervised'},
    'dino_resnet50': {'dim': 2048, 'type': 'self_supervised'},
    'mae_vit_base': {'dim': 768, 'type': 'self_supervised'},
    'moco_v3_vit_base': {'dim': 768, 'type': 'self_supervised'},
}
```

### Appendix B: Example Run Commands

**Basic Run:**

```bash
python scripts/run_experiment.py --config configs/experiments/baseline.yaml
```

**Resume from Checkpoint:**

```bash
python scripts/run_experiment.py \
    --config configs/experiments/baseline.yaml \
    --resume runs/exp_20260124_123456_baseline
```

**Run Specific Stages Only:**

```bash
python scripts/run_experiment.py \
    --config configs/experiments/baseline.yaml \
    --stages s05_classical_features,s06_deep_features
```

**Compare Experiments:**

```bash
python scripts/compare_experiments.py \
    --experiments exp_20260124_123456_baseline exp_20260124_234567_ridge_focus \
    --metrics top1_accuracy,top5_accuracy,tar_at_far_0.01 \
    --output comparison_report.html
```

### Appendix C: Hardware Recommendations

**Minimum Requirements:**
- CPU: 8 cores
- RAM: 32GB
- GPU: 8GB VRAM (e.g., RTX 3070)
- Storage: 500GB SSD

**Recommended for Large-Scale R&D:**
- CPU: 32+ cores (Threadripper / Xeon)
- RAM: 128GB
- GPU: 24GB+ VRAM (RTX 4090, A6000, V100)
- Storage: 2TB+ NVMe SSD
- Optional: Multiple GPUs for training

**Cloud Alternatives:**
- AWS: p3.2xlarge (1x V100) or p3.8xlarge (4x V100)
- GCP: n1-highmem-16 + 1x V100
- Azure: NC6s_v3 (1x V100)

### Appendix D: Estimated Execution Times

**For Dataset: 10,000 images, 1,000 cattle IDs**

| Stage | Estimated Time | Bottleneck |
|-------|----------------|------------|
| S01: Input | 5 min | Disk I/O |
| S02: Quality Analysis | 15 min | CPU |
| S03: Dataset Organization | 2 min | CPU |
| S04: ROI Extraction (SAM) | 45 min | GPU |
| S05: Classical Features | 60 min | CPU |
| S06: Deep Features (5 models) | 30 min | GPU |
| S07: Training (100 epochs) | 8 hours | GPU |
| S08: Fusion | 5 min | CPU/Memory |
| S09: Gallery | 2 min | CPU |
| S10: Indexing | 5 min | CPU/Memory |
| S11: Matching (1000 queries) | 10 min | GPU/Index |
| S12: Attribution | 15 min | CPU |
| S13: Evaluation | 10 min | CPU |
| S14: Visualization | 15 min | CPU |
| S15: Reporting | 5 min | CPU |
| S16: Tracking | 1 min | Disk I/O |

**Total (without training): ~3 hours**
**Total (with training): ~11 hours**

---

## 12. Design Decisions & Rationale

### Decision 1: Why Stage-Based Pipeline?

**Rationale:**
- **Modularity:** Each stage can be developed, tested, and debugged independently
- **Resumability:** Crash at any stage, resume from there
- **Flexibility:** Enable/disable stages per experiment
- **Artifact Preservation:** Intermediate results saved for inspection

**Alternative Considered:** End-to-end pipeline
**Rejected Because:** Difficult to debug, no intermediate inspection, full re-run on failure

---

### Decision 2: Why Config-Driven Over Code Changes?

**Rationale:**
- **Reproducibility:** Config file = complete specification
- **Experiment Velocity:** Change config, not code
- **Version Control:** Easy to diff configs
- **Non-Expert Friendly:** Researchers can run experiments without coding

**Alternative Considered:** Code-based experiment scripts
**Rejected Because:** Code changes = git pollution, hard to track what changed

---

### Decision 3: Why Feature Attribution Stage?

**Rationale:**
- **R&D Insight:** Understand WHICH features drive performance
- **Failure Analysis:** Know WHY system failed
- **Feature Selection:** Data-driven decision on which features to keep
- **Scientific Value:** Publishable insights

**Alternative Considered:** Black-box evaluation only
**Rejected Because:** No understanding, no improvement pathway

---

### Decision 4: Why Multi-Vector Gallery?

**Rationale:**
- **Robustness:** Multiple views of same cattle
- **Quality Tolerance:** Poor query can match good gallery image
- **Aging/Growth:** Capture cattle at different life stages

**Alternative Considered:** Single template per cattle
**Rejected Because:** Brittle, fails with pose/quality variation

---

### Decision 5: Why Separate Classical & Deep Features?

**Rationale:**
- **Complementary:** Classical captures domain-specific patterns (ridges)
- **Interpretability:** Classical features more explainable
- **Fallback:** When deep features fail, classical may work
- **Research:** Compare effectiveness

**Alternative Considered:** Deep features only
**Rejected Because:** Misses ridge patterns, less interpretable

---

### Decision 6: Why SQLite for Experiment Tracking?

**Rationale:**
- **Simplicity:** No server setup, single file
- **Sufficient:** Handles thousands of experiments easily
- **Portable:** Database file is portable
- **Upgradable:** Can migrate to PostgreSQL later if needed

**Alternative Considered:** JSON files, PostgreSQL, MongoDB
**Rejected Because:** JSON = no queries, PostgreSQL/MongoDB = overkill for start

---

### Decision 7: Why Offline ROI Preprocessing?

**Rationale:**
- **Reproducibility:** Same ROI in training and inference
- **Efficiency:** Extract once, use many times
- **Consistency:** Augmentation sees consistent ROI

**Alternative Considered:** Online ROI extraction during training
**Rejected Because:** Inconsistent, slow, non-reproducible

---

## 13. Future Enhancements

### Phase 2 Additions (Not in v1):

1. **Active Learning Module**
   - Sample uncertain cases for human review
   - Iteratively improve model

2. **Temporal Analysis**
   - Track cattle growth over time
   - Detect aging effects on features

3. **Multi-Modality**
   - Combine muzzle + body + gait
   - Sensor fusion (thermal, depth)

4. **Federated Learning Support**
   - Train across multiple farms without sharing data

5. **AutoML for Feature Selection**
   - Automatically find best feature combinations

6. **Real-Time Inference Mode**
   - Optimized for deployment
   - Edge device support

7. **Uncertainty Quantification**
   - Bayesian neural networks
   - Confidence calibration

---

## 14. Conclusion

This design specifies a **comprehensive, modular, R&D-focused cattle biometric platform** that:

✅ **Handles the full pipeline** from raw images to evaluation reports  
✅ **Supports systematic experimentation** via config-driven design  
✅ **Provides deep insights** via attribution analysis  
✅ **Ensures reproducibility** via versioning and tracking  
✅ **Scales efficiently** via parallelization  
✅ **Fails gracefully** via resumability and error handling  

**Key Innovation:** Feature attribution system that explains WHY matches succeed or fail - enabling data-driven R&D decisions.

**Engineering Philosophy:** Clean, modular, well-documented, maintainable - a platform that researchers will actually want to use.

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Design Complete - Ready for Implementation

---