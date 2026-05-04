# CRITICAL CLARIFICATIONS - Multi-Branch vs Single-Branch & Embedding Normalization

---

## **1. DO YOU NEED 4 BRANCHES? (Short Answer: NO for baseline)**

### **The Truth About Multi-Branch**

You're absolutely right to question this! Let me be very clear:

```
┌─────────────────────────────────────────────────────────────┐
│  THE GLOBAL BRANCH (ResNet50) ALREADY CAPTURES EVERYTHING   │
│                                                              │
│  ✓ Face structure                                           │
│  ✓ Muzzle patterns                                          │
│  ✓ Color information                                        │
│  ✓ Shape/contours                                           │
│  ✓ Horn configuration                                       │
│  ✓ Everything visible in the image                          │
└─────────────────────────────────────────────────────────────┘
```

### **Why I Showed Multi-Branch (But You Don't Need It Initially)**

**Multi-branch is an ADVANCED OPTIMIZATION for marginal gains**:

```
Single Global Branch (ResNet50):
  Top-1: 65-70%
  Top-5: 82-88%
  Top-20: 92-95%
  
  ✓ Simple
  ✓ Fast inference
  ✓ Proven to work
  ✓ Easier to debug
  ✓ 90% of systems use this

Multi-Branch (Global + Muzzle + Color + Shape):
  Top-1: 68-73% (+3-5% gain)
  Top-5: 85-90% (+3-5% gain)
  Top-20: 93-96% (+1-3% gain)
  
  ✗ 3-4× more complex
  ✗ 2-3× slower inference
  ✗ 3× model size
  ✗ Harder to tune
  ✗ Diminishing returns
```

### **When Each Branch Helps (Only if Single-Branch Plateaus)**

**The global branch is NOT equally good at everything**:

| Feature Type | Global Branch Quality | Benefit of Specialized Branch |
|--------------|----------------------|------------------------------|
| **Overall face structure** | ⭐⭐⭐⭐⭐ Excellent | ❌ None - global is sufficient |
| **Coarse color patterns** | ⭐⭐⭐⭐ Very good | 🟡 Marginal - color branch adds 1-2% |
| **Fine muzzle texture** | ⭐⭐⭐ Good | ✅ Moderate - muzzle branch adds 2-4% |
| **Geometric shape** | ⭐⭐ Moderate | ✅ Moderate - shape branch adds 2-3% |

**Why the difference?**
- **Global branch** learns to **average** attention across the whole face
- **Specialized branches** force focus on specific discriminative regions
- But the cost/benefit ratio is often not worth it

---

## **MY RECOMMENDATION: START WITH SINGLE-BRANCH**

### **Baseline System (Use This First)**

```
Input: Face ROI (224×224×3)
          ↓
   ResNet50 (pretrained ImageNet)
          ↓
   2048-dim feature vector
          ↓
   Projection Head:
     Linear(2048 → 1024) + ReLU + Dropout
     Linear(1024 → 512)
          ↓
   512-dim embedding
          ↓
   L2 Normalization (CRITICAL)
          ↓
   Final embedding (unit length)
          ↓
   Metric Learning Loss (SupCon / ArcFace)
```

**This captures ALL information you need:**
- Face structure ✓
- Muzzle patterns ✓
- Color information ✓
- Horn shape ✓
- Ear shape ✓
- Everything ✓

### **When to Consider Multi-Branch (Later Optimization)**

Only add branches if:

```
✅ Single-branch already working (Top-20 > 90%)
✅ You have compute budget for 3× slower inference
✅ You've exhausted other improvements:
   - Data quality
   - Augmentation tuning
   - Loss function choice
   - Freeze strategy
   - More training data
✅ You need that extra 2-5% accuracy badly
```

**Otherwise: DON'T**

The complexity is not worth it for most applications.

---

## **2. EMBEDDING SIZE & NORMALIZATION (Critical Concept)**

### **What Are Embeddings? (Clear Explanation)**

**Embeddings are vectors of real numbers**:

```python
# Example embedding (512-dimensional)
embedding = [
    0.234,    # dimension 0
   -1.567,    # dimension 1
    0.891,    # dimension 2
   -0.123,    # dimension 3
    ...       # ...
    0.445     # dimension 511
]

# Shape: [512]
# Each value: any real number (can be negative, positive, large, small)
```

### **Embedding Values BEFORE Normalization**

**After neural network (before normalization)**:
```python
# Values can be ANYTHING
raw_embedding = model(image)  # [512]

# Example values:
# [-45.2, 123.7, -0.003, 892.1, ..., -12.4]
#   ^^^^   ^^^^    ^^^^   ^^^^        ^^^^
#   Any range - depends on network activation
```

**Problem with raw embeddings**:
- Magnitude varies wildly between images
- Similarity computation is unstable
- Hard to set thresholds

### **Embedding Values AFTER L2 Normalization** ⭐

**L2 Normalization projects embedding onto unit sphere**:

```python
import torch.nn.functional as F

raw_embedding = model(image)  # [512], values anywhere

# L2 normalize
normalized_embedding = F.normalize(raw_embedding, p=2, dim=-1)

# NOW:
# - Vector length (L2 norm) = 1.0 EXACTLY
# - Individual dimensions still vary
# - Typical range per dimension: [-1, 1] but not bounded

# Example after normalization:
# [0.023, -0.156, 0.089, -0.012, ..., 0.045]
#   ^^^^    ^^^^   ^^^^    ^^^^        ^^^^
#   Small values, vector length = 1.0
```

**Check normalization**:
```python
length = torch.sqrt(torch.sum(normalized_embedding ** 2))
print(length)  # Output: 1.0000 (always)
```

### **Why Normalize? (Critical for Metric Learning)**

**Normalized embeddings make cosine similarity = dot product**:

```python
# WITHOUT normalization:
cosine_similarity = dot(emb1, emb2) / (norm(emb1) * norm(emb2))
# ↑ Expensive computation

# WITH normalization (both have norm=1):
cosine_similarity = dot(emb1, emb2)
# ↑ Just a dot product! Fast!

# Range: [-1, 1]
#  -1.0 = completely opposite
#   0.0 = orthogonal (unrelated)
#  +1.0 = identical
```

**Benefits of normalization**:
1. ✅ **Stable similarity**: Only direction matters, not magnitude
2. ✅ **Efficient computation**: Dot product instead of full cosine
3. ✅ **Better learning**: Gradient flow focuses on direction
4. ✅ **Consistent thresholds**: Same threshold works across batches

### **Similarity Values You'll See**

**After normalization, similarities range from -1 to +1**:

```
Same cattle (positive pairs):
  Similarity: 0.70 to 0.95
  ↑ High values = good discrimination

Different cattle (negative pairs):
  Similarity: -0.20 to +0.40
  ↑ Low values = good discrimination

Ideal scenario:
  SELF-SIM (same cattle):  ~0.85
  NEG-SIM (different):     ~0.25
  SIM GAP:                 ~0.60  (excellent!)
```

---

## **3. EMBEDDING DIMENSION SIZE (512 vs 256 vs 1024)**

### **What "512-dim" Means**

**NOT about value range (0-1 or 0-100)**:

```
512-dim embedding means:
  - Vector with 512 numbers
  - NOT that values are 0-512
  
Example:
  embedding_512 = [0.02, -0.15, 0.08, ..., 0.04]
                   ↑                        ↑
                   512 numbers total
```

### **Common Embedding Dimensions**

| Dimension | Use Case | Trade-off |
|-----------|----------|-----------|
| 128-dim | Very fast, edge devices | ⚠️ May lose discriminability with >50K IDs |
| 256-dim | Fast, good balance | ✅ Good for <100K IDs |
| **512-dim** | **Standard choice** | ✅ **Recommended for your 68K cattle** |
| 1024-dim | Very high capacity | ⚠️ Slower, may overfit on small data |
| 2048-dim | Extreme cases | ❌ Usually overkill |

### **For Your 90K Images / 68K Cattle: Use 512-dim**

```python
model_config = {
    "backbone": "resnet50",
    "backbone_output": 2048,  # ResNet50 final layer
    
    "projection_head": [
        ("linear", 2048, 1024),
        ("relu",),
        ("dropout", 0.1),
        ("linear", 1024, 512),  # ← Final embedding dimension
    ],
    
    "embedding_dim": 512,  # ← This is what you care about
    "normalize": True      # ← ALWAYS True for metric learning
}
```

---

## **4. COMPLETE EMBEDDING PIPELINE (Single-Branch)**

### **Step-by-Step: Image → Embedding**

```
Input Image (224×224×3)
        ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BACKBONE (ResNet50)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ↓
   Feature Map (7×7×2048)
        ↓
   Global Average Pool
        ↓
   2048-dim feature vector
   Values: [-10, 50, -3, ..., 25]
   ↑ Raw activations, any range
        ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROJECTION HEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ↓
   Linear(2048 → 1024)
        ↓
   ReLU
   Values: [0, 35, 0, ..., 12]
   ↑ All non-negative (ReLU)
        ↓
   Dropout(0.1)
        ↓
   Linear(1024 → 512)
        ↓
   512-dim raw embedding
   Values: [-5.2, 18.3, -0.7, ..., 9.1]
   ↑ Any range, variable magnitude
        ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   L2 NORMALIZATION (CRITICAL!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ↓
   normalized_embedding = raw_embedding / ||raw_embedding||
        ↓
   512-dim NORMALIZED embedding
   Values: [0.023, -0.156, 0.089, ..., 0.045]
   ↑ Each value typically in [-1, 1]
   ↑ Vector length = 1.0 EXACTLY
        ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   METRIC LEARNING LOSS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Compute similarity matrix
   (all dot products, since normalized)
        ↓
   SupCon / ArcFace / ProxyAnchor loss
        ↓
   Backpropagation
```

### **PyTorch Implementation (Single-Branch)**

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.models import resnet50

class CattleFaceEmbedder(nn.Module):
    """
    Single-branch face embedder.
    Simple, effective, standard architecture.
    """
    def __init__(self, embedding_dim=512, pretrained=True, dropout=0.1):
        super().__init__()
        
        # Backbone
        self.backbone = resnet50(pretrained=pretrained)
        backbone_output_dim = self.backbone.fc.in_features  # 2048
        
        # Remove original FC layer
        self.backbone.fc = nn.Identity()
        
        # Projection head
        self.projection = nn.Sequential(
            nn.Linear(backbone_output_dim, 1024),
            nn.ReLU(inplace=True),
            nn.Dropout(dropout),
            nn.Linear(1024, embedding_dim)
        )
        
        self.embedding_dim = embedding_dim
        
    def forward(self, x):
        """
        Args:
            x: [batch_size, 3, 224, 224]
        
        Returns:
            embeddings: [batch_size, embedding_dim], L2-normalized
        """
        # Backbone
        features = self.backbone(x)  # [batch_size, 2048]
        
        # Projection
        embeddings = self.projection(features)  # [batch_size, 512]
        
        # L2 normalize (CRITICAL!)
        embeddings = F.normalize(embeddings, p=2, dim=1)
        
        return embeddings

# Usage
model = CattleFaceEmbedder(embedding_dim=512, pretrained=True)

# Forward pass
images = torch.randn(32, 3, 224, 224)  # Batch of 32 images
embeddings = model(images)  # [32, 512], L2-normalized

# Check normalization
norms = torch.norm(embeddings, p=2, dim=1)
print(norms)  # [1.0, 1.0, 1.0, ..., 1.0] (all exactly 1.0)

# Compute similarities
similarity_matrix = torch.mm(embeddings, embeddings.T)  # [32, 32]
# Values range from -1 to +1
```

---

## **5. FINAL ARCHITECTURE RECOMMENDATION**

### **For Your 90K Dataset / 68K Cattle**

```yaml
# model_config.yaml

model:
  architecture: "single_branch"  # NOT multi-branch
  
  backbone:
    type: "resnet50"
    pretrained: true
    source: "imagenet"
    
  projection_head:
    layers:
      - type: "linear"
        in_features: 2048
        out_features: 1024
      - type: "relu"
      - type: "dropout"
        p: 0.1
      - type: "linear"
        in_features: 1024
        out_features: 512
        
  embedding:
    dimension: 512  # ← Your embedding size
    normalize: true  # ← ALWAYS true for metric learning
    
  loss:
    type: "supervised_contrastive"  # or "arcface_proxy"
    temperature: 0.07
```

### **Expected Performance (Single-Branch)**

With proper training:
```
Validation (17K images, 13K cattle):
  Top-1:   65-70%
  Top-5:   82-88%
  Top-10:  90-94%
  Top-20:  94-96%
  
Test (separate dataset):
  Top-1:   63-68%
  Top-5:   80-86%
  Top-10:  88-92%
  Top-20:  92-95%
```

**This is EXCELLENT performance for one-shot cattle biometrics!**

---

## **6. WHEN TO ADD MULTI-BRANCH (Decision Tree)**

```
START HERE: Single-branch ResNet50 (512-dim, normalized)
     ↓
Train for 100 epochs
     ↓
Evaluate on validation
     ↓
     ├─ Top-20 > 90%? ───→ ✅ SUCCESS! Deploy single-branch
     │                      (Multi-branch not worth the complexity)
     ↓
     ├─ Top-20 = 85-90%? ──→ 🟡 Try these FIRST:
     │                        - Better augmentation
     │                        - Different loss (SupCon → ArcFace)
     │                        - Progressive unfreezing
     │                        - More epochs
     │                        - Collect 2-3 images per cattle
     ↓
     ├─ Still < 90% after above? ──→ 🟡 Consider multi-branch
     │                                  (But expect only +2-5% gain)
     ↓
     └─ Top-20 < 85%? ──→ ⚠️ DATA QUALITY ISSUE
                            Multi-branch won't help
                            Fix:
                            - Improve ROI (SAM quality)
                            - Filter low-quality images
                            - Check for label errors
```

---

## **7. SUMMARY - CLEAR ANSWERS**

### **Q1: Do I need 4 branches if global branch captures everything?**

**A: NO, you don't need 4 branches.**

- Global branch (ResNet50) **does** capture all information
- Multi-branch is for **marginal optimization** (+2-5% gain)
- Start with **single-branch** (simpler, faster, sufficient)
- Only consider multi-branch if single-branch plateaus above 90% Top-20

### **Q2: What is embedding size? Is it 0-1 or 0-100?**

**A: Embedding "size" = number of dimensions (512), NOT value range.**

- **512-dim** = vector with 512 numbers
- Values **after normalization**: typically in [-1, 1] per dimension
- Vector length: **exactly 1.0** (unit sphere)
- **NOT** bounded to 0-1 or 0-100

### **Q3: Should I normalize embeddings?**

**A: YES, ALWAYS normalize in metric learning.**

```python
# Always do this:
embeddings = F.normalize(embeddings, p=2, dim=1)

# Benefits:
# ✓ Stable similarity computation
# ✓ Cosine similarity = dot product (fast)
# ✓ Better learning dynamics
# ✓ Standard practice in biometric systems
```

### **Q4: Can I change embedding dimension?**

**A: Yes, but 512 is recommended for your scale.**

| Your Dataset | Recommended Dim |
|--------------|-----------------|
| 68K cattle, 90K images | **512-dim** ✅ |

Alternatives:
- 256-dim: Faster, but may lose discriminability
- 1024-dim: More capacity, but slower and may overfit

---

## **8. FINAL SYSTEM RECOMMENDATION (SIMPLIFIED)**

### **Use This Architecture (Clean & Proven)**

```
Face ROI Input (224×224×3)
         ↓
    ResNet50 Backbone
    (ImageNet pretrained)
         ↓
    2048-dim features
         ↓
    Projection Head:
      Linear(2048 → 1024)
      ReLU
      Dropout(0.1)
      Linear(1024 → 512)
         ↓
    512-dim embedding
         ↓
    L2 Normalize ← CRITICAL!
         ↓
    Final embedding (length=1.0)
         ↓
    Supervised Contrastive Loss
    (or ArcFace Proxy)
```

**This single-branch architecture is:**
- ✅ Simple to implement
- ✅ Fast inference (~20ms per image)
- ✅ Proven effective (used in production systems)
- ✅ Captures ALL face information (muzzle, color, shape, horns)
- ✅ Sufficient for 65-70% Top-1, 94-96% Top-20

**Multi-branch is optional future optimization if you need +3-5% more accuracy and have compute budget.**

---

**Does this clarify the architecture and normalization? Should I provide the complete training code for single-branch system?**


# COMPLETE PRODUCTION-GRADE CATTLE FACE BIOMETRIC SYSTEM
## Full Architecture with Sample Folders, Augmentation Gallery, and Multi-Branch Feature Extraction

---

# TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Complete Directory Structure](#complete-directory-structure)
3. [Stage 0: Initial Setup](#stage-0-initial-setup)
4. [Stage 1: Data Quality Analysis](#stage-1-data-quality-analysis)
5. [Stage 2: Face ROI Preprocessing (SAM)](#stage-2-face-roi-preprocessing)
6. [Stage 3: Augmentation System](#stage-3-augmentation-system)
7. [Stage 4: Train/Val Split](#stage-4-trainval-split)
8. [Stage 5: Training System](#stage-5-training-system)
9. [Stage 6: Multi-Branch Architecture](#stage-6-multi-branch-architecture)
10. [Stage 7: Evaluation & Metrics](#stage-7-evaluation-metrics)
11. [Stage 8: Vector Database Build](#stage-8-vector-database-build)
12. [Stage 9: Test Evaluation](#stage-9-test-evaluation)
13. [Resume Capabilities](#resume-capabilities)
14. [Dynamic Recommendations Engine](#dynamic-recommendations-engine)
15. [Monitoring & Visualization](#monitoring-visualization)

---

# 1. SYSTEM OVERVIEW

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    RAW DATASET (90K Images)                      │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: DATA QUALITY ANALYSIS (First - Critical)              │
│  - Extract cattle IDs from folders/filenames                    │
│  - Resolution, blur, exposure, contrast analysis                │
│  - Face detection confidence                                    │
│  - Quality scoring and bucketing                                │
│  Output: quality_report.xlsx, recommendations.json              │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
                    DECISION POINT
                  ┌────────┴────────┐
                  ↓                 ↓
         High Quality        Low/Mixed Quality
         Skip Heavy          Enable Heavy
         Preprocessing       Preprocessing
                  └────────┬────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: FACE ROI PREPROCESSING (SAM - Offline)                │
│  - Segment face/head region                                     │
│  - Remove background, ropes, hands                              │
│  - Generate verification samples                                │
│  - Cache masks + processed images                               │
│  Output: processed_dataset/, sam_report.json                    │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: AUGMENTATION GALLERY GENERATION                        │
│  - Generate sample folders for ALL augmentations                │
│  - Visual verification of augmentation effects                  │
│  - Parameter tuning based on dataset                            │
│  Output: augmentation_samples/                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: TRAIN/VAL SPLIT (Dynamic Based on Analysis)           │
│  - Stratified by cattle_id                                      │
│  - Balance quality across splits                                │
│  Output: train_manifest.csv, val_manifest.csv                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: TRAINING (Multi-Branch with Resume)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  INPUT: Face ROI Image                                    │  │
│  └─────────────────────┬────────────────────────────────────┘  │
│           ┌────────────┼────────────┬──────────────┐            │
│           ↓            ↓            ↓              ↓            │
│      Global Face   Muzzle      Color/Pattern   Shape/          │
│      (ResNet50)    Attention   Branch          Structure       │
│           ↓            ↓            ↓              ↓            │
│       512-dim      256-dim      128-dim        128-dim         │
│           └────────────┼────────────┴──────────────┘            │
│                        ↓                                        │
│                  Fusion Layer                                   │
│                        ↓                                        │
│               Final Embedding (512-dim)                         │
│                        ↓                                        │
│          Metric Learning Loss (SupCon/ArcFace)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: VALIDATION & MODEL SELECTION                          │
│  - Top-1/5/10/20 evaluation                                     │
│  - SELF-SIM, NEG-SIM, SIM-GAP tracking                         │
│  - Robustness diagnostics                                       │
│  - Model comparison scorecard                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 7: VECTOR DATABASE BUILD (100% Dataset)                  │
│  - Extract embeddings from ALL 90K images                       │
│  - Build FAISS index                                            │
│  - Store metadata                                               │
│  Output: cattle_face_gallery/                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8: TEST EVALUATION (Final Reporting Only)                │
│  - Load test dataset                                            │
│  - Extract cattle IDs (folder/filename)                         │
│  - Query against gallery                                        │
│  - Generate final report                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

# 2. COMPLETE DIRECTORY STRUCTURE

```
cattle_biometric_system/
│
├── config/
│   ├── base_config.yaml
│   ├── roi_config.yaml
│   ├── augmentation_config.yaml
│   ├── training_config.yaml
│   ├── model_config.yaml
│   └── evaluation_config.yaml
│
├── data/
│   ├── raw/
│   │   └── cattle_90k/                    # Original 90K images
│   │       ├── FDETIBU17875/
│   │       │   └── image.jpg
│   │       ├── FDETIBU18219/
│   │       │   ├── image1.jpg
│   │       │   └── image2.jpg
│   │       └── [other cattle folders or flat files]
│   │
│   ├── processed/
│   │   ├── face_roi_v1/                   # SAM processed faces
│   │   │   ├── images/                    # Background removed/replaced
│   │   │   │   ├── FDETIBU17875_face.jpg
│   │   │   │   └── ...
│   │   │   ├── masks/                     # Binary masks
│   │   │   │   ├── FDETIBU17875_mask.png
│   │   │   │   └── ...
│   │   │   └── metadata.csv
│   │   │
│   │   └── preprocessed_enhanced/         # If heavy preprocessing needed
│   │       └── ...
│   │
│   ├── splits/
│   │   ├── train_manifest.csv
│   │   ├── val_manifest.csv
│   │   └── split_info.json
│   │
│   └── test/
│       └── test_dataset/                  # Separate test images
│
├── analysis/
│   ├── 01_quality_analysis/
│   │   ├── dataset_inventory.csv          # All images catalogued
│   │   ├── quality_scores.csv             # Per-image quality metrics
│   │   ├── cattle_id_distribution.csv     # Images per cattle
│   │   ├── resolution_stats.csv
│   │   ├── quality_summary.xlsx           # Multi-sheet report
│   │   ├── histograms/
│   │   │   ├── resolution_distribution.png
│   │   │   ├── blur_score_distribution.png
│   │   │   ├── exposure_distribution.png
│   │   │   ├── contrast_distribution.png
│   │   │   ├── aspect_ratio_distribution.png
│   │   │   └── images_per_cattle.png
│   │   ├── samples_gallery/
│   │   │   ├── excellent_quality_16grid.jpg
│   │   │   ├── good_quality_16grid.jpg
│   │   │   ├── borderline_quality_16grid.jpg
│   │   │   ├── poor_quality_16grid.jpg
│   │   │   └── rejected_samples.jpg
│   │   ├── dataset_readiness_report.json
│   │   └── preprocessing_recommendations.json
│   │
│   ├── 02_face_content_analysis/
│   │   ├── face_detection_confidence.csv
│   │   ├── view_orientation_distribution.csv  # frontal/oblique/lateral
│   │   ├── horn_presence_stats.csv
│   │   ├── rope_halter_detection.csv
│   │   ├── eye_visibility_stats.csv
│   │   ├── muzzle_visibility_stats.csv
│   │   └── content_analysis_report.json
│   │
│   └── 03_roi_quality_analysis/
│       ├── sam_success_rate.csv
│       ├── mask_area_ratio_distribution.csv
│       ├── face_completeness_scores.csv
│       ├── horn_inclusion_rate.csv
│       ├── rope_removal_success_rate.csv
│       └── roi_quality_report.json
│
├── verification/
│   ├── sam_face_segmentation/
│   │   ├── random_samples/                # Random representative samples
│   │   │   ├── cattle_12345/
│   │   │   │   ├── step1_original.jpg
│   │   │   │   ├── step2_sam_all_proposals.jpg
│   │   │   │   ├── step3_face_candidates.jpg
│   │   │   │   ├── step4_selected_mask.jpg
│   │   │   │   ├── step5_mask_overlay.jpg
│   │   │   │   ├── step6_final_processed.jpg
│   │   │   │   ├── step7_feature_check.jpg    # Eyes, muzzle, horns marked
│   │   │   │   └── metadata.json
│   │   │   └── [99 more cattle samples]
│   │   │
│   │   ├── best_cases/                    # High quality segmentations
│   │   │   └── [50 samples]
│   │   │
│   │   ├── worst_cases/                   # Failed/poor segmentations
│   │   │   └── [50 samples]
│   │   │
│   │   ├── edge_cases/                    # Challenging scenarios
│   │   │   ├── multiple_cattle/
│   │   │   ├── heavy_rope_occlusion/
│   │   │   ├── extreme_angles/
│   │   │   ├── partial_face_visible/
│   │   │   └── blur_motion/
│   │   │
│   │   ├── by_view_angle/
│   │   │   ├── frontal_view/              # 0-20° yaw
│   │   │   │   └── [20 samples with steps]
│   │   │   ├── oblique_view/              # 20-50° yaw
│   │   │   │   └── [20 samples with steps]
│   │   │   └── lateral_view/              # 50-90° yaw (profile)
│   │   │       └── [20 samples with steps]
│   │   │
│   │   ├── horn_analysis/
│   │   │   ├── full_horn_capture/
│   │   │   ├── partial_horn_cases/
│   │   │   ├── asymmetric_horns/
│   │   │   ├── horn_tip_cutoff/
│   │   │   └── no_horn_breeds/
│   │   │
│   │   ├── rope_removal_verification/
│   │   │   ├── rope_on_muzzle_removed/
│   │   │   ├── halter_removed/
│   │   │   ├── rope_partial_removal/
│   │   │   └── rope_removal_failed/
│   │   │
│   │   ├── comparison_grids/
│   │   │   ├── quality_comparison_16grid.jpg
│   │   │   ├── angle_comparison_16grid.jpg
│   │   │   ├── breed_comparison_16grid.jpg
│   │   │   └── lighting_comparison_16grid.jpg
│   │   │
│   │   └── sam_verification_report.pdf
│   │
│   └── augmentation_gallery/              # COMPLETE AUGMENTATION SAMPLES
│       ├── original_samples/              # 20 diverse face samples
│       │   ├── sample_001_frontal_excellent.jpg
│       │   ├── sample_002_oblique_good.jpg
│       │   └── ...
│       │
│       ├── photometric/
│       │   ├── brightness/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── bright_+0.1.jpg
│       │   │   │   ├── bright_+0.2.jpg
│       │   │   │   ├── bright_+0.3.jpg
│       │   │   │   ├── bright_-0.1.jpg
│       │   │   │   ├── bright_-0.2.jpg
│       │   │   │   ├── bright_-0.3.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── contrast/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── contrast_0.7.jpg
│       │   │   │   ├── contrast_0.85.jpg
│       │   │   │   ├── contrast_1.0.jpg
│       │   │   │   ├── contrast_1.15.jpg
│       │   │   │   ├── contrast_1.3.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── saturation/
│       │   │   └── [similar structure]
│       │   │
│       │   ├── hue_shift/
│       │   │   └── [similar structure]
│       │   │
│       │   ├── gamma/
│       │   │   └── [similar structure]
│       │   │
│       │   └── combined_photometric/
│       │       └── [realistic combinations]
│       │
│       ├── geometric/
│       │   ├── rotation/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── rotate_-15deg.jpg
│       │   │   │   ├── rotate_-10deg.jpg
│       │   │   │   ├── rotate_-5deg.jpg
│       │   │   │   ├── rotate_+5deg.jpg
│       │   │   │   ├── rotate_+10deg.jpg
│       │   │   │   ├── rotate_+15deg.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── crop_scale/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── crop_0.80_scale.jpg
│       │   │   │   ├── crop_0.85_scale.jpg
│       │   │   │   ├── crop_0.90_scale.jpg
│       │   │   │   ├── crop_0.95_scale.jpg
│       │   │   │   ├── crop_1.00_scale.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── perspective/
│       │   │   └── [similar structure]
│       │   │
│       │   ├── affine/
│       │   │   └── [similar structure]
│       │   │
│       │   ├── horizontal_flip/
│       │   │   └── [before/after comparisons]
│       │   │
│       │   └── combined_geometric/
│       │       └── [realistic combinations]
│       │
│       ├── degradation/
│       │   ├── gaussian_blur/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── blur_kernel3.jpg
│       │   │   │   ├── blur_kernel5.jpg
│       │   │   │   ├── blur_kernel7.jpg
│       │   │   │   ├── blur_kernel9.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── motion_blur/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── motion_horizontal.jpg
│       │   │   │   ├── motion_vertical.jpg
│       │   │   │   ├── motion_diagonal.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── jpeg_compression/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── jpeg_quality_90.jpg
│       │   │   │   ├── jpeg_quality_75.jpg
│       │   │   │   ├── jpeg_quality_60.jpg
│       │   │   │   ├── jpeg_quality_40.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── gaussian_noise/
│       │   │   └── [similar structure]
│       │   │
│       │   └── combined_degradation/
│       │       └── [realistic combinations]
│       │
│       ├── background/
│       │   ├── background_replacement/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── bg_replace_outdoor1.jpg
│       │   │   │   ├── bg_replace_outdoor2.jpg
│       │   │   │   ├── bg_replace_barn1.jpg
│       │   │   │   ├── bg_replace_barn2.jpg
│       │   │   │   ├── bg_replace_neutral.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── background_blur/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── bg_blur_kernel15.jpg
│       │   │   │   ├── bg_blur_kernel21.jpg
│       │   │   │   ├── bg_blur_kernel31.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   └── background_keep_original/
│       │       └── [for comparison]
│       │
│       ├── occlusion/
│       │   ├── cutout/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── cutout_1hole.jpg
│       │   │   │   ├── cutout_2holes.jpg
│       │   │   │   ├── cutout_small_patches.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   └── random_erasing/
│       │       └── [similar structure]
│       │
│       ├── combined_augmentations/
│       │   ├── mild_augmentation/
│       │   │   ├── sample_001/
│       │   │   │   ├── original.jpg
│       │   │   │   ├── mild_combo_1.jpg
│       │   │   │   ├── mild_combo_2.jpg
│       │   │   │   ├── mild_combo_3.jpg
│       │   │   │   └── comparison_grid.jpg
│       │   │   └── [other samples]
│       │   │
│       │   ├── moderate_augmentation/
│       │   │   └── [similar structure]
│       │   │
│       │   ├── strong_augmentation/
│       │   │   └── [similar structure]
│       │   │
│       │   └── realistic_training_samples/
│       │       ├── sample_001_with_8_views/
│       │       │   ├── view_1.jpg
│       │       │   ├── view_2.jpg
│       │       │   ├── view_3.jpg
│       │       │   ├── view_4.jpg
│       │       │   ├── view_5.jpg
│       │       │   ├── view_6.jpg
│       │       │   ├── view_7.jpg
│       │       │   ├── view_8.jpg
│       │       │   └── 8view_grid.jpg
│       │       └── [other samples]
│       │
│       ├── adaptive_augmentation_examples/
│       │   ├── high_quality_image_augmentation/
│       │   ├── low_quality_image_augmentation/
│       │   ├── small_resolution_augmentation/
│       │   └── large_resolution_augmentation/
│       │
│       ├── augmentation_statistics.json     # Applied probabilities
│       └── augmentation_verification_report.pdf
│
├── models/
│   ├── pretrained/
│   │   ├── resnet50_imagenet.pth
│   │   ├── efficientnet_b2_imagenet.pth
│   │   └── mobilenet_v3_imagenet.pth
│   │
│   ├── trained/
│   │   ├── run_001_resnet50_supcon/
│   │   │   ├── config_snapshot.yaml
│   │   │   ├── model_architecture.txt
│   │   │   ├── trainable_params_report.txt
│   │   │   ├── freeze_strategy.json
│   │   │   ├── checkpoints/
│   │   │   │   ├── epoch_001.pth
│   │   │   │   ├── epoch_005.pth
│   │   │   │   ├── epoch_010.pth
│   │   │   │   ├── last.pth
│   │   │   │   └── best.pth
│   │   │   ├── metrics/
│   │   │   │   ├── train_metrics.csv
│   │   │   │   ├── val_metrics.csv
│   │   │   │   ├── embedding_health.csv
│   │   │   │   └── robustness_scores.csv
│   │   │   ├── logs/
│   │   │   │   ├── training.log
│   │   │   │   └── tensorboard/
│   │   │   └── model_card.json
│   │   │
│   │   └── [other training runs]
│   │
│   └── final/
│       └── best_model_package/
│           ├── model.pth
│           ├── config.yaml
│           ├── preprocessing_signature.json
│           ├── dataset_version.txt
│           └── model_card.pdf
│
├── experiments/
│   ├── benchmark_001/
│   │   ├── experiment_plan.yaml
│   │   ├── runs/
│   │   │   ├── resnet50_supcon/
│   │   │   ├── resnet50_arcface/
│   │   │   ├── efficientnet_supcon/
│   │   │   └── mobilenet_supcon/
│   │   ├── comparison_report.xlsx
│   │   ├── pareto_plots/
│   │   └── final_recommendation.pdf
│   │
│   └── [other experiments]
│
├── gallery/
│   └── face_embeddings_v1/
│       ├── embeddings/
│       │   ├── embeddings_batch_000.npy    # Chunked for memory
│       │   ├── embeddings_batch_001.npy
│       │   └── ...
│       ├── mappings/
│       │   ├── index_to_image_id.csv
│       │   ├── index_to_cattle_id.csv
│       │   ├── cattle_id_to_indices.json
│       │   └── image_paths.csv
│       ├── metadata/
│       │   ├── face_quality_scores.csv
│       │   ├── muzzle_clarity.csv
│       │   ├── roi_area_ratios.csv
│       │   ├── view_orientations.csv
│       │   └── preprocessing_info.csv
│       ├── index/
│       │   ├── faiss_flat.index            # Exact search
│       │   ├── faiss_ivf.index             # Fast approximate
│       │   └── index_config.json
│       ├── model_info/
│       │   ├── model_checkpoint_used.txt
│       │   ├── preprocessing_signature.json
│       │   └── roi_strategy.json
│       └── gallery_statistics.json
│
├── evaluation/
│   ├── validation/
│   │   ├── synthetic_probes/
│   │   ├── val_results.json
│   │   ├── topk_metrics.csv
│   │   ├── cmc_curve_data.csv
│   │   ├── hard_negatives.csv
│   │   └── confusion_analysis/
│   │
│   └── test/
│       ├── test_results.json
│       ├── test_topk_metrics.csv
│       ├── test_cmc_curve_data.csv
│       ├── known_cattle_results.csv
│       ├── unknown_cattle_results.csv
│       └── final_test_report.pdf
│
├── reports/
│   ├── 01_dataset_quality_report/
│   │   ├── dataset_quality_report.pdf
│   │   └── dataset_quality_report.xlsx
│   │
│   ├── 02_roi_verification_report/
│   │   └── roi_verification_report.pdf
│   │
│   ├── 03_augmentation_report/
│   │   └── augmentation_verification_report.pdf
│   │
│   ├── 04_training_reports/
│   │   └── [per-run reports]
│   │
│   ├── 05_benchmark_report/
│   │   └── model_comparison_benchmark.pdf
│   │
│   ├── 06_gallery_build_report/
│   │   └── vector_database_report.pdf
│   │
│   └── 07_final_test_report/
│       └── final_test_evaluation_report.pdf
│
├── visualization/
│   ├── training_curves/
│   ├── embedding_space_projections/
│   ├── confusion_matrices/
│   └── live_dashboard/
│       └── dashboard.html
│
└── scripts/
    ├── 01_data_quality_analysis.py
    ├── 02_roi_preprocessing.py
    ├── 03_augmentation_gallery_generator.py
    ├── 04_train_val_split.py
    ├── 05_train.py
    ├── 06_evaluate.py
    ├── 07_build_gallery.py
    ├── 08_test_evaluation.py
    └── utils/
```

---

# 3. STAGE 0: INITIAL SETUP

## Configuration Files

### **base_config.yaml**
```yaml
project:
  name: "cattle_face_biometrics"
  version: "1.0.0"
  description: "90K cattle face identification system"
  
paths:
  raw_data: "data/raw/cattle_90k/"
  processed_data: "data/processed/"
  analysis: "analysis/"
  verification: "verification/"
  models: "models/"
  gallery: "gallery/"
  reports: "reports/"
  
hardware:
  device: "cuda"  # auto-detect GPU
  num_gpus: 1     # or multi-GPU
  num_workers: 16  # CPU threads for data loading
  pin_memory: true
  prefetch_factor: 2
  
reproducibility:
  seed: 42
  deterministic: true
  benchmark: false  # for reproducibility
```

### **roi_config.yaml**
```yaml
roi:
  strategy: "face_head_sam"
  
  target_region:
    include:
      - face
      - muzzle
      - eyes
      - nose
      - mouth
      - horns
      - ears
      - forehead
    exclude:
      - body
      - legs
      - tail
      - full_neck
      - background
      - ropes_halters
      - human_hands
      - equipment
  
  sam:
    model_type: "vit_h"  # vit_h, vit_l, vit_b
    checkpoint: "models/pretrained/sam_vit_h_4b8939.pth"
    device: "cuda"
    
  face_detection:
    min_area_ratio: 0.10
    max_area_ratio: 0.60
    aspect_ratio_min: 0.6
    aspect_ratio_max: 1.8
    prefer_upper_frame: true
    centeredness_weight: 0.3
    
  mask_selection:
    prefer_largest: true
    prefer_centered: true
    require_compactness: 0.5  # convexity ratio
    
  quality_requirements:
    require_muzzle_visible: true
    require_eyes_visible: false  # angle-dependent
    min_completeness_score: 0.6
    
  horn_handling:
    include_full_horns: true
    extend_to_tips: true
    horn_completeness_threshold: 0.8
    
  rope_removal:
    enabled: true
    detection_method: "color_texture"
    color_range_lower: [50, 100, 50]   # HSV
    color_range_upper: [150, 255, 255]
    erode_margin: 5  # pixels
    
  post_processing:
    fill_holes: true
    smooth_edges: true
    edge_smoothing_kernel: 7
    morphological_closing: true
    closing_kernel: 5
    
  fallback:
    strategy: "center_crop_with_blur"
    blur_background_kernel: 31
    
  output:
    save_masks: true
    save_processed_images: true
    mask_format: "png"
    image_format: "jpg"
    image_quality: 95
    
  verification:
    enabled: true
    sample_counts:
      random: 100
      best: 50
      worst: 50
      edge_cases: 50
    output_dir: "verification/sam_face_segmentation/"
    generate_step_by_step: true
    generate_grids: true
```

---

# 4. STAGE 1: DATA QUALITY ANALYSIS

## Process Flow

```
Raw 90K Images
      ↓
1. Scan Dataset
   - Parse folder/filename structure
   - Extract cattle IDs
   - Detect duplicates
   - Check file integrity
      ↓
2. Compute Image Statistics
   - Resolution (W, H, min-side, megapixels)
   - Aspect ratio
   - File size
   - Format
      ↓
3. Quality Metrics per Image
   - Blur score (Laplacian variance)
   - Brightness (mean pixel value)
   - Exposure (histogram analysis)
   - Contrast (std of pixel values)
   - Noise estimation
   - Sharpness proxy
      ↓
4. Content Analysis
   - Face detection confidence
   - Subject centering
   - Edge density
   - Color vs grayscale
   - Rope/halter presence (color patterns)
   - Multiple subjects detection
      ↓
5. Quality Bucketing
   EXCELLENT | GOOD | BORDERLINE | POOR | REJECT
      ↓
6. Generate Reports & Recommendations
```

## Output Files

### **dataset_inventory.csv**
```csv
image_id,cattle_id,file_path,width,height,min_side,aspect_ratio,megapixels,file_size_kb,format,md5_hash,phash,duplicate_of,corrupt
IMG_00001,FDETIBU17875,data/raw/cattle_90k/FDETIBU17875/image.jpg,1920,1080,1080,1.78,2.07,456,jpg,abc123...,def456...,,,false
IMG_00002,FDETIBU18219,data/raw/cattle_90k/FDETIBU18219_facePic.jpg,2048,1536,1536,1.33,3.15,678,jpg,ghi789...,jkl012...,,,false
...
```

### **quality_scores.csv**
```csv
image_id,cattle_id,blur_score,brightness,exposure_score,contrast,noise_estimate,sharpness,face_detected,face_confidence,rope_detected,quality_bucket
IMG_00001,FDETIBU17875,145.2,128,0.82,52.3,12.5,0.88,true,0.95,false,EXCELLENT
IMG_00002,FDETIBU18219,87.3,142,0.75,48.1,18.7,0.72,true,0.88,true,GOOD
IMG_00003,FDETIBU20005,42.8,95,0.45,31.2,25.3,0.51,true,0.62,false,POOR
...
```

### **cattle_id_distribution.csv**
```csv
cattle_id,image_count,quality_excellent,quality_good,quality_borderline,quality_poor,avg_resolution,avg_blur_score
FDETIBU17875,1,1,0,0,0,1080,145.2
FDETIBU18219,2,1,1,0,0,1536,98.5
FDETIBU20005,3,0,1,1,1,1280,65.4
...
```

### **quality_summary.xlsx**

**Sheet 1: Overview**
| Metric | Value |
|--------|-------|
| Total images found | 90,000 |
| Cattle ID extraction success | 89,856 (99.84%) |
| Extraction failures | 144 (0.16%) |
| Unique cattle IDs | 68,432 |
| Images per cattle (mean) | 1.31 |
| Images per cattle (median) | 1 |
| Cattle with 1 image | 52,108 (76.1%) |
| Cattle with 2-3 images | 14,221 (20.8%) |
| Cattle with 4+ images | 2,103 (3.1%) |
| Duplicate images (exact) | 156 |
| Near-duplicate images | 423 |
| Corrupt/unreadable | 87 |
| Total usable images | 89,334 |

**Sheet 2: Resolution Statistics**
| Metric | Value |
|--------|-------|
| Min side < 120px | 234 (0.26%) |
| Min side < 224px | 1,567 (1.75%) |
| Min side < 512px | 8,923 (9.98%) |
| Min side ≥ 512px | 80,411 (89.98%) |
| Mean resolution | 1456 × 1092 |
| Median resolution | 1280 × 960 |
| Most common aspect ratio | 4:3 (43.2%) |

**Sheet 3: Quality Distribution**
| Quality Bucket | Count | Percentage |
|----------------|-------|------------|
| EXCELLENT | 28,765 | 32.2% |
| GOOD | 35,221 | 39.4% |
| BORDERLINE | 18,432 | 20.6% |
| POOR | 5,897 | 6.6% |
| REJECT | 1,019 | 1.1% |

**Sheet 4: Content Analysis**
| Metric | Value |
|--------|-------|
| Face detected | 87,234 (97.5%) |
| High confidence face (>0.8) | 79,021 (88.3%) |
| Rope/halter detected | 12,456 (13.9%) |
| Multiple cattle detected | 2,341 (2.6%) |
| Frontal view (estimate) | 45,223 (50.5%) |
| Oblique view (estimate) | 32,109 (35.9%) |
| Lateral view (estimate) | 12,002 (13.4%) |

### **preprocessing_recommendations.json**
```json
{
  "dataset_readiness": "GREEN",
  "overall_quality": "GOOD",
  "usable_image_percentage": 99.24,
  
  "recommendations": {
    "preprocessing_needed": false,
    "reasoning": "Dataset quality is good overall (71.6% EXCELLENT/GOOD). Heavy preprocessing not required.",
    
    "roi_preprocessing": {
      "sam_required": true,
      "priority": "HIGH",
      "reasoning": "13.9% images have rope/halter. Background varies significantly. SAM will improve consistency."
    },
    
    "quality_filtering": {
      "recommended_threshold": "REJECT_ONLY",
      "reject_count": 1019,
      "reasoning": "Only reject lowest quality images. Borderline and POOR images can be used with careful augmentation."
    },
    
    "augmentation_strategy": {
      "strength": "MODERATE_TO_STRONG",
      "focus_areas": [
        "Heavy photometric (lighting varies)",
        "Moderate geometric (views mixed)",
        "Background replacement (SAM-enabled)",
        "Blur augmentation (to handle poor quality subset)"
      ]
    },
    
    "train_val_split": {
      "recommended_ratio": "80/20",
      "reasoning": "Most cattle have 1 image. Need large train set for one-shot learning.",
      "stratification": "by_cattle_id",
      "ensure_quality_balance": true
    },
    
    "freeze_strategy": {
      "initial_freeze": "50%",
      "reasoning": "89K usable images is moderate size. Freeze 50% of backbone initially, unfreeze progressively.",
      "progressive_unfreeze": true
    },
    
    "expected_performance": {
      "level": "MEDIUM_TO_HIGH",
      "top_1_estimate": "60-75%",
      "top_5_estimate": "80-90%",
      "top_20_estimate": "90-95%",
      "limiting_factors": [
        "76% cattle have only 1 image",
        "13.9% have rope/halter (will depend on SAM quality)",
        "Mixed view angles (robustness challenge)"
      ]
    }
  },
  
  "action_items": [
    {
      "priority": 1,
      "action": "Run SAM face ROI preprocessing on all 89,334 usable images"
    },
    {
      "priority": 2,
      "action": "Generate verification samples to confirm SAM quality"
    },
    {
      "priority": 3,
      "action": "Proceed with 80/20 train/val split stratified by cattle_id"
    },
    {
      "priority": 4,
      "action": "Configure moderate-to-strong augmentation policy"
    }
  ]
}
```

---

# 5. STAGE 2: FACE ROI PREPROCESSING (SAM)

## SAM Processing Pipeline

```
For each image in 89,334 usable images:
    ↓
1. Load image
    ↓
2. Run SAM → generate multiple mask proposals
    ↓
3. Filter proposals:
   - Area ratio in [0.10, 0.60]
   - Aspect ratio in [0.6, 1.8]
   - Position: prefer upper-center
   - Compactness: convexity > 0.5
    ↓
4. Select best face mask:
   - Largest valid candidate
   - Most centered
   - Includes eyes + muzzle (anchor check)
    ↓
5. Validate mask:
   - Muzzle visible? ✓
   - Horn completeness (if present)? ✓
   - Rope contamination? Check and erode
    ↓
6. Post-process mask:
   - Fill holes
   - Smooth edges
   - Morphological closing
   - Extend to horn tips if needed
    ↓
7. Apply background handling:
   - Replace background OR
   - Blur background OR
   - Black background
    ↓
8. Save outputs:
   - mask.png (binary)
   - processed_image.jpg
   - metadata.json
    ↓
9. Update statistics:
   - Success/failure count
   - Area ratio distribution
   - Completeness scores
```

## Parallel Processing Strategy

```python
# Pseudocode for parallel SAM processing
total_images = 89334
num_workers = 8  # CPU processes
batch_size_per_worker = 1000

# Shard manifest
shards = split_manifest(total_images, num_workers)

# Process in parallel
for shard_id, image_list in enumerate(shards):
    spawn_worker(
        worker_id=shard_id,
        images=image_list,
        output_dir=f"processed/shard_{shard_id}/",
        sam_model=load_sam_on_gpu(gpu_id=shard_id % num_gpus)
    )
    
# Each worker:
#   - Loads SAM model once
#   - Processes images sequentially
#   - Writes results with atomic operations
#   - Logs progress
#   - Handles failures gracefully (retry or skip)

# After all workers complete:
merge_results()
generate_sam_report()
```

## Verification Sample Generation

For 250 selected samples (random + best + worst + edge cases):

```
For each sample:
    ↓
1. Load original image
    ↓
2. Run SAM and capture ALL proposals
    ↓
3. Generate visualizations:
   
   step1_original.jpg
   - Original input image
   
   step2_sam_all_proposals.jpg
   - All SAM masks overlaid (color-coded by area)
   - Legend showing area ratio for each
   
   step3_face_candidates.jpg
   - Only valid face candidates (after filtering)
   - Show why others were rejected (text annotations)
   
   step4_selected_mask.jpg
   - The chosen mask highlighted
   - Annotation: "Selected: largest valid, area=32.4%, centered"
   
   step5_mask_overlay.jpg
   - Mask contour drawn on original
   - Show boundary precision
   
   step6_final_processed.jpg
   - After background replacement/blur
   - Side-by-side: original | processed
   
   step7_feature_check.jpg
   - Mark critical features:
     * Eyes (green circles)
     * Muzzle (red box)
     * Horns (blue outlines)
     * Completeness score: 0.92/1.0
    ↓
4. Generate comparison grids:
   - 4×4 grid showing 16 samples at each stage
    ↓
5. Write metadata.json:
   {
     "cattle_id": "FDETIBU17875",
     "original_path": "...",
     "sam_proposals_count": 12,
     "valid_face_candidates": 3,
     "selected_mask_index": 0,
     "mask_area_ratio": 0.324,
     "mask_aspect_ratio": 1.12,
     "face_completeness_score": 0.92,
     "muzzle_visible": true,
     "both_eyes_visible": true,
     "horn_completeness": 0.95,
     "rope_detected": false,
     "processing_time_ms": 1243,
     "quality_flag": "EXCELLENT"
   }
```

## Output Statistics

### **sam_report.json**
```json
{
  "total_images_processed": 89334,
  "processing_time_hours": 4.2,
  "images_per_second": 5.9,
  
  "success_metrics": {
    "valid_mask_found": 87521,
    "success_rate": 0.9797,
    "fallback_used": 1813,
    "fallback_rate": 0.0203
  },
  
  "mask_quality_distribution": {
    "excellent": 45123,
    "good": 32987,
    "fair": 9411,
    "poor": 1626,
    "failed": 374
  },
  
  "geometric_statistics": {
    "mean_area_ratio": 0.284,
    "median_area_ratio": 0.276,
    "p10_area_ratio": 0.152,
    "p90_area_ratio": 0.428,
    "mean_aspect_ratio": 1.18,
    "median_aspect_ratio": 1.15
  },
  
  "completeness_metrics": {
    "muzzle_visible_rate": 0.982,
    "both_eyes_visible_rate": 0.753,
    "horn_complete_rate": 0.891,
    "ear_visible_rate": 0.623
  },
  
  "contamination_metrics": {
    "rope_detected_before_removal": 12456,
    "rope_successfully_removed": 11234,
    "rope_partial_removal": 987,
    "rope_removal_failed": 235,
    "rope_removal_success_rate": 0.902
  },
  
  "view_distribution": {
    "frontal": 44521,
    "oblique": 31245,
    "lateral": 11755
  },
  
  "recommendations": {
    "proceed_to_training": true,
    "quality_sufficient": true,
    "rope_removal_effective": true,
    "issues": [
      "374 images failed mask generation - review manually",
      "235 images have rope contamination - may need manual cleanup"
    ]
  }
}
```

---

# 6. STAGE 3: AUGMENTATION SYSTEM

## Complete Augmentation Configuration

### **augmentation_config.yaml**
```yaml
augmentation:
  # Meta settings
  enabled: true
  strategy: "adaptive"  # adaptive | fixed | progressive
  
  # Multi-view batch construction
  views_per_image: 4  # K in N×K batches
  different_aug_per_view: true
  
  # Adaptive strength based on image quality
  adaptive_rules:
    high_quality:  # blur_score > 100, resolution > 1024
      strength: "STRONG"
      geometric_probability: 0.7
      degradation_probability: 0.5
    
    medium_quality:  # 50 < blur_score < 100
      strength: "MODERATE"
      geometric_probability: 0.5
      degradation_probability: 0.3
    
    low_quality:  # blur_score < 50
      strength: "MILD"
      geometric_probability: 0.3
      degradation_probability: 0.1  # already degraded
  
  # Photometric Augmentations (AGGRESSIVE - SAFE)
  photometric:
    brightness:
      enabled: true
      probability: 0.7
      range: [-0.3, 0.3]
      
    contrast:
      enabled: true
      probability: 0.7
      range: [0.7, 1.3]
      
    saturation:
      enabled: true
      probability: 0.6
      range: [0.8, 1.2]
      
    hue:
      enabled: true
      probability: 0.5
      range: [-10, 10]  # degrees
      
    gamma:
      enabled: true
      probability: 0.5
      range: [0.8, 1.2]
      
    color_jitter:  # Combined
      enabled: true
      probability: 0.6
      brightness: 0.2
      contrast: 0.2
      saturation: 0.1
      hue: 0.05
  
  # Geometric Augmentations (MODERATE - ROI-AWARE)
  geometric:
    random_crop:
      enabled: true
      probability: 0.8
      scale: [0.80, 1.0]
      ratio: [0.9, 1.1]  # preserve aspect ratio mostly
      face_center_bias: 0.7  # keep face centered
      
    rotation:
      enabled: true
      probability: 0.5
      range: [-15, 15]  # degrees
      fill_mode: "reflect"
      
    horizontal_flip:
      enabled: true
      probability: 0.5
      # NOTE: Disable if horn asymmetry critical
      
    affine:
      enabled: true
      probability: 0.3
      scale: [0.95, 1.05]
      translate: [-0.05, 0.05]
      shear: [-5, 5]  # degrees
      
    perspective:
      enabled: true
      probability: 0.2  # LOW - can distort features
      distortion_scale: 0.15
      
    elastic_transform:
      enabled: false  # Usually too aggressive for faces
  
  # Degradation Augmentations (REALISTIC)
  degradation:
    gaussian_blur:
      enabled: true
      probability: 0.3
      kernel_size: [3, 7]
      sigma: [0.1, 2.0]
      
    motion_blur:
      enabled: true
      probability: 0.2
      kernel_size: [3, 7]
      angle: "random"
      
    jpeg_compression:
      enabled: true
      probability: 0.3
      quality: [60, 100]
      
    gaussian_noise:
      enabled: true
      probability: 0.25
      mean: 0
      std: [0, 15]
      
    iso_noise:  # Realistic camera noise
      enabled: true
      probability: 0.2
      color_shift: 0.05
      intensity: [0.1, 0.5]
  
  # Background Augmentations (AFTER ROI)
  background:
    replacement:
      enabled: true
      probability: 0.5
      background_dir: "data/background_images/"
      blending_mode: "hard"  # or "soft" for gradual edge
      
    blur:
      enabled: true
      probability: 0.3
      kernel_size: [15, 31]
      
    keep_original:
      enabled: true
      probability: 0.2  # Sometimes keep for realism
  
  # Occlusion Augmentations (CAREFUL)
  occlusion:
    cutout:
      enabled: true
      probability: 0.15  # LOW
      num_holes: [1, 2]
      hole_size: [0.05, 0.15]
      avoid_center: true  # Don't cut muzzle
      center_exclusion_radius: 0.3
      
    random_erasing:
      enabled: true
      probability: 0.1  # VERY LOW
      area: [0.02, 0.10]
      aspect_ratio: [0.3, 3.3]
      ensure_muzzle_visible: true
  
  # Advanced Augmentations
  advanced:
    mixup:
      enabled: false  # Generally not for metric learning
      
    cutmix:
      enabled: false
      
    random_shadow:
      enabled: true
      probability: 0.15
      shadow_intensity: [0.3, 0.7]
      
    random_sun_flare:
      enabled: true
      probability: 0.05
      flare_intensity: [0.2, 0.5]
      
    weather_effects:
      enabled: true
      rain: {probability: 0.05, intensity: [0.2, 0.4]}
      fog: {probability: 0.05, intensity: [0.2, 0.4]}
  
  # Normalization (ALWAYS APPLIED LAST)
  normalization:
    enabled: true
    mean: [0.485, 0.456, 0.406]  # ImageNet stats
    std: [0.229, 0.224, 0.225]
    
  # Augmentation Pipeline Order
  pipeline_order:
    - photometric
    - geometric
    - degradation
    - background
    - occlusion
    - advanced
    - normalization
```

## Augmentation Gallery Generation

For EACH of 20 selected diverse samples, generate examples for EVERY augmentation:

### Directory: `verification/augmentation_gallery/`

#### **Sample Selection (20 diverse samples)**
```
- 5 Frontal view (excellent quality)
- 5 Oblique view (good quality)
- 5 Lateral view (good quality)
- 3 Borderline quality
- 2 Poor quality (to show adaptive behavior)
```

#### **Per-Sample Augmentation Showcase**

For sample `sample_001_frontal_excellent.jpg`:

**1. Original Sample**
```
original_samples/sample_001_frontal_excellent.jpg
```

**2. Photometric Augmentations**
```
photometric/brightness/sample_001/
├── original.jpg
├── bright_-0.3.jpg    (darker)
├── bright_-0.2.jpg
├── bright_-0.1.jpg
├── bright_0.0.jpg     (no change)
├── bright_+0.1.jpg
├── bright_+0.2.jpg
├── bright_+0.3.jpg    (brighter)
└── comparison_grid.jpg (all in one grid)

photometric/contrast/sample_001/
├── original.jpg
├── contrast_0.7.jpg   (low)
├── contrast_0.85.jpg
├── contrast_1.0.jpg   (no change)
├── contrast_1.15.jpg
├── contrast_1.3.jpg   (high)
└── comparison_grid.jpg

photometric/saturation/sample_001/
├── original.jpg
├── saturation_0.8.jpg (desaturated)
├── saturation_0.9.jpg
├── saturation_1.0.jpg (no change)
├── saturation_1.1.jpg
├── saturation_1.2.jpg (saturated)
└── comparison_grid.jpg

photometric/hue_shift/sample_001/
├── original.jpg
├── hue_-10deg.jpg
├── hue_-5deg.jpg
├── hue_0deg.jpg
├── hue_+5deg.jpg
├── hue_+10deg.jpg
└── comparison_grid.jpg

photometric/gamma/sample_001/
├── original.jpg
├── gamma_0.8.jpg      (darker, more contrast)
├── gamma_0.9.jpg
├── gamma_1.0.jpg
├── gamma_1.1.jpg
├── gamma_1.2.jpg      (brighter, less contrast)
└── comparison_grid.jpg

photometric/combined_realistic/sample_001/
├── original.jpg
├── indoor_lighting.jpg    (slight blue tint, lower brightness)
├── outdoor_bright.jpg     (high brightness, warm hue)
├── cloudy_day.jpg         (low saturation, medium brightness)
├── sunset.jpg             (orange hue, warm tone)
└── comparison_grid.jpg
```

**3. Geometric Augmentations**
```
geometric/rotation/sample_001/
├── original.jpg
├── rotate_-15deg.jpg
├── rotate_-10deg.jpg
├── rotate_-5deg.jpg
├── rotate_0deg.jpg
├── rotate_+5deg.jpg
├── rotate_+10deg.jpg
├── rotate_+15deg.jpg
└── comparison_grid.jpg

geometric/crop_scale/sample_001/
├── original.jpg
├── crop_0.80_scale.jpg    (80% of original, zoomed out)
├── crop_0.85_scale.jpg
├── crop_0.90_scale.jpg
├── crop_0.95_scale.jpg
├── crop_1.00_scale.jpg    (full face)
└── comparison_grid.jpg

geometric/perspective/sample_001/
├── original.jpg
├── perspective_light.jpg   (subtle 3D effect)
├── perspective_medium.jpg
├── perspective_strong.jpg  (noticeable distortion)
└── comparison_grid.jpg

geometric/affine/sample_001/
├── original.jpg
├── affine_scale_up.jpg
├── affine_scale_down.jpg
├── affine_translate_left.jpg
├── affine_translate_right.jpg
├── affine_shear_left.jpg
├── affine_shear_right.jpg
└── comparison_grid.jpg

geometric/horizontal_flip/sample_001/
├── original.jpg
├── flipped.jpg
└── comparison_side_by_side.jpg
```

**4. Degradation Augmentations**
```
degradation/gaussian_blur/sample_001/
├── original.jpg
├── blur_kernel3_sigma0.5.jpg   (slight)
├── blur_kernel5_sigma1.0.jpg
├── blur_kernel7_sigma1.5.jpg
├── blur_kernel9_sigma2.0.jpg   (heavy)
└── comparison_grid.jpg

degradation/motion_blur/sample_001/
├── original.jpg
├── motion_horizontal_k3.jpg
├── motion_horizontal_k5.jpg
├── motion_horizontal_k7.jpg
├── motion_vertical_k5.jpg
├── motion_diagonal_k5.jpg
└── comparison_grid.jpg

degradation/jpeg_compression/sample_001/
├── original.jpg
├── jpeg_q100.jpg  (no compression artifacts)
├── jpeg_q90.jpg
├── jpeg_q75.jpg
├── jpeg_q60.jpg   (visible blocks)
├── jpeg_q40.jpg   (heavy artifacts)
└── comparison_grid.jpg

degradation/gaussian_noise/sample_001/
├── original.jpg
├── noise_std0.jpg
├── noise_std5.jpg
├── noise_std10.jpg
├── noise_std15.jpg
├── noise_std20.jpg   (very noisy)
└── comparison_grid.jpg
```

**5. Background Augmentations**
```
background/replacement/sample_001/
├── original.jpg
├── bg_outdoor_grass.jpg
├── bg_outdoor_dirt.jpg
├── bg_barn_interior.jpg
├── bg_feeding_station.jpg
├── bg_neutral_gray.jpg
├── bg_gradient.jpg
└── comparison_grid.jpg

background/blur/sample_001/
├── original.jpg
├── bg_blur_kernel15.jpg   (slight blur)
├── bg_blur_kernel21.jpg
├── bg_blur_kernel31.jpg   (heavy blur)
└── comparison_grid.jpg
```

**6. Occlusion Augmentations**
```
occlusion/cutout/sample_001/
├── original.jpg
├── cutout_1hole_small.jpg
├── cutout_2holes_small.jpg
├── cutout_1hole_medium.jpg
├── cutout_avoid_center.jpg  (muzzle protected)
└── comparison_grid.jpg

occlusion/random_erasing/sample_001/
├── original.jpg
├── erasing_small_area.jpg
├── erasing_medium_area.jpg
├── erasing_ensure_muzzle.jpg
└── comparison_grid.jpg
```

**7. Combined Realistic Augmentations**
```
combined_augmentations/mild/sample_001/
├── original.jpg
├── mild_combo_1.jpg  (slight brightness + crop + bg blur)
├── mild_combo_2.jpg  (slight rotation + contrast)
├── mild_combo_3.jpg  (hue shift + jpeg compression)
└── comparison_grid.jpg

combined_augmentations/moderate/sample_001/
├── original.jpg
├── moderate_combo_1.jpg  (rotation + brightness + blur)
├── moderate_combo_2.jpg  (crop + contrast + noise)
├── moderate_combo_3.jpg  (perspective + saturation + bg replace)
└── comparison_grid.jpg

combined_augmentations/strong/sample_001/
├── original.jpg
├── strong_combo_1.jpg  (multiple geometric + photometric + degradation)
├── strong_combo_2.jpg
├── strong_combo_3.jpg
└── comparison_grid.jpg

combined_augmentations/realistic_training_sample/sample_001_with_8_views/
├── view_1.jpg  (original)
├── view_2.jpg  (mild aug)
├── view_3.jpg  (moderate aug 1)
├── view_4.jpg  (moderate aug 2)
├── view_5.jpg  (strong aug 1)
├── view_6.jpg  (strong aug 2)
├── view_7.jpg  (degradation focus)
├── view_8.jpg  (geometric focus)
└── 8view_grid.jpg  (all K=8 views in one image)
```

**8. Adaptive Augmentation Examples**
```
adaptive_augmentation_examples/
├── high_quality_sharp_large/
│   ├── original.jpg (sharp, 2048×1536, excellent)
│   ├── applied_strong_aug.jpg
│   └── augmentation_params.json
│       {
│         "strength": "STRONG",
│         "rotation_probability": 0.7,
│         "blur_probability": 0.5,
│         "cutout_enabled": true
│       }
│
├── medium_quality/
│   ├── original.jpg (moderate blur, 1280×960, good)
│   ├── applied_moderate_aug.jpg
│   └── augmentation_params.json
│
└── low_quality_blurry_small/
    ├── original.jpg (very blurry, 640×480, poor)
    ├── applied_mild_aug.jpg
    └── augmentation_params.json
        {
          "strength": "MILD",
          "rotation_probability": 0.3,
          "blur_probability": 0.1,  # already blurry
          "blur_disabled": true,
          "cutout_enabled": false
        }
```

### **Augmentation Statistics File**

**augmentation_statistics.json**
```json
{
  "total_samples_generated": 20,
  "augmentations_per_sample": 87,
  "total_augmentation_images": 1740,
  
  "photometric": {
    "brightness": {"count": 140, "avg_intensity": 0.15},
    "contrast": {"count": 120, "avg_range": 0.95},
    "saturation": {"count": 120, "avg_value": 1.0},
    "hue": {"count": 120, "avg_shift_deg": 3.2},
    "gamma": {"count": 120, "avg_gamma": 1.02},
    "combined": {"count": 140}
  },
  
  "geometric": {
    "rotation": {"count": 140, "avg_angle_deg": 5.3},
    "crop_scale": {"count": 100, "avg_scale": 0.91},
    "perspective": {"count": 60, "avg_distortion": 0.12},
    "affine": {"count": 140},
    "horizontal_flip": {"count": 20}
  },
  
  "degradation": {
    "gaussian_blur": {"count": 100, "avg_kernel": 5.2},
    "motion_blur": {"count": 120},
    "jpeg_compression": {"count": 120, "avg_quality": 78},
    "gaussian_noise": {"count": 100, "avg_std": 8.5}
  },
  
  "background": {
    "replacement": {"count": 140},
    "blur": {"count": 80}
  },
  
  "occlusion": {
    "cutout": {"count": 40},
    "random_erasing": {"count": 20}
  },
  
  "combined": {
    "mild": {"count": 60},
    "moderate": {"count": 60},
    "strong": {"count": 60},
    "realistic_training_k8": {"count": 160}
  }
}
```

### **Augmentation Verification Report**

**augmentation_verification_report.pdf** contains:

1. **Overview**
   - Total augmentations tested
   - Sample diversity
   
2. **Visual Quality Assessment**
   - For each augmentation type: PASS/FAIL
   - Identity preservation check
   - Realism check
   
3. **Recommended Configurations**
   - Based on visual inspection
   - Tuned parameters
   
4. **Warnings**
   - Which augmentations risk destroying identity
   - Which combinations are too aggressive

---

# 7. STAGE 4: TRAIN/VAL SPLIT

## Split Strategy

### Based on Dataset Analysis Results:
```
Total usable images: 89,334
Unique cattle: 68,432
Images per cattle distribution:
  - 1 image: 52,108 cattle (76.1%)
  - 2-3 images: 14,221 cattle (20.8%)
  - 4+ images: 2,103 cattle (3.1%)
```

### **Split Algorithm (Stratified by Cattle ID)**

```python
# Pseudocode
def create_train_val_split(cattle_distribution, split_ratio=0.8):
    """
    Ensure ALL images of a cattle go to either train OR val
    Never split a cattle's images across train/val
    """
    
    cattle_ids = list(cattle_distribution.keys())
    random.shuffle(cattle_ids)
    
    split_point = int(len(cattle_ids) * split_ratio)
    train_cattle_ids = cattle_ids[:split_point]
    val_cattle_ids = cattle_ids[split_point:]
    
    # Gather all images per split
    train_images = []
    val_images = []
    
    for cid in train_cattle_ids:
        train_images.extend(cattle_distribution[cid])
    
    for cid in val_cattle_ids:
        val_images.extend(cattle_distribution[cid])
    
    # Balance quality across splits (optional refinement)
    balance_quality_distribution(train_images, val_images)
    
    return train_images, val_images
```

### **Output: Split Manifests**

**train_manifest.csv**
```csv
image_id,cattle_id,roi_path,mask_path,quality_bucket,face_completeness,view_orientation
IMG_00001,FDETIBU17875,processed/face_roi_v1/images/IMG_00001.jpg,processed/face_roi_v1/masks/IMG_00001.png,EXCELLENT,0.92,frontal
IMG_00003,FDETIBU18219,processed/face_roi_v1/images/IMG_00003.jpg,processed/face_roi_v1/masks/IMG_00003.png,GOOD,0.85,oblique
...
Total: 71,467 images from 54,746 cattle (80%)
```

**val_manifest.csv**
```csv
image_id,cattle_id,roi_path,mask_path,quality_bucket,face_completeness,view_orientation
IMG_00002,FDETIBU20005,processed/face_roi_v1/images/IMG_00002.jpg,processed/face_roi_v1/masks/IMG_00002.png,GOOD,0.88,frontal
...
Total: 17,867 images from 13,686 cattle (20%)
```

**split_info.json**
```json
{
  "split_ratio": 0.8,
  "train": {
    "total_images": 71467,
    "unique_cattle": 54746,
    "quality_distribution": {
      "EXCELLENT": 23012,
      "GOOD": 28177,
      "BORDERLINE": 14745,
      "POOR": 4721,
      "FAIR": 812
    },
    "view_distribution": {
      "frontal": 36085,
      "oblique": 25698,
      "lateral": 9684
    }
  },
  "val": {
    "total_images": 17867,
    "unique_cattle": 13686,
    "quality_distribution": {
      "EXCELLENT": 5753,
      "GOOD": 7044,
      "BORDERLINE": 3687,
      "POOR": 1176,
      "FAIR": 207
    },
    "view_distribution": {
      "frontal": 9018,
      "oblique": 6411,
      "lateral": 2438
    }
  },
  "quality_balance_achieved": true,
  "view_balance_achieved": true
}
```

---

# 8. STAGE 5: TRAINING SYSTEM

## Training Configuration

### **training_config.yaml**
```yaml
training:
  # Run identification
  run_name: "run_001_resnet50_supcon"
  experiment_group: "baseline_single_branch"
  
  # Data
  train_manifest: "data/splits/train_manifest.csv"
  val_manifest: "data/splits/val_manifest.csv"
  image_size: 224
  
  # Batch construction (CRITICAL for one-shot)
  batch_size: 128  # = 32 cattle × 4 views
  cattle_per_batch: 32  # N
  views_per_cattle: 4   # K
  num_workers: 16
  pin_memory: true
  prefetch_factor: 2
  
  # Training schedule
  epochs: 100
  warmup_epochs: 5
  early_stopping_patience: 15
  
  # Optimizer
  optimizer:
    type: "AdamW"
    lr: 0.0003
    weight_decay: 0.0001
    betas: [0.9, 0.999]
    
  # Learning rate scheduler
  scheduler:
    type: "CosineAnnealingWarmRestarts"
    T_0: 10
    T_mult: 2
    eta_min: 1e-6
    
  # Mixed precision
  use_amp: true
  amp_dtype: "float16"
  gradient_accumulation_steps: 1
  grad_clip_norm: 1.0
  
  # Model architecture
  model:
    architecture: "single_branch"  # or "multi_branch"
    backbone: "resnet50"
    embedding_dim: 512
    normalize_embeddings: true
    dropout: 0.1
    
  # Pretrained weights
  pretrained:
    use_pretrained: true
    source: "imagenet"
    checkpoint: "models/pretrained/resnet50_imagenet.pth"
    
  # Freezing strategy
  freeze:
    initial_strategy: "freeze_50_percent"
    freeze_layers: ["layer1", "layer2"]  # Freeze first 50%
    freeze_bn: true
    
    progressive_unfreeze:
      enabled: true
      schedule:
        - {epoch: 20, unfreeze: ["layer3"], freeze_bn: true}
        - {epoch: 40, unfreeze: ["layer4"], freeze_bn: false}
        - {epoch: 60, unfreeze: "all", freeze_bn: false}
  
  # Loss function
  loss:
    type: "supervised_contrastive"  # supcon, arcface_proxy, proxyanchor
    temperature: 0.07
    
  # Checkpointing
  checkpoint:
    save_every_n_epochs: 5
    save_best: true
    save_last: true
    keep_top_k: 3
    metric: "val_top5"  # or "val_sim_gap"
    mode: "max"
    
  # Logging
  logging:
    log_every_n_steps: 50
    tensorboard: true
    log_embeddings: true
    log_embedding_frequency: 5  # epochs
    
  # Validation
  validation:
    eval_every_n_epochs: 1
    compute_topk: [1, 5, 10, 20]
    compute_cmc: true
    compute_robustness: true
    robustness_frequency: 10  # epochs
    
  # Resume
  resume:
    enabled: false
    checkpoint_path: null  # "models/trained/run_001/checkpoints/last.pth"
    strict: true
    resume_optimizer: true
    resume_scheduler: true
```

## Training Loop (Conceptual)

```
for epoch in range(start_epoch, num_epochs):
    ↓
    # TRAINING PHASE
    model.train()
    
    for batch_idx, (images, labels) in enumerate(train_loader):
        # images: [N×K, C, H, W] = [128, 3, 224, 224]
        # labels: [N×K] where K consecutive have same cattle_id
        
        # Forward
        embeddings = model(images)  # [128, 512]
        loss, loss_components = criterion(embeddings, labels)
        
        # Backward
        optimizer.zero_grad()
        scaler.scale(loss).backward()  # if AMP
        scaler.unscale_(optimizer)
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm)
        scaler.step(optimizer)
        scaler.update()
        
        # Log metrics
        if batch_idx % log_interval == 0:
            log_train_metrics(loss, embeddings, labels)
    
    scheduler.step()
    
    ↓
    # VALIDATION PHASE
    if epoch % eval_every_n_epochs == 0:
        model.eval()
        
        # Extract all validation embeddings
        val_embeddings, val_labels = extract_embeddings(model, val_loader)
        
        # Compute similarity metrics
        self_sim, pos_sim, neg_sim, sim_gap = compute_similarity_metrics(
            val_embeddings, val_labels
        )
        
        # Compute embedding health
        variance_stats = compute_embedding_variance(val_embeddings)
        collapse_flag = check_collapse(variance_stats, neg_sim)
        
        # Compute Top-K retrieval
        gallery_embeddings, gallery_labels = build_gallery(val_embeddings, val_labels)
        topk_metrics = evaluate_topk(
            query_embeddings=val_embeddings,
            query_labels=val_labels,
            gallery_embeddings=gallery_embeddings,
            gallery_labels=gallery_labels,
            k_values=[1, 5, 10, 20]
        )
        
        # Robustness diagnostics (every N epochs)
        if epoch % robustness_frequency == 0:
            bg_drift = compute_background_drift(model, val_loader)
            blur_sensitivity = compute_blur_sensitivity(model, val_loader)
        
        # Log validation metrics
        log_val_metrics(topk_metrics, self_sim, neg_sim, sim_gap, variance_stats)
        
        # Check early stopping
        if early_stopping(val_metric):
            break
    
    ↓
    # CHECKPOINTING
    if should_save_checkpoint(epoch):
        save_checkpoint(
            epoch=epoch,
            model_state=model.state_dict(),
            optimizer_state=optimizer.state_dict(),
            scheduler_state=scheduler.state_dict(),
            scaler_state=scaler.state_dict() if use_amp else None,
            metrics=current_metrics,
            config=config,
            freeze_state=get_freeze_state(model)
        )
    
    ↓
    # PROGRESSIVE UNFREEZING
    if epoch in unfreeze_schedule:
        layers_to_unfreeze = unfreeze_schedule[epoch]
        unfreeze_layers(model, layers_to_unfreeze)
        log_trainable_params(model)
    
    ↓
    # DYNAMIC PLOTTING (if enabled)
    update_live_dashboard(epoch, train_metrics, val_metrics)
```

## Trainable Parameters Tracking

**trainable_params_report.txt** (generated every epoch):
```
Epoch: 1
=======================================
Total Parameters: 25,557,032
Trainable Parameters: 12,778,516 (50.0%)
Frozen Parameters: 12,778,516 (50.0%)

Frozen Layers:
  - conv1: 9,408 params
  - bn1: 128 params
  - layer1: 147,456 params
  - layer1.0.conv1: ...
  - layer1.0.bn1: ...
  - ...
  - layer2: 1,219,584 params

Trainable Layers:
  - layer3: 7,077,888 params
  - layer4: 14,942,208 params
  - fc (embedding head): 526,848 params

Effective Learning Rate per Layer Group:
  - layer3: 0.00015 (50% of base)
  - layer4: 0.0003 (base)
  - fc: 0.0003 (base)

BatchNorm Statistics:
  - Frozen BN: 49 layers
  - Training BN: 0 layers

=======================================

Epoch: 20 (Unfreeze layer3 triggered)
=======================================
Total Parameters: 25,557,032
Trainable Parameters: 19,855,924 (77.7%)
Frozen Parameters: 5,701,108 (22.3%)

Frozen Layers:
  - conv1: 9,408 params
  - bn1: 128 params
  - layer1: 147,456 params
  - layer2: 1,219,584 params

Trainable Layers:
  - layer3: 7,077,888 params (NEWLY UNFROZEN)
  - layer4: 14,942,208 params
  - fc: 526,848 params

...
```

## Metrics Logged During Training

### **train_metrics.csv**
```csv
epoch,step,loss,loss_contrastive,loss_regularization,lr,grad_norm,throughput_imgs_per_sec,gpu_memory_mb
1,1,2.456,2.398,0.058,0.00003,1.245,187.3,6234
1,2,2.312,2.261,0.051,0.00003,1.198,189.1,6234
...
```

### **val_metrics.csv**
```csv
epoch,loss,self_sim_mean,self_sim_std,pos_sim_mean,neg_sim_mean,neg_sim_max,sim_gap,emb_var_mean,emb_var_min,collapse_flag,top1,top5,top10,top20,mrr
1,1.985,0.652,0.124,0.652,0.234,0.456,0.418,0.0234,0.0001,False,34.2,58.7,71.3,82.1,0.456
2,1.823,0.678,0.118,0.678,0.223,0.441,0.455,0.0241,0.0002,False,37.1,61.4,73.8,84.2,0.478
...
```

### **embedding_health.csv**
```csv
epoch,emb_var_mean,emb_var_std,emb_var_min,emb_var_max,emb_norm_mean,emb_norm_std,collapse_flag,low_var_dims_pct
1,0.0234,0.0156,0.0001,0.0892,0.987,0.023,False,0.2
2,0.0241,0.0159,0.0002,0.0901,0.989,0.021,False,0.1
...
```

### **robustness_scores.csv** (computed every N epochs)
```csv
epoch,background_drift_mean,background_drift_std,blur_sensitivity_top1_drop,blur_sensitivity_top5_drop
10,0.034,0.021,8.3,5.1
20,0.028,0.018,6.7,4.2
...
```

---

# 9. STAGE 6: MULTI-BRANCH ARCHITECTURE

## Multi-Branch System (Optional Advanced)

### **Architecture: 4-Branch Face Feature Extraction**

```
                     Face ROI Input (224×224×3)
                              ↓
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────┴─────┐   ┌────┴────┐   ┌─────┴──────┐
        ↓           ↓   ↓         ↓   ↓            ↓
   Global Face  Muzzle  Color/  Shape/
   Branch      Attention Pattern Structure
   (ResNet50)  Branch   Branch  Branch
   
        ↓           ↓      ↓         ↓
    512-dim     256-dim  128-dim  128-dim
        │           │      │         │
        └───────────┼──────┼─────────┘
                    ↓
              Fusion Layer
             (Concat → FC)
                    ↓
           Final Embedding (512-dim)
                    ↓
              L2 Normalization
                    ↓
          Metric Learning Loss
```

### **Branch 1: Global Face Branch**

**Purpose**: Capture overall face appearance, structure, proportions

**Architecture**:
```yaml
global_face_branch:
  backbone: "resnet50"
  input_size: [224, 224]
  pretrained: true
  frozen_stages: 2  # Freeze first 2 stages initially
  
  output:
    feature_dim: 2048  # ResNet50 final layer
    projection_head:
      - Linear(2048, 1024)
      - ReLU
      - Dropout(0.1)
      - Linear(1024, 512)
    output_dim: 512
    normalize: true
```

**What it learns**:
- Overall face shape
- Facial proportions (eye spacing, face width/height ratio)
- Horn configuration
- Ear shape
- Global coloration patterns

### **Branch 2: Muzzle-Focused Branch**

**Purpose**: Extract fine-grained muzzle texture (most discriminative)

**Architecture**:
```yaml
muzzle_attention_branch:
  method: "spatial_attention + crop"
  
  # Step 1: Detect muzzle region
  muzzle_localization:
    method: "learned_attention"  # or "fixed_center_crop"
    attention_module:
      - Conv2d(512, 256, 1×1)
      - ReLU
      - Conv2d(256, 1, 1×1)  # Attention map
      - Sigmoid
    
  # Step 2: Apply attention
  attention_mechanism:
    type: "multiplicative"  # feature_map * attention_map
    
  # Step 3: Extract features
  feature_extractor:
    backbone: "efficientnet_b0"  # Lighter for speed
    input_size: [112, 112]  # Cropped muzzle region
    pretrained: true
    
  output:
    feature_dim: 1280
    projection_head:
      - Linear(1280, 512)
      - ReLU
      - Dropout(0.1)
      - Linear(512, 256)
    output_dim: 256
    normalize: true
```

**What it learns**:
- Muzzle nose print patterns (unique like fingerprint)
- Nostril shape and spacing
- Lip texture
- Fine-grained skin texture
- Spot/marking patterns on muzzle

### **Branch 3: Color/Pattern Branch**

**Purpose**: Capture breed-specific and individual color patterns

**Architecture**:
```yaml
color_pattern_branch:
  input_colorspace: "HSV"  # Convert RGB → HSV
  
  # Multi-scale color histograms
  color_histogram:
    bins: [16, 16, 16]  # H, S, V
    normalize: true
    output_dim: 4096  # 16×16×16
    
  # Dominant color extraction
  dominant_colors:
    method: "kmeans"
    num_clusters: 5
    feature_encoding: "cluster_centers"  # 5×3 = 15
    
  # Color co-occurrence (texture in color space)
  color_cooccurrence:
    method: "GLCM_per_channel"
    output_dim: 32
    
  # Combine features
  fusion:
    input_dim: 4096 + 15 + 32 = 4143
    layers:
      - Linear(4143, 512)
      - ReLU
      - Dropout(0.2)
      - Linear(512, 256)
      - ReLU
      - Linear(256, 128)
    output_dim: 128
    normalize: true
```

**What it learns**:
- Overall coat color distribution
- Breed-specific color patterns (e.g., Holstein black/white patches)
- Facial marking colors
- Color gradients
- Unique spot/patch patterns

### **Branch 4: Shape/Structure Branch**

**Purpose**: Capture geometric shape and silhouette information

**Architecture**:
```yaml
shape_structure_branch:
  input: "face_mask"  # Binary mask from ROI
  
  # Contour-based features
  contour_features:
    methods:
      - "fourier_descriptors"  # Frequency representation of contour
      - "hu_moments"           # 7 invariant moments
      - "eccentricity"
      - "solidity"
      - "convexity"
    output_dim: 64
    
  # Distance transform
  distance_transform:
    method: "euclidean"
    sample_points: 100
    output_dim: 100
    
  # Skeleton features
  skeleton:
    method: "medial_axis"
    feature: "branch_points + end_points"
    output_dim: 32
    
  # Combine
  fusion:
    input_dim: 64 + 100 + 32 = 196
    layers:
      - Linear(196, 256)
      - ReLU
      - Dropout(0.1)
      - Linear(256, 128)
    output_dim: 128
    normalize: true
```

**What it learns**:
- Face outline shape
- Horn angle and curvature
- Head proportions
- Ear orientation
- Asymmetries (e.g., one horn damaged)

### **Fusion Layer**

**Purpose**: Combine all branch embeddings into final representation

**Architecture**:
```yaml
fusion:
  method: "concatenation"  # or "attention-weighted"
  
  # Simple concatenation
  concat_fusion:
    input_dims: [512, 256, 128, 128]  # From 4 branches
    total_dim: 1024
    
    projection:
      - Linear(1024, 512)
      - ReLU
      - Dropout(0.1)
      - Linear(512, 512)
    
    output_dim: 512
    normalize: true
    
  # Alternative: Learned attention fusion
  attention_fusion:
    branch_weights:
      learnable: true
      initialization: [0.4, 0.3, 0.15, 0.15]  # Global > Muzzle > others
      
    weighted_sum:
      output_dim: 512
      normalize: true
```

### **Training Strategy for Multi-Branch**

```yaml
multi_branch_training:
  # Phase 1: Train branches separately
  phase_1:
    epochs: 20
    freeze: ["fusion_layer"]
    train: ["global_branch", "muzzle_branch", "color_branch", "shape_branch"]
    loss: "separate_losses_per_branch"
    
  # Phase 2: Train fusion layer
  phase_2:
    epochs: 10
    freeze: ["all_branches"]
    train: ["fusion_layer"]
    loss: "combined_embedding_loss"
    
  # Phase 3: Fine-tune end-to-end
  phase_3:
    epochs: 70
    freeze: []
    train: ["all"]
    loss: "combined_embedding_loss"
    progressive_unfreeze: true
```

### **Model Comparison: Single vs Multi-Branch**

**Expected Performance Gains**:
```
Single-Branch (Global Face Only):
  Top-1: 62%
  Top-5: 82%
  Top-20: 92%
  
Multi-Branch (All 4):
  Top-1: 68-72% (+6-10%)
  Top-5: 86-90% (+4-8%)
  Top-20: 94-96% (+2-4%)
  
Cost:
  Inference time: 2-3× slower
  Model size: 3-4× larger
  Training time: 1.5-2× longer
```

### **When to Use Multi-Branch**:
```
✅ Use if:
  - Accuracy is critical
  - Inference latency not critical
  - Have sufficient compute
  - Dataset has good diversity
  
❌ Skip if:
  - Need fast inference (<50ms)
  - Edge deployment (limited memory)
  - Single-branch already performs well (>90% Top-20)
```

---

# 10. STAGE 7: EVALUATION & METRICS

## Validation Evaluation (Decision-Making)

### **Evaluation Pipeline**

```
1. Extract Embeddings
   ↓
   For all validation images:
     - Load face ROI
     - Apply deterministic preprocessing (no random aug)
     - Forward through model
     - Store embedding + metadata
   ↓
   
2. Build Gallery
   ↓
   Strategy A (Current): One embedding per image
     - If cattle has multiple val images, each is separate entry
   
   Strategy B (Future): Template per cattle
     - If cattle has multiple images, average embeddings
   ↓
   
3. Create Probe Set
   ↓
   Same as gallery (self-retrieval for validation)
   OR
   Generate synthetic probes (augmented views)
   ↓
   
4. Compute Retrieval Metrics
   ↓
   For each probe:
     - Compute similarity to all gallery entries
     - Rank by similarity (descending)
     - Find rank of true cattle_id
     - Exclude self-match (same image_id)
   ↓
   
5. Aggregate Metrics
   ↓
   - Top-1/5/10/20 accuracy
   - CMC curve
   - MRR
   - Rank distribution (median, p90, p95)
   ↓
   
6. Compute Similarity Metrics
   ↓
   - SELF-SIM (views of same cattle)
   - POS-SIM (same cattle, different images)
   - NEG-SIM (different cattle)
   - SIM GAP (SELF-SIM - NEG-SIM)
   ↓
   
7. Compute Embedding Health
   ↓
   - Per-dimension variance
   - Embedding norm statistics
   - Collapse detection
   ↓
   
8. Robustness Diagnostics
   ↓
   - Background drift test
   - Blur sensitivity curve
   - Geometry stress test
   ↓
   
9. Hard Negative Analysis
   ↓
   - Identify worst confusions
   - Cluster look-alike cattle
   - Generate confusion matrix
```

### **Metrics Definitions**

#### **Top-K Accuracy**
```
For k in [1, 5, 10, 20]:
  count = 0
  for each probe:
    if true_cattle_id in top_k_predictions:
      count += 1
  
  top_k_accuracy = count / total_probes
```

#### **Cumulative Match Characteristic (CMC) Curve**
```
For rank in [1, 2, 3, ..., 100]:
  count = 0
  for each probe:
    if rank_of_true_id <= rank:
      count += 1
  
  cmc[rank] = count / total_probes

Plot: rank vs cmc[rank]
```

#### **Mean Reciprocal Rank (MRR)**
```
reciprocal_ranks = []
for each probe:
  rank = rank_of_true_cattle_id
  reciprocal_ranks.append(1 / rank)

mrr = mean(reciprocal_ranks)
```

#### **SELF-SIM (Self-Similarity)**
```
For each cattle with K views in batch:
  views_embeddings = [e1, e2, ..., eK]
  
  # Pairwise similarity
  similarities = []
  for i in range(K):
    for j in range(i+1, K):
      sim = cosine_similarity(views_embeddings[i], views_embeddings[j])
      similarities.append(sim)
  
  self_sim_per_cattle = mean(similarities)

SELF_SIM = mean(self_sim_per_cattle for all cattle)
```

#### **NEG-SIM (Negative Similarity)**
```
For each cattle_i:
  for each other cattle_j where j != i:
    sim = cosine_similarity(embedding_i, embedding_j)
    neg_similarities.append(sim)

NEG_SIM_mean = mean(neg_similarities)
NEG_SIM_max = max(neg_similarities)  # Hardest negative
NEG_SIM_p95 = percentile_95(neg_similarities)
```

#### **SIM GAP**
```
SIM_GAP = SELF_SIM - NEG_SIM_mean

Interpretation:
  - SIM_GAP > 0.3: Excellent separation
  - SIM_GAP > 0.2: Good separation
  - SIM_GAP > 0.1: Moderate separation
  - SIM_GAP < 0.1: Poor separation (collapse risk)
```

#### **Embedding Variance (Collapse Detection)**
```
For embedding dimension d in [1, ..., D]:
  variance[d] = var(all_embeddings[:, d])

mean_variance = mean(variance)
min_variance = min(variance)
pct_low_variance = percentage of dims where variance < 0.001

Collapse indicators:
  - mean_variance < 0.01 AND
  - NEG_SIM > 0.5 AND
  - pct_low_variance > 50%
```

#### **Background Drift Score**
```
For sample_size random images:
  original_embedding = model(face_roi_original_bg)
  
  embeddings_with_different_bgs = []
  for bg in [bg1, bg2, bg3, bg4, bg5]:
    face_roi_new_bg = replace_background(face_roi, bg)
    emb = model(face_roi_new_bg)
    embeddings_with_different_bgs.append(emb)
  
  drift = std_deviation(embeddings_with_different_bgs)
  
background_drift_score = mean(drift for all samples)

Interpretation:
  - drift < 0.05: Excellent (background-invariant)
  - drift < 0.10: Good
  - drift < 0.20: Moderate
  - drift > 0.20: Poor (background leakage)
```

#### **Blur Sensitivity Curve**
```
For blur_level in [0, 1, 2, 3, 4, 5]:  # kernel sizes
  blurred_images = apply_blur(val_images, kernel=blur_level*2+1)
  
  top1, top5, top10, top20 = evaluate_topk(model, blurred_images)
  
  blur_curve[blur_level] = {
    "top1": top1,
    "top5": top5,
    "top10": top10,
    "top20": top20
  }

Plot: blur_level vs accuracy (lines for top1, top5, top10, top20)
```

### **Hard Negative Analysis**

```
# Identify worst failures
failures = []
for probe_idx, (probe_embedding, true_cattle_id) in enumerate(probes):
  predictions = rank_gallery(probe_embedding, gallery)
  predicted_cattle_id = predictions[0]
  
  if predicted_cattle_id != true_cattle_id:
    similarity_to_predicted = predictions[0]["similarity"]
    rank_of_true = find_rank(predictions, true_cattle_id)
    similarity_to_true = get_similarity(predictions, true_cattle_id)
    
    failures.append({
      "probe_image_id": probe_idx,
      "true_cattle_id": true_cattle_id,
      "predicted_cattle_id": predicted_cattle_id,
      "similarity_margin": similarity_to_predicted - similarity_to_true,
      "rank_of_true": rank_of_true,
      "probe_quality": quality_scores[probe_idx],
      "probe_view": view_orientations[probe_idx]
    })

# Sort by similarity_margin (worst confusions have large margin)
failures.sort(key=lambda x: x["similarity_margin"], reverse=True)

# Export top 100 worst failures
hard_negatives.csv = failures[:100]

# Cluster analysis: find look-alike groups
look_alike_clusters = cluster_confused_cattle(failures)
```

### **Output Files**

**val_results.json**
```json
{
  "epoch": 50,
  "model": "run_001_resnet50_supcon",
  "val_dataset_size": 17867,
  
  "topk_metrics": {
    "top1": 0.682,
    "top5": 0.864,
    "top10": 0.921,
    "top20": 0.956
  },
  
  "rank_statistics": {
    "median_rank": 2,
    "mean_rank": 5.3,
    "p90_rank": 18,
    "p95_rank": 34,
    "percent_not_in_top20": 4.4
  },
  
  "mrr": 0.748,
  
  "similarity_metrics": {
    "self_sim_mean": 0.783,
    "self_sim_std": 0.094,
    "pos_sim_mean": 0.783,
    "neg_sim_mean": 0.267,
    "neg_sim_std": 0.112,
    "neg_sim_max": 0.623,
    "neg_sim_p95": 0.445,
    "sim_gap": 0.516
  },
  
  "embedding_health": {
    "mean_variance": 0.0287,
    "min_variance": 0.0003,
    "max_variance": 0.0821,
    "pct_low_variance_dims": 1.2,
    "mean_norm": 0.998,
    "std_norm": 0.012,
    "collapse_flag": false
  },
  
  "robustness": {
    "background_drift_mean": 0.047,
    "background_drift_std": 0.031,
    "blur_sensitivity_top1_drop": 12.3,
    "blur_sensitivity_top5_drop": 7.8
  },
  
  "performance_by_quality": {
    "excellent": {"top1": 0.756, "top5": 0.912, "top20": 0.978},
    "good": {"top1": 0.682, "top5": 0.861, "top20": 0.954},
    "borderline": {"top1": 0.534, "top5": 0.753, "top20": 0.891},
    "poor": {"top1": 0.312, "top5": 0.587, "top20": 0.782}
  },
  
  "performance_by_view": {
    "frontal": {"top1": 0.721, "top5": 0.891, "top20": 0.967},
    "oblique": {"top1": 0.673, "top5": 0.852, "top20": 0.948},
    "lateral": {"top1": 0.589, "top5": 0.801, "top20": 0.923}
  }
}
```

**hard_negatives.csv** (Top 100 worst)
```csv
probe_image_id,true_cattle_id,predicted_cattle_id,similarity_margin,rank_of_true,probe_quality,probe_view,probe_blur_score,roi_area_ratio
IMG_12345,FDETIBU17875,FDETIBU18934,0.234,47,BORDERLINE,lateral,67.3,0.23
IMG_23456,FDETIBU20005,FDETIBU20112,0.198,32,POOR,oblique,42.1,0.19
...
```

---

# 11. STAGE 8: VECTOR DATABASE BUILD

## Building Gallery from 100% Dataset

### **Process**

```
After training complete and best model selected:
  ↓
1. Load best model checkpoint
   model.load_state_dict(best_checkpoint)
   model.eval()
  ↓
  
2. Process ALL 89,334 usable images
   (Train + Val + any others not in test)
  ↓
  
3. For each image in batches:
   - Load face ROI (preprocessed with SAM)
   - Apply deterministic preprocessing
     * Resize to 224×224
     * Normalize
     * NO random augmentation
   - Forward through model
   - Extract embedding (512-dim)
   - L2 normalize
  ↓
  
4. Store embeddings in chunked format
   (For memory efficiency with 90K images)
  ↓
  
5. Build mapping tables
   - index → image_id
   - index → cattle_id
   - cattle_id → list of indices
  ↓
  
6. Build FAISS index for fast search
   - Flat (exact) for small scale
   - IVF/HNSW for large scale
  ↓
  
7. Store metadata per embedding
   - Quality score
   - ROI completeness
   - View orientation
   - Original image path
  ↓
  
8. Generate gallery statistics report
```

### **Parallel Processing Strategy**

```python
# Pseudocode for efficient embedding extraction
total_images = 89334
batch_size = 256  # Large batch for GPU efficiency
num_workers = 16

# Create dataloader (no augmentation, deterministic)
gallery_loader = DataLoader(
    gallery_dataset,
    batch_size=batch_size,
    num_workers=num_workers,
    shuffle=False,  # Keep order
    pin_memory=True
)

all_embeddings = []
all_image_ids = []
all_cattle_ids = []

model.eval()
with torch.no_grad():
    for batch_idx, (images, image_ids, cattle_ids) in enumerate(gallery_loader):
        images = images.cuda()
        
        # Forward pass
        embeddings = model(images)  # [batch_size, 512]
        embeddings = F.normalize(embeddings, p=2, dim=1)  # L2 normalize
        
        # Store
        all_embeddings.append(embeddings.cpu().numpy())
        all_image_ids.extend(image_ids)
        all_cattle_ids.extend(cattle_ids)
        
        # Progress
        if batch_idx % 100 == 0:
            print(f"Processed {batch_idx * batch_size} / {total_images}")

# Concatenate all
embeddings_matrix = np.concatenate(all_embeddings, axis=0)  # [89334, 512]

# Save in chunks (for memory-mapped access later)
save_embeddings_chunked(embeddings_matrix, chunk_size=10000)
```

### **Gallery Directory Structure**

```
gallery/face_embeddings_v1/
├── embeddings/
│   ├── embeddings_chunk_00.npy    # [10000, 512]
│   ├── embeddings_chunk_01.npy
│   ├── ...
│   ├── embeddings_chunk_08.npy    # [9334, 512] (last chunk)
│   └── embeddings_metadata.npz    # Shape info, dtype, etc.
│
├── mappings/
│   ├── index_to_image_id.csv
│   │   # index,image_id
│   │   # 0,IMG_00001
│   │   # 1,IMG_00002
│   │   # ...
│   │
│   ├── index_to_cattle_id.csv
│   │   # index,cattle_id
│   │   # 0,FDETIBU17875
│   │   # 1,FDETIBU17875
│   │   # 2,FDETIBU18219
│   │   # ...
│   │
│   └── cattle_id_to_indices.json
│       # {
│       #   "FDETIBU17875": [0, 1],
│       #   "FDETIBU18219": [2, 3, 4],
│       #   ...
│       # }
│
├── metadata/
│   ├── face_quality_scores.csv
│   │   # index,quality_bucket,blur_score,face_completeness,muzzle_clarity
│   │   # 0,EXCELLENT,145.2,0.92,0.95
│   │   # ...
│   │
│   ├── roi_stats.csv
│   │   # index,roi_area_ratio,horn_complete,view_orientation
│   │   # 0,0.324,0.95,frontal
│   │   # ...
│   │
│   └── image_paths.csv
│       # index,original_path,roi_path
│       # 0,data/raw/cattle_90k/FDETIBU17875/image.jpg,data/processed/face_roi_v1/images/IMG_00001.jpg
│       # ...
│
├── index/
│   ├── faiss_flat.index         # Exact L2 search (small scale)
│   ├── faiss_ivf4096_pq32.index # Approximate search (fast)
│   └── index_config.json
│       # {
│       #   "index_type": "IVF4096,PQ32",
│       #   "metric": "L2",
│       #   "dimension": 512,
│       #   "n_vectors": 89334,
│       #   "trained": true
│       # }
│
├── model_info/
│   ├── model_checkpoint.txt
│   │   # models/trained/run_001_resnet50_supcon/checkpoints/best.pth
│   │
│   ├── preprocessing_signature.json
│   │   # {
│   │   #   "roi_strategy": "face_head_sam",
│   │   #   "sam_model": "vit_h",
│   │   #   "image_size": 224,
│   │   #   "normalization": {
│   │   #     "mean": [0.485, 0.456, 0.406],
│   │   #     "std": [0.229, 0.224, 0.225]
│   │   #   },
│   │   #   "background_mode": "replace"
│   │   # }
│   │
│   └── dataset_version.txt
│       # face_roi_v1
│       # Generated: 2026-01-08
│       # SAM checkpoint: sam_vit_h_4b8939.pth
│
└── gallery_statistics.json
    # {
    #   "total_embeddings": 89334,
    #   "unique_cattle": 68432,
    #   "embeddings_per_cattle": {
    #     "mean": 1.31,
    #     "median": 1,
    #     "min": 1,
    #     "max": 8
    #   },
    #   "build_time_hours": 2.3,
    #   "model_used": "run_001_resnet50_supcon",
    #   "embedding_dimension": 512,
    #   "quality_distribution": {
    #     "EXCELLENT": 28765,
    #     "GOOD": 35221,
    #     "BORDERLINE": 18432,
    #     "POOR": 5897,
    #     "FAIR": 1019
    #   }
    # }
```

### **FAISS Index Building**

```python
import faiss

# Load embeddings
embeddings = load_embeddings_chunked()  # [89334, 512]
d = 512  # Embedding dimension

# Option 1: Flat index (exact, but slower for large N)
index_flat = faiss.IndexFlatL2(d)
index_flat.add(embeddings)
faiss.write_index(index_flat, "gallery/index/faiss_flat.index")

# Option 2: IVF index (fast approximate search)
nlist = 4096  # Number of clusters
quantizer = faiss.IndexFlatL2(d)
index_ivf = faiss.IndexIVFPQ(quantizer, d, nlist, 32, 8)
# Train index
index_ivf.train(embeddings)
index_ivf.add(embeddings)
faiss.write_index(index_ivf, "gallery/index/faiss_ivf4096_pq32.index")

# Option 3: HNSW index (very fast, more memory)
index_hnsw = faiss.IndexHNSWFlat(d, 32)
index_hnsw.add(embeddings)
faiss.write_index(index_hnsw, "gallery/index/faiss_hnsw.index")
```

### **Query Interface**

```python
# Pseudocode for querying the gallery

def query_cattle(query_image_path, top_k=20):
    """
    Query the gallery with a new cattle image.
    
    Returns:
        results: List of (cattle_id, similarity, image_path, metadata)
    """
    # 1. Preprocess query image (same as training)
    query_face_roi = preprocess_query_image(query_image_path)
    #    - Run SAM to get face ROI
    #    - Resize to 224×224
    #    - Normalize
    
    # 2. Extract embedding
    model.eval()
    with torch.no_grad():
        query_embedding = model(query_face_roi)
        query_embedding = F.normalize(query_embedding, p=2, dim=1)
    query_embedding_np = query_embedding.cpu().numpy()
    
    # 3. Search gallery
    index = faiss.read_index("gallery/index/faiss_ivf4096_pq32.index")
    distances, indices = index.search(query_embedding_np, top_k)
    
    # 4. Map indices to cattle IDs
    results = []
    for idx, dist in zip(indices[0], distances[0]):
        cattle_id = get_cattle_id_by_index(idx)
        similarity = 1 - dist / 2  # Convert L2 distance to cosine similarity
        image_path = get_image_path_by_index(idx)
        metadata = get_metadata_by_index(idx)
        
        results.append({
            "cattle_id": cattle_id,
            "similarity": similarity,
            "image_path": image_path,
            "quality": metadata["quality_bucket"],
            "view": metadata["view_orientation"]
        })
    
    return results
```

---

# 12. STAGE 9: TEST EVALUATION

## Test Dataset Handling

### **Test Dataset Structure**

Test dataset can have either structure:
```
test_dataset/
├── FDETIBU20001/
│   ├── test_img_1.jpg
│   └── test_img_2.jpg
├── FDETIBU20002_test.jpg
├── FDETIBU20003_facePic.jpg
└── ...
```

### **Cattle ID Extraction Logic**

```python
def extract_cattle_id_from_test(image_path):
    """
    Extract cattle ID from folder name or filename.
    
    Patterns:
      - Folder: test_dataset/FDETIBU20001/image.jpg → FDETIBU20001
      - Filename: test_dataset/FDETIBU20002_test.jpg → FDETIBU20002
    """
    # Try folder name first
    folder_name = os.path.basename(os.path.dirname(image_path))
    if is_valid_cattle_id(folder_name):
        return folder_name
    
    # Try filename
    filename = os.path.basename(image_path)
    # Remove extension and suffix
    cattle_id_candidate = filename.split('_')[0].split('.')[0]
    if is_valid_cattle_id(cattle_id_candidate):
        return cattle_id_candidate
    
    # If neither works, flag for manual review
    return None
```

### **Test Evaluation Process**

```
1. Scan test dataset
   ↓
   - Extract cattle IDs
   - Count images per cattle
   - Check for ID extraction failures
   ↓
   
2. Check gallery presence
   ↓
   For each unique test cattle ID:
     if cattle_id in gallery_cattle_ids:
       mark as "KNOWN"
     else:
       mark as "UNKNOWN"
   ↓
   
3. Process test images (same preprocessing as training)
   ↓
   - Run SAM face ROI
   - Resize, normalize
   - Extract embeddings
   ↓
   
4. Query gallery
   ↓
   For each test embedding:
     - Search top-K from gallery
     - Record ranks of true cattle_id
   ↓
   
5. Evaluate KNOWN cattle
   ↓
   - Top-1/5/10/20 accuracy
   - CMC curve
   - MRR
   - Rank distribution
   ↓
   
6. Evaluate UNKNOWN cattle (optional)
   ↓
   - Top-1 similarity score distribution
   - Rejection rate at threshold
   - False accept rate
   ↓
   
7. Generate final test report
```

### **Test Evaluation Outputs**

**test_results.json**
```json
{
  "test_date": "2026-01-15",
  "model": "run_001_resnet50_supcon",
  "gallery_version": "face_embeddings_v1",
  "gallery_size": 89334,
  
  "test_dataset": {
    "total_images": 5234,
    "unique_cattle": 3821,
    "extraction_success_rate": 0.998,
    "extraction_failures": 12
  },
  
  "cattle_presence": {
    "known_cattle": 3215,  # In gallery
    "unknown_cattle": 606,  # Not in gallery
    "known_percentage": 0.841
  },
  
  "known_cattle_results": {
    "total_queries": 4523,
    
    "topk_metrics": {
      "top1": 0.673,
      "top5": 0.852,
      "top10": 0.914,
      "top20": 0.951
    },
    
    "rank_statistics": {
      "median_rank": 2,
      "mean_rank": 6.1,
      "p90_rank": 21,
      "p95_rank": 38,
      "percent_not_in_top20": 4.9
    },
    
    "mrr": 0.738,
    
    "performance_by_quality": {
      "excellent": {"top1": 0.742, "top5": 0.901, "top20": 0.973},
      "good": {"top1": 0.671, "top5": 0.849, "top20": 0.948},
      "borderline": {"top1": 0.523, "top5": 0.741, "top20": 0.882},
      "poor": {"top1": 0.289, "top5": 0.564, "top20": 0.761}
    }
  },
  
  "unknown_cattle_results": {
    "total_queries": 711,
    
    "top1_similarity_distribution": {
      "mean": 0.534,
      "std": 0.112,
      "max": 0.823
    },
    
    "rejection_analysis": {
      "threshold_0.6": {"rejection_rate": 0.687, "false_accept_rate": 0.313},
      "threshold_0.7": {"rejection_rate": 0.842, "false_accept_rate": 0.158},
      "threshold_0.8": {"rejection_rate": 0.951, "false_accept_rate": 0.049}
    }
  },
  
  "confusion_analysis": {
    "top_confused_pairs": [
      {"true_id": "FDETIBU20001", "predicted_id": "FDETIBU20234", "count": 12},
      {"true_id": "FDETIBU20045", "predicted_id": "FDETIBU20067", "count": 8}
    ]
  }
}
```

**final_test_report.pdf** contains:

1. **Executive Summary**
   - Test dataset description
   - Overall performance (Top-K)
   - Key findings

2. **Dataset Composition**
   - Image count, cattle count
   - Quality distribution
   - Known vs unknown cattle

3. **Performance Metrics**
   - Top-1/5/10/20 accuracy
   - CMC curve plot
   - Rank distribution histogram

4. **Performance Breakdown**
   - By quality bucket
   - By view orientation
   - By number of images per cattle

5. **Qualitative Examples**
   - 20 success cases (Top-1 correct, high similarity)
   - 20 failure cases (Top-1 wrong, with analysis)
   - 10 near-miss cases (true cattle in Top-5 but not Top-1)

6. **Confusion Analysis**
   - Top confused cattle pairs
   - Look-alike clusters visualization

7. **Recommendations**
   - Suggested operating thresholds
   - Deployment considerations
   - Known limitations

8. **Disclaimer**
   - "This test dataset was not used for any training, validation, or model selection decisions."

---

# 13. RESUME CAPABILITIES

## Complete Resume System

### **What Gets Saved in Checkpoint**

```python
checkpoint = {
    # Model
    "model_state_dict": model.state_dict(),
    "model_architecture": str(model),
    
    # Optimizer
    "optimizer_state_dict": optimizer.state_dict(),
    "scheduler_state_dict": scheduler.state_dict(),
    
    # AMP (if used)
    "scaler_state_dict": scaler.state_dict() if use_amp else None,
    
    # Training progress
    "epoch": current_epoch,
    "global_step": current_step,
    "best_metric": best_val_metric,
    "best_epoch": best_epoch,
    
    # Metrics history
    "train_loss_history": train_losses,
    "val_metrics_history": val_metrics,
    
    # Early stopping
    "patience_counter": early_stopping_counter,
    
    # Freeze state
    "frozen_layers": list_of_frozen_layer_names,
    "trainable_params": trainable_param_count,
    
    # Config
    "config": config_dict,
    "config_hash": hash(config_yaml),
    
    # Data versioning
    "dataset_version": "face_roi_v1",
    "train_manifest_hash": hash(train_manifest),
    "val_manifest_hash": hash(val_manifest),
    
    # Reproducibility
    "random_state": {
        "python": random.getstate(),
        "numpy": np.random.get_state(),
        "torch": torch.get_rng_state(),
        "torch_cuda": torch.cuda.get_rng_state_all() if use_cuda else None
    }
}

torch.save(checkpoint, checkpoint_path)
```

### **Resume Logic**

```python
def resume_training(checkpoint_path, config):
    """
    Resume training from checkpoint.
    """
    print(f"Resuming from {checkpoint_path}")
    
    # Load checkpoint
    checkpoint = torch.load(checkpoint_path)
    
    # Validate compatibility
    validate_resume_compatibility(checkpoint, config)
    
    # Restore model
    model = create_model(config)
    model.load_state_dict(checkpoint["model_state_dict"])
    print(f"✓ Model restored")
    
    # Restore freeze state
    restore_freeze_state(model, checkpoint["frozen_layers"])
    print(f"✓ Freeze state restored: {len(checkpoint['frozen_layers'])} layers frozen")
    
    # Restore optimizer
    optimizer = create_optimizer(config, model)
    optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
    print(f"✓ Optimizer restored")
    
    # Restore scheduler
    scheduler = create_scheduler(config, optimizer)
    scheduler.load_state_dict(checkpoint["scheduler_state_dict"])
    print(f"✓ Scheduler restored (LR: {scheduler.get_last_lr()})")
    
    # Restore AMP scaler
    if config.use_amp:
        scaler = torch.cuda.amp.GradScaler()
        scaler.load_state_dict(checkpoint["scaler_state_dict"])
        print(f"✓ AMP scaler restored")
    
    # Restore training progress
    start_epoch = checkpoint["epoch"] + 1
    global_step = checkpoint["global_step"]
    best_metric = checkpoint["best_metric"]
    print(f"✓ Resuming from epoch {start_epoch}, step {global_step}")
    print(f"✓ Best validation metric so far: {best_metric:.4f}")
    
    # Restore random states (for reproducibility)
    random.setstate(checkpoint["random_state"]["python"])
    np.random.set_state(checkpoint["random_state"]["numpy"])
    torch.set_rng_state(checkpoint["random_state"]["torch"])
    if checkpoint["random_state"]["torch_cuda"]:
        torch.cuda.set_rng_state_all(checkpoint["random_state"]["torch_cuda"])
    print(f"✓ Random states restored")
    
    # Restore metrics history
    train_loss_history = checkpoint["train_loss_history"]
    val_metrics_history = checkpoint["val_metrics_history"]
    print(f"✓ Metrics history restored ({len(train_loss_history)} epochs)")
    
    return {
        "model": model,
        "optimizer": optimizer,
        "scheduler": scheduler,
        "scaler": scaler if config.use_amp else None,
        "start_epoch": start_epoch,
        "global_step": global_step,
        "best_metric": best_metric,
        "train_loss_history": train_loss_history,
        "val_metrics_history": val_metrics_history
    }


def validate_resume_compatibility(checkpoint, config):
    """
    Ensure checkpoint is compatible with current config.
    """
    # Check dataset version
    if checkpoint["dataset_version"] != config.dataset_version:
        raise ValueError(
            f"Dataset version mismatch: "
            f"checkpoint={checkpoint['dataset_version']}, "
            f"config={config.dataset_version}"
        )
    
    # Check train/val manifests haven't changed
    current_train_hash = hash_file(config.train_manifest)
    if current_train_hash != checkpoint["train_manifest_hash"]:
        print("WARNING: Train manifest has changed since checkpoint!")
        if not config.allow_manifest_change:
            raise ValueError("Train manifest mismatch")
    
    # Check model architecture
    expected_arch = str(create_model(config))
    if expected_arch != checkpoint["model_architecture"]:
        print("WARNING: Model architecture may have changed!")
        if config.strict_resume:
            raise ValueError("Architecture mismatch")
    
    print("✓ Compatibility checks passed")
```

### **Resume with Freeze Strategy Change**

```python
# Example: Resume but change freeze strategy

# Original checkpoint: layer1+layer2 frozen
checkpoint = torch.load("checkpoints/epoch_30.pth")

# Current config: Unfreeze layer3 (planned at epoch 40)
# But we're resuming at epoch 31, so manually trigger unfreeze

config.resume.enabled = True
config.resume.checkpoint_path = "checkpoints/epoch_30.pth"
config.resume.override_freeze = True
config.resume.new_freeze_strategy = "unfreeze_layer3"

# System will:
#   1. Restore checkpoint state
#   2. Apply new freeze strategy
#   3. Log as "Phase transition: unfreeze_layer3"
#   4. Continue training
```

### **Resume After Crash**

```
Training crashes at epoch 47, step 1234
↓
System automatically saved "last.pth" at epoch 46 end
↓
To resume:
  python train.py --config config.yaml --resume checkpoints/last.pth
↓
System restores:
  - All model weights
  - Optimizer state (momentum buffers)
  - Scheduler state (LR schedule position)
  - AMP scaler state
  - Random states
  - Metrics history
↓
Training continues seamlessly from epoch 47
Plots show continuous curves with resume point marked
```

### **Resume Visualization in Plots**

All training curves mark resume points:
```
Loss Curve:
  Y-axis: Loss
  X-axis: Epoch
  
  Plot shows:
    - Line from epoch 0 to 30 (first training session)
    - Vertical dashed line at epoch 30 labeled "RESUME"
    - Line continues from epoch 30 to 100 (resumed session)
    - Color/style may change slightly for clarity
```

---

# 14. DYNAMIC RECOMMENDATIONS ENGINE

## Recommendation System Logic

### **Dataset Analysis → Recommendations**

```python
def generate_recommendations(analysis_results):
    """
    Generate preprocessing, augmentation, freeze, and training recommendations
    based on dataset analysis.
    """
    recommendations = {}
    
    # 1. Preprocessing Recommendations
    if analysis_results["quality_excellent_pct"] > 70:
        recommendations["preprocessing"] = {
            "heavy_preprocessing_needed": False,
            "reason": "Dataset quality is excellent",
            "actions": ["Skip deblurring", "Skip enhancement", "Light normalization only"]
        }
    elif analysis_results["blur_mean"] < 60:
        recommendations["preprocessing"] = {
            "heavy_preprocessing_needed": True,
            "reason": "High blur percentage detected",
            "actions": ["Enable sharpening", "Increase blur augmentation", "Consider quality filtering"]
        }
    
    # 2. SAM ROI Recommendations
    if analysis_results["rope_presence_rate"] > 0.15:
        recommendations["roi"] = {
            "sam_priority": "CRITICAL",
            "reason": f"{analysis_results['rope_presence_rate']*100:.1f}% images have rope/halter",
            "actions": ["Enable aggressive rope removal", "Verify SAM samples carefully"]
        }
    else:
        recommendations["roi"] = {
            "sam_priority": "HIGH",
            "reason": "Background varies significantly",
            "actions": ["Standard SAM processing", "Background replacement recommended"]
        }
    
    # 3. Augmentation Strategy
    view_diversity = analysis_results["view_distribution_entropy"]
    if view_diversity > 1.5:  # High diversity
        recommendations["augmentation"] = {
            "strength": "STRONG",
            "focus": ["Geometric augmentations", "View-robust training"],
            "rotation_range": [-15, 15],
            "perspective_probability": 0.3
        }
    else:  # Low diversity (mostly one view type)
        recommendations["augmentation"] = {
            "strength": "MODERATE",
            "focus": ["Photometric augmentations", "Simulate missing views carefully"],
            "rotation_range": [-10, 10],
            "perspective_probability": 0.2
        }
    
    # 4. Train/Val Split
    images_per_cattle_median = analysis_results["images_per_cattle_median"]
    if images_per_cattle_median == 1:
        recommendations["split"] = {
            "ratio": "80/20",
            "reason": "Most cattle have 1 image - need large train set",
            "stratification": "by_cattle_id"
        }
    else:
        recommendations["split"] = {
            "ratio": "70/30",
            "reason": "Sufficient images per cattle - can afford larger val set",
            "stratification": "stratified_by_cattle_and_quality"
        }
    
    # 5. Freeze Strategy
    total_images = analysis_results["total_usable_images"]
    if total_images < 20000:
        recommendations["freeze"] = {
            "initial_freeze": "70%",
            "reason": "Small dataset - freeze more to prevent overfitting",
            "schedule": [
                {"epoch": 30, "unfreeze": "10%"},
                {"epoch": 60, "unfreeze": "remaining"}
            ]
        }
    elif total_images < 50000:
        recommendations["freeze"] = {
            "initial_freeze": "50%",
            "reason": "Medium dataset - moderate freezing",
            "schedule": [
                {"epoch": 20, "unfreeze": "layer3"},
                {"epoch": 40, "unfreeze": "all"}
            ]
        }
    else:  # >50K
        recommendations["freeze"] = {
            "initial_freeze": "30%",
            "reason": "Large dataset - can train more layers",
            "schedule": [
                {"epoch": 10, "unfreeze": "all"}
            ]
        }
    
    # 6. Expected Performance
    quality_score = analysis_results["dataset_quality_score"]  # 0-1
    if quality_score > 0.8 and total_images > 50000:
        recommendations["expected_performance"] = {
            "level": "HIGH",
            "top1_estimate": "70-80%",
            "top5_estimate": "85-92%",
            "top20_estimate": "93-97%"
        }
    elif quality_score > 0.6:
        recommendations["expected_performance"] = {
            "level": "MEDIUM-HIGH",
            "top1_estimate": "60-70%",
            "top5_estimate": "78-87%",
            "top20_estimate": "88-94%"
        }
    else:
        recommendations["expected_performance"] = {
            "level": "MEDIUM",
            "top1_estimate": "50-65%",
            "top5_estimate": "70-82%",
            "top20_estimate": "82-91%"
        }
    
    return recommendations
```

### **Adaptive Augmentation Logic**

```python
def get_augmentation_for_image(image, metadata):
    """
    Dynamically adjust augmentation strength based on image quality.
    """
    blur_score = metadata["blur_score"]
    resolution = metadata["min_side"]
    quality_bucket = metadata["quality_bucket"]
    
    if quality_bucket == "EXCELLENT" and resolution > 1024:
        # High quality - can use strong augmentation
        return {
            "geometric_probability": 0.7,
            "blur_probability": 0.5,
            "cutout_probability": 0.15,
            "rotation_range": [-15, 15],
            "perspective_enabled": True
        }
    
    elif quality_bucket == "GOOD":
        # Moderate augmentation
        return {
            "geometric_probability": 0.5,
            "blur_probability": 0.3,
            "cutout_probability": 0.1,
            "rotation_range": [-10, 10],
            "perspective_enabled": True
        }
    
    elif blur_score < 60:
        # Already blurry - reduce degradation augmentations
        return {
            "geometric_probability": 0.3,
            "blur_probability": 0.0,  # Don't add more blur
            "cutout_probability": 0.0,  # Too risky
            "rotation_range": [-8, 8],
            "perspective_enabled": False
        }
    
    elif resolution < 512:
        # Small resolution - be careful with crops
        return {
            "geometric_probability": 0.4,
            "blur_probability": 0.2,
            "cutout_probability": 0.05,
            "rotation_range": [-10, 10],
            "crop_scale_min": 0.9,  # Don't crop too aggressively
            "perspective_enabled": False
        }
    
    else:
        # Default moderate
        return get_default_augmentation_config()
```

---

# 15. MONITORING & VISUALIZATION

## Live Training Dashboard

### **Metrics to Display (Real-time)**

```
┌─────────────────────────────────────────────────────────────────┐
│             CATTLE FACE BIOMETRICS - TRAINING MONITOR            │
│  Run: run_001_resnet50_supcon                                   │
│  Epoch: 47/100    Step: 12,345/30,000    ETA: 2h 15m           │
└─────────────────────────────────────────────────────────────────┘

┌──────────── LOSS & LEARNING RATE ───────────────┐
│                                                  │
│  Train Loss:  1.234 ▼                           │
│  Val Loss:    1.567 ▼                           │
│  Learning Rate: 0.000123                        │
│                                                  │
│  [Loss curve plot - last 50 epochs]             │
│   3.0 ┤                                          │
│   2.5 ┤╮                                         │
│   2.0 ┤╰─╮                                       │
│   1.5 ┤  ╰─╮                                     │
│   1.0 ┤    ╰────────────                         │
│       └────────────────────────────> epoch       │
│         0   10   20   30   40   50              │
└──────────────────────────────────────────────────┘

┌──────────── SIMILARITY METRICS ─────────────────┐
│                                                  │
│  SELF-SIM:  0.783 ▲  [Target: > 0.7]           │
│  NEG-SIM:   0.267 ▼  [Target: < 0.3]           │
│  SIM GAP:   0.516 ▲  [Target: > 0.3] ✓         │
│                                                  │
│  [SIM GAP trend plot]                           │
│   0.6 ┤            ╭─────────                    │
│   0.5 ┤         ╭──╯                             │
│   0.4 ┤      ╭──╯                                │
│   0.3 ┤   ╭──╯                                   │
│   0.2 ┤╭──╯                                      │
│       └────────────────────────────> epoch       │
└──────────────────────────────────────────────────┘

┌──────────── EMBEDDING HEALTH ───────────────────┐
│                                                  │
│  Mean Variance:  0.0287  ✓                      │
│  Min Variance:   0.0003  ✓                      │
│  Low-var dims:   1.2%    ✓                      │
│  Collapse Flag:  FALSE   ✓                      │
│                                                  │
│  Embedding Norm: 0.998 ± 0.012  ✓               │
└──────────────────────────────────────────────────┘

┌──────────── TOP-K PERFORMANCE ──────────────────┐
│                                                  │
│  Top-1:   68.2% ▲                               │
│  Top-5:   86.4% ▲                               │
│  Top-10:  92.1% ▲                               │
│  Top-20:  95.6% ▲                               │
│  MRR:     0.748 ▲                               │
│                                                  │
│  [Top-K trend plot]                             │
│  100% ┤                    ╭────── Top-20        │
│   90% ┤             ╭──────╯                     │
│   80% ┤       ╭─────╯            Top-5          │
│   70% ┤  ╭────╯                                  │
│   60% ┤╭─╯                       Top-1          │
│       └────────────────────────────> epoch       │
└──────────────────────────────────────────────────┘

┌──────────── SYSTEM RESOURCES ──────────────────┐
│                                                  │
│  GPU Utilization:  94%   [████████████████░░]   │
│  GPU Memory:       7234 MB / 8192 MB            │
│  Throughput:       187 images/sec               │
│  Time/Epoch:       18 minutes                   │
│                                                  │
└──────────────────────────────────────────────────┘

┌──────────── ALERTS & WARNINGS ─────────────────┐
│                                                  │
│  [No alerts]                                    │
│                                                  │
└──────────────────────────────────────────────────┘

Last Updated: 2026-01-08 14:23:45
Press 'q' to quit | 'r' to refresh | 's' to save snapshot
```

### **Alert Conditions**

System triggers warnings for:

```
⚠️  COLLAPSE DETECTED
    - Mean embedding variance < 0.01
    - NEG-SIM > 0.5
    - Low-var dims > 50%
    Action: Stop training, investigate loss/augmentation

⚠️  OVERFITTING DETECTED
    - Train loss still decreasing
    - Val loss increasing for 5+ epochs
    Action: Early stopping or reduce LR

⚠️  GRADIENT EXPLOSION
    - Gradient norm > 10.0
    Action: Reduce LR or check data

⚠️  SIM GAP DECREASING
    - SIM GAP drops below 0.2 after being > 0.3
    Action: Check augmentation strength or loss temperature

⚠️  BACKGROUND LEAKAGE
    - Background drift score > 0.2
    Action: Verify SAM ROI quality

⚠️  TOP-K PLATEAU
    - No improvement in Top-20 for 10 epochs
    Action: Consider unfreezing layers or adjusting augmentation
```

---

# COMPLETE SYSTEM SUMMARY

## Key Takeaways

### **What Makes This System Production-Grade**

✅ **Complete Pipeline**: Raw data → Quality analysis → ROI → Training → Evaluation → Deployment

✅ **Decision-Driven**: Data analysis drives all decisions (not hardcoded rules)

✅ **Reproducible**: Versioning, seeds, config snapshots, deterministic eval

✅ **Extensible**: Plugin architecture for ROI/augmentation/losses/backbones

✅ **Verified**: Visual verification at every stage (SAM, augmentation, failures)

✅ **Resumable**: Full checkpoint system with freeze state preservation

✅ **Scalable**: Parallel processing, chunked storage, FAISS indexing

✅ **Monitored**: Live dashboard, alerts, comprehensive reporting

✅ **Complete Documentation**: Every folder, every file, every metric explained

---

**This is your complete system. Everything is specified. Ready to implement.**


# COMPLETE CATTLE BIOMETRIC SYSTEM - CLI-BASED DESIGN
## Single-Branch Architecture | No Code | Pure System Design

---

# TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [CLI Design Philosophy](#2-cli-design-philosophy)
3. [Command Structure](#3-command-structure)
4. [Interactive vs Batch Mode](#4-interactive-vs-batch-mode)
5. [Complete Workflow Commands](#5-complete-workflow-commands)
6. [Configuration Management](#6-configuration-management)
7. [Progress Tracking & Logging](#7-progress-tracking-logging)
8. [Resume & Recovery](#8-resume-recovery)
9. [Output & Reporting](#9-output-reporting)
10. [Deployment & Usage](#10-deployment-usage)

---

# 1. SYSTEM ARCHITECTURE OVERVIEW

## Single-Branch Model Architecture (FINAL)

```
┌─────────────────────────────────────────────────────────┐
│                    INPUT: Face ROI                       │
│                    (224×224×3 RGB)                       │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│              BACKBONE: ResNet50                          │
│              (ImageNet Pretrained)                       │
│                                                          │
│  • Captures ALL face information:                       │
│    - Overall face structure                             │
│    - Muzzle patterns                                    │
│    - Color/markings                                     │
│    - Horn configuration                                 │
│    - Shape/proportions                                  │
│    - Eyes, ears, all features                           │
│                                                          │
│  Output: 2048-dimensional feature vector                │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│              PROJECTION HEAD                             │
│                                                          │
│  Layer 1: Linear (2048 → 1024)                          │
│  Activation: ReLU                                       │
│  Regularization: Dropout (0.1)                          │
│  Layer 2: Linear (1024 → 512)                           │
│                                                          │
│  Output: 512-dimensional raw embedding                  │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│              L2 NORMALIZATION (CRITICAL)                 │
│                                                          │
│  • Projects embedding onto unit hypersphere             │
│  • Vector length = 1.0 exactly                          │
│  • Individual values typically in [-1, 1]               │
│  • Enables fast cosine similarity via dot product       │
│                                                          │
│  Output: 512-dimensional normalized embedding           │
└──────────────────────┬──────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│         METRIC LEARNING LOSS                             │
│         (Supervised Contrastive / ArcFace Proxy)        │
│                                                          │
│  • Pulls same-cattle embeddings together                │
│  • Pushes different-cattle embeddings apart             │
│  • Temperature parameter controls hardness              │
└─────────────────────────────────────────────────────────┘
```

## System Components

```
┌────────────────────────────────────────────────────────┐
│                  CLI INTERFACE                          │
│  User interacts via terminal commands                  │
└────────────────┬───────────────────────────────────────┘
                 ↓
┌────────────────────────────────────────────────────────┐
│              COMMAND DISPATCHER                         │
│  Routes commands to appropriate modules                │
└────────────────┬───────────────────────────────────────┘
                 ↓
        ┌────────┴────────┬────────┬────────┬────────┐
        ↓                 ↓        ↓        ↓        ↓
┌──────────────┐  ┌──────────┐ ┌───────┐ ┌──────┐ ┌──────┐
│   Dataset    │  │   SAM    │ │ Train │ │ Eval │ │Deploy│
│   Analysis   │  │   ROI    │ │       │ │      │ │      │
│   Module     │  │  Module  │ │Module │ │Module│ │Module│
└──────────────┘  └──────────┘ └───────┘ └──────┘ └──────┘
        ↓                 ↓        ↓        ↓        ↓
┌────────────────────────────────────────────────────────┐
│              STORAGE & STATE MANAGER                    │
│  • Configuration persistence                           │
│  • Checkpoint management                               │
│  • Results tracking                                    │
└────────────────────────────────────────────────────────┘
```

---

# 2. CLI DESIGN PHILOSOPHY

## Design Principles

### **Principle 1: Single Responsibility per Command**
Each command does ONE thing well.

### **Principle 2: Progressive Disclosure**
Simple commands for simple tasks, advanced options available when needed.

### **Principle 3: Fail-Fast with Clear Errors**
Validate inputs immediately, provide actionable error messages.

### **Principle 4: Resumable by Default**
Every long-running operation can be resumed after interruption.

### **Principle 5: Observable Progress**
Real-time progress bars, ETAs, and status updates.

---

# 3. COMMAND STRUCTURE

## Main CLI Entry Point

```
cattle-bio [COMMAND] [OPTIONS]
```

## Command Hierarchy

```
cattle-bio
│
├── init                    # Initialize new project
├── status                  # Show project status
├── config                  # Manage configuration
│   ├── show               # Display current config
│   ├── edit               # Open config in editor
│   ├── validate           # Check config validity
│   └── reset              # Reset to defaults
│
├── data                    # Data management commands
│   ├── analyze            # Analyze dataset quality
│   ├── split              # Create train/val splits
│   ├── stats              # Show dataset statistics
│   └── verify             # Verify data integrity
│
├── roi                     # ROI preprocessing commands
│   ├── process            # Run SAM face segmentation
│   ├── verify             # Generate verification samples
│   ├── stats              # ROI processing statistics
│   └── resume             # Resume interrupted ROI processing
│
├── augment                 # Augmentation commands
│   ├── gallery            # Generate augmentation gallery
│   ├── test               # Test augmentation on samples
│   └── optimize           # Find optimal augmentation params
│
├── train                   # Training commands
│   ├── start              # Start new training
│   ├── resume             # Resume from checkpoint
│   ├── monitor            # Watch training progress
│   └── stop               # Gracefully stop training
│
├── eval                    # Evaluation commands
│   ├── validate           # Run validation evaluation
│   ├── test               # Run test evaluation
│   └── analyze            # Analyze evaluation results
│
├── gallery                 # Vector database commands
│   ├── build              # Build embedding gallery
│   ├── query              # Query gallery with image
│   ├── stats              # Gallery statistics
│   └── export             # Export gallery for deployment
│
├── pipeline                # Full pipeline commands
│   ├── run                # Run complete pipeline
│   ├── resume-from        # Resume pipeline from stage
│   └── dry-run            # Validate without execution
│
└── report                  # Reporting commands
    ├── generate           # Generate reports
    ├── export             # Export results
    └── dashboard          # Launch web dashboard
```

---

# 4. INTERACTIVE VS BATCH MODE

## Interactive Mode (Guided Wizard)

### When to Use
- First-time users
- Uncertain about parameters
- Want recommendations based on data
- Prefer step-by-step guidance

### How It Works
```
User runs: cattle-bio pipeline run --interactive

System:
  Step 1/8: Dataset Location
  ─────────────────────────────
  Where is your cattle dataset?
  [1] Local directory
  [2] Cloud storage (AWS S3)
  [3] Network drive
  
  Choice [1]: █
  
  ↓ User selects option 1
  
  Enter directory path: /data/cattle_90k█
  
  ↓ System validates path
  
  ✓ Found 89,847 images
  ✓ Detected directory structure: folder-per-cattle
  
  Continue? [Y/n]: y
  
  ─────────────────────────────
  Step 2/8: Initial Analysis
  ─────────────────────────────
  Running dataset quality analysis...
  
  [████████████████████████████] 100% | 89847/89847 | ETA: 0s
  
  Analysis complete!
  
  Summary:
  • Total images: 89,847
  • Unique cattle: 68,432
  • Quality: 71.6% excellent/good
  • Resolution: 89.2% above 512px
  • Issues: 13.9% rope/halter detected
  
  ✓ Dataset quality is GOOD
  
  Recommendations:
  → SAM ROI preprocessing: REQUIRED (rope removal)
  → Heavy preprocessing: NOT NEEDED
  → Augmentation strength: MODERATE-TO-STRONG
  
  Apply recommendations? [Y/n]: y
  
  ─────────────────────────────
  Step 3/8: ROI Configuration
  ─────────────────────────────
  Face/head ROI will be extracted using SAM.
  
  Options:
  [1] Standard quality (faster, good for most)
  [2] High quality (slower, best results)
  [3] Custom settings
  
  Choice [1]: 1
  
  Background handling:
  [1] Replace with neutral (recommended)
  [2] Blur background
  [3] Remove (black)
  
  Choice [1]: 1
  
  Generate verification samples? [Y/n]: y
  How many samples? [250]: █
  
  ... continues through all 8 steps
```

### Interactive Features
- Real-time validation
- Contextual help (press ? for help)
- Default suggestions based on analysis
- Confirmation before destructive operations
- Ability to go back to previous steps
- Save choices for future runs

---

## Batch Mode (Non-Interactive)

### When to Use
- Configuration already known
- Automation/scripting
- Reproducible experiments
- Remote/headless execution

### How It Works
```
User runs: cattle-bio pipeline run --config my_config.yaml --batch

System:
  [2026-01-08 14:23:45] Starting pipeline...
  [2026-01-08 14:23:45] ✓ Configuration loaded: my_config.yaml
  [2026-01-08 14:23:45] ✓ Output directory created: runs/run_20260108_142345/
  [2026-01-08 14:23:45] ─────────────────────────────────────
  [2026-01-08 14:23:45] Stage 1/8: Dataset Analysis
  [2026-01-08 14:23:45] Reading dataset from /data/cattle_90k...
  [2026-01-08 14:24:12] ✓ Found 89,847 images
  [2026-01-08 14:24:12] Analyzing image quality...
  [2026-01-08 14:28:34] ✓ Analysis complete
  [2026-01-08 14:28:34] Report saved: runs/run_20260108_142345/01_analysis/report.pdf
  [2026-01-08 14:28:34] ─────────────────────────────────────
  [2026-01-08 14:28:34] Stage 2/8: SAM ROI Processing
  [2026-01-08 14:28:34] Processing 89,847 images with 8 workers...
  [2026-01-08 14:28:35] Progress: 1.2% | 1024/89847 | ETA: 3h 47m
  ... continues unattended
```

### Batch Features
- No user interaction required
- Machine-readable logs (JSON)
- Timestamped operations
- Email/webhook notifications on completion
- Structured error reporting
- Exit codes for scripting

---

## Hybrid Mode (Interactive Setup, Batch Execution)

### Best of Both Worlds
```
Phase 1: Interactive configuration
  User runs: cattle-bio config wizard
  → Guided setup with recommendations
  → Saves configuration file: my_project.yaml
  → Shows preview of what will happen

Phase 2: Review and modify
  User: cattle-bio config edit my_project.yaml
  → Make manual adjustments if needed

Phase 3: Batch execution
  User: cattle-bio pipeline run --config my_project.yaml
  → Runs unattended with saved configuration
  → User can disconnect and check progress later
```

---

# 5. COMPLETE WORKFLOW COMMANDS

## Command 1: Initialize Project

```
COMMAND: cattle-bio init

PURPOSE: Create new cattle biometric project

SYNTAX:
  cattle-bio init [PROJECT_NAME] [OPTIONS]

OPTIONS:
  --path PATH              Project directory (default: current dir)
  --template TEMPLATE      Use template (basic|advanced|research)
  --interactive           Guided setup wizard
  --from-config FILE      Initialize from existing config

OUTPUT:
  Creates directory structure:
    project_name/
    ├── config/
    ├── data/
    ├── models/
    ├── results/
    └── logs/

EXAMPLE:
  cattle-bio init my_cattle_project --interactive
  cattle-bio init --template advanced --path /projects/cattle_bio
```

---

## Command 2: Dataset Analysis

```
COMMAND: cattle-bio data analyze

PURPOSE: Analyze raw dataset quality and generate recommendations

SYNTAX:
  cattle-bio data analyze [OPTIONS]

OPTIONS:
  --dataset PATH           Dataset directory (required if not in config)
  --output DIR            Output directory for reports
  --sample-size N         Analyze subset (for speed)
  --skip-duplicates       Skip duplicate detection
  --skip-quality          Skip quality metrics
  --workers N             Parallel workers (default: auto)
  --format FORMAT         Report format (pdf|xlsx|json|all)
  --show-recommendations  Print recommendations to terminal

OUTPUT:
  Generates:
    • dataset_inventory.csv
    • quality_scores.csv
    • quality_summary.xlsx
    • histograms/ (PNG charts)
    • dataset_readiness_report.json
    • preprocessing_recommendations.json

EXAMPLE:
  # Analyze with defaults
  cattle-bio data analyze --dataset /data/cattle_90k
  
  # Quick analysis on 10K sample
  cattle-bio data analyze --sample-size 10000 --format json
  
  # Full analysis with all workers
  cattle-bio data analyze --workers 32 --format all
```

---

## Command 3: Train/Val Split

```
COMMAND: cattle-bio data split

PURPOSE: Create train/validation split stratified by cattle ID

SYNTAX:
  cattle-bio data split [OPTIONS]

OPTIONS:
  --ratio FLOAT           Train ratio (default: 0.8)
  --stratify-by TYPE     Stratification (cattle_id|quality|both)
  --balance-quality      Balance quality across splits
  --balance-views        Balance view angles across splits
  --seed N               Random seed for reproducibility
  --output-dir DIR       Where to save manifests
  --dry-run              Show split stats without saving

OUTPUT:
  Generates:
    • train_manifest.csv
    • val_manifest.csv
    • split_info.json

EXAMPLE:
  # Standard 80/20 split
  cattle-bio data split --ratio 0.8
  
  # 70/30 with quality balancing
  cattle-bio data split --ratio 0.7 --balance-quality --balance-views
  
  # Preview split without saving
  cattle-bio data split --dry-run
```

---

## Command 4: SAM ROI Processing

```
COMMAND: cattle-bio roi process

PURPOSE: Extract face ROI using SAM segmentation

SYNTAX:
  cattle-bio roi process [OPTIONS]

OPTIONS:
  --input-manifest FILE   Manifest file (or process all in dataset)
  --sam-model MODEL       SAM model (vit_h|vit_l|vit_b)
  --checkpoint PATH       SAM checkpoint path
  --output-dir DIR        Where to save processed images/masks
  --background MODE       Background handling (replace|blur|black)
  --bg-source DIR         Background images for replacement
  --workers N             Parallel workers
  --gpu-ids IDS           GPU IDs to use (comma-separated)
  --batch-size N          Batch size per GPU
  --resume                Resume from interruption
  --verify-samples N      Generate N verification samples
  --skip-if-exists        Skip already processed images

OUTPUT:
  Generates:
    processed_dataset/
    ├── images/ (processed face ROIs)
    ├── masks/ (binary masks)
    ├── metadata.csv
    └── sam_report.json

EXAMPLE:
  # Process full dataset with 4 GPUs
  cattle-bio roi process --sam-model vit_h --gpu-ids 0,1,2,3 --workers 8
  
  # Process with background replacement
  cattle-bio roi process --background replace --bg-source /data/backgrounds
  
  # Resume interrupted processing
  cattle-bio roi process --resume
```

---

## Command 5: ROI Verification

```
COMMAND: cattle-bio roi verify

PURPOSE: Generate visual verification samples for SAM quality check

SYNTAX:
  cattle-bio roi verify [OPTIONS]

OPTIONS:
  --processed-dir DIR     Processed dataset directory
  --samples N             Total samples to generate (default: 250)
  --random N              Random samples
  --best N                Best quality samples
  --worst N               Worst quality samples
  --edge-cases N          Edge case samples
  --by-view               Split samples by view angle
  --by-quality            Split samples by quality bucket
  --output-dir DIR        Verification output directory
  --format FORMAT         Output format (jpg|png)
  --grid-size N           Grid size for comparisons (default: 4x4)

OUTPUT:
  Generates:
    verification_samples/
    ├── random_samples/ (step-by-step for each)
    ├── best_cases/
    ├── worst_cases/
    ├── edge_cases/
    ├── comparison_grids/
    └── verification_report.pdf

EXAMPLE:
  cattle-bio roi verify --samples 300 --by-view --by-quality
```

---

## Command 6: Augmentation Gallery

```
COMMAND: cattle-bio augment gallery

PURPOSE: Generate visual gallery of all augmentations

SYNTAX:
  cattle-bio augment gallery [OPTIONS]

OPTIONS:
  --processed-dir DIR     Processed dataset directory
  --samples N             Number of diverse samples (default: 20)
  --output-dir DIR        Gallery output directory
  --augmentations LIST    Which augmentations to show (comma-separated)
  --include-combined      Show realistic combinations
  --adaptive-examples     Show adaptive augmentation behavior
  --format FORMAT         Image format (jpg|png)

OUTPUT:
  Generates:
    augmentation_gallery/
    ├── original_samples/
    ├── photometric/
    ├── geometric/
    ├── degradation/
    ├── background/
    ├── combined/
    └── augmentation_report.pdf

EXAMPLE:
  # Full gallery
  cattle-bio augment gallery --samples 20 --include-combined
  
  # Test specific augmentations
  cattle-bio augment gallery --augmentations brightness,rotation,blur
```

---

## Command 7: Training

```
COMMAND: cattle-bio train start

PURPOSE: Start new training run

SYNTAX:
  cattle-bio train start [OPTIONS]

OPTIONS:
  --config FILE           Training config file
  --run-name NAME         Run identifier
  --train-manifest FILE   Training manifest
  --val-manifest FILE     Validation manifest
  --backbone MODEL        Backbone (resnet50|efficientnet_b2|mobilenet_v3)
  --embedding-dim N       Embedding dimension (default: 512)
  --loss TYPE             Loss function (supcon|arcface|proxyanchor)
  --epochs N              Number of epochs
  --batch-size N          Batch size (N cattle × K views)
  --views-per-cattle K    Views per cattle in batch
  --lr FLOAT              Learning rate
  --freeze-strategy STR   Freezing strategy
  --pretrained            Use ImageNet pretrained weights
  --gpu-ids IDS           GPU IDs (comma-separated)
  --workers N             Data loading workers
  --checkpoint-every N    Save checkpoint every N epochs
  --eval-every N          Evaluate every N epochs
  --tensorboard           Enable TensorBoard logging
  --wandb                 Enable Weights & Biases logging
  --monitor               Launch live monitoring dashboard

OUTPUT:
  Creates:
    models/trained/[run_name]/
    ├── config_snapshot.yaml
    ├── checkpoints/
    ├── logs/
    ├── metrics/
    └── plots/

EXAMPLE:
  # Start training with config
  cattle-bio train start --config configs/train_config.yaml
  
  # Quick experiment
  cattle-bio train start --backbone resnet50 --epochs 50 --monitor
  
  # Multi-GPU training
  cattle-bio train start --config train.yaml --gpu-ids 0,1,2,3
```

---

## Command 8: Resume Training

```
COMMAND: cattle-bio train resume

PURPOSE: Resume interrupted training

SYNTAX:
  cattle-bio train resume CHECKPOINT [OPTIONS]

OPTIONS:
  --checkpoint PATH       Checkpoint file (required)
  --config FILE           Override config
  --change-freeze         Change freeze strategy
  --change-lr             Change learning rate
  --change-schedule       Change LR schedule
  --additional-epochs N   Add more epochs
  --strict                Strict checkpoint loading
  --monitor               Launch monitoring dashboard

EXAMPLE:
  # Simple resume
  cattle-bio train resume models/trained/run_001/checkpoints/last.pth
  
  # Resume and unfreeze layers
  cattle-bio train resume last.pth --change-freeze unfreeze_all
  
  # Resume with more epochs
  cattle-bio train resume last.pth --additional-epochs 50
```

---

## Command 9: Training Monitoring

```
COMMAND: cattle-bio train monitor

PURPOSE: Monitor ongoing training in real-time

SYNTAX:
  cattle-bio train monitor [RUN_NAME] [OPTIONS]

OPTIONS:
  --run-name NAME         Run to monitor (default: latest)
  --refresh-rate N        Update every N seconds (default: 5)
  --metrics LIST          Metrics to display (comma-separated)
  --plots                 Show live plots
  --alerts                Enable alerts for issues
  --web                   Launch web dashboard
  --port N                Web dashboard port (default: 8080)

OUTPUT:
  Terminal dashboard OR web interface

EXAMPLE:
  # Monitor latest run
  cattle-bio train monitor
  
  # Monitor specific run with web UI
  cattle-bio train monitor run_001 --web --port 8080
  
  # Terminal monitor with alerts
  cattle-bio train monitor --alerts --refresh-rate 10
```

---

## Command 10: Evaluation

```
COMMAND: cattle-bio eval validate

PURPOSE: Run validation evaluation

SYNTAX:
  cattle-bio eval validate [OPTIONS]

OPTIONS:
  --checkpoint PATH       Model checkpoint
  --val-manifest FILE     Validation manifest
  --gallery-manifest FILE Gallery manifest (default: train)
  --topk LIST             Top-K values (default: 1,5,10,20)
  --compute-cmc           Compute CMC curve
  --compute-robustness    Run robustness diagnostics
  --compute-similarities  Compute SELF-SIM, NEG-SIM, SIM-GAP
  --hard-negatives N      Export N worst failures
  --batch-size N          Batch size for embedding extraction
  --output-dir DIR        Results output directory
  --format FORMAT         Report format (json|pdf|xlsx|all)

OUTPUT:
  Generates:
    evaluation/validation/
    ├── val_results.json
    ├── topk_metrics.csv
    ├── cmc_curve_data.csv
    ├── hard_negatives.csv
    └── validation_report.pdf

EXAMPLE:
  # Full validation
  cattle-bio eval validate --checkpoint best.pth --compute-robustness
  
  # Quick validation (Top-K only)
  cattle-bio eval validate --checkpoint last.pth --topk 1,5,20
```

---

## Command 11: Test Evaluation

```
COMMAND: cattle-bio eval test

PURPOSE: Run final test evaluation (one-time only)

SYNTAX:
  cattle-bio eval test [OPTIONS]

OPTIONS:
  --checkpoint PATH       Model checkpoint (required)
  --test-dataset DIR      Test dataset directory
  --gallery-dir DIR       Gallery directory
  --extract-cattle-id     Auto-extract cattle IDs from paths
  --id-pattern REGEX      Cattle ID extraction pattern
  --known-only            Evaluate only known cattle
  --unknown-analysis      Analyze unknown cattle
  --threshold FLOAT       Similarity threshold for unknown
  --output-dir DIR        Results output directory
  --format FORMAT         Report format (pdf|json|xlsx|all)
  --final-report          Generate executive report

OUTPUT:
  Generates:
    evaluation/test/
    ├── test_results.json
    ├── test_topk_metrics.csv
    ├── known_cattle_results.csv
    ├── unknown_cattle_results.csv
    └── final_test_report.pdf

EXAMPLE:
  # Full test evaluation
  cattle-bio eval test \
    --checkpoint best.pth \
    --test-dataset /data/test_set \
    --final-report
```

---

## Command 12: Gallery Building

```
COMMAND: cattle-bio gallery build

PURPOSE: Build embedding vector database from all images

SYNTAX:
  cattle-bio gallery build [OPTIONS]

OPTIONS:
  --checkpoint PATH       Model checkpoint (required)
  --dataset-manifest FILE Manifest of images to process
  --output-dir DIR        Gallery output directory
  --batch-size N          Batch size for extraction
  --workers N             Data loading workers
  --gpu-ids IDS           GPU IDs to use
  --index-type TYPE       FAISS index (flat|ivf|hnsw)
  --index-params PARAMS   Index parameters
  --chunk-size N          Embedding chunk size (memory management)
  --resume                Resume interrupted build

OUTPUT:
  Generates:
    gallery/[version]/
    ├── embeddings/ (chunked)
    ├── mappings/
    ├── metadata/
    ├── index/ (FAISS)
    └── gallery_statistics.json

EXAMPLE:
  # Build gallery with best model
  cattle-bio gallery build --checkpoint best.pth --index-type ivf
  
  # Build on multiple GPUs
  cattle-bio gallery build --checkpoint best.pth --gpu-ids 0,1,2,3
  
  # Resume interrupted build
  cattle-bio gallery build --resume
```

---

## Command 13: Gallery Query

```
COMMAND: cattle-bio gallery query

PURPOSE: Query gallery with new cattle image

SYNTAX:
  cattle-bio gallery query IMAGE [OPTIONS]

OPTIONS:
  --image PATH            Query image path (required)
  --gallery-dir DIR       Gallery directory
  --topk N                Return top N results (default: 20)
  --threshold FLOAT       Similarity threshold
  --show-images           Display result images
  --output-format FORMAT  Output format (text|json|csv)
  --save-results FILE     Save results to file

OUTPUT:
  Query results with:
    • Cattle IDs
    • Similarity scores
    • Image paths
    • Quality/metadata

EXAMPLE:
  # Query with single image
  cattle-bio gallery query /data/query_image.jpg --topk 10
  
  # Query with threshold
  cattle-bio gallery query image.jpg --threshold 0.7 --show-images
  
  # Batch query from directory
  cattle-bio gallery query /data/query_dir/ --output-format json
```

---

## Command 14: Full Pipeline (One Command)

```
COMMAND: cattle-bio pipeline run

PURPOSE: Execute complete pipeline from raw data to trained model

SYNTAX:
  cattle-bio pipeline run [OPTIONS]

OPTIONS:
  --config FILE           Pipeline config file
  --dataset DIR           Raw dataset directory
  --output-dir DIR        Pipeline output directory
  --interactive           Interactive mode (guided)
  --batch                 Batch mode (unattended)
  --stages LIST           Run specific stages (comma-separated)
  --skip-stages LIST      Skip stages (comma-separated)
  --from-stage STAGE      Resume from specific stage
  --dry-run               Validate config without execution
  --email EMAIL           Email notification on completion
  --webhook URL           Webhook for status updates

STAGES:
  1. analyze              Dataset quality analysis
  2. split                Train/val split
  3. roi                  SAM face ROI processing
  4. augment              Augmentation gallery (optional)
  5. train                Model training
  6. validate             Validation evaluation
  7. gallery              Build vector database
  8. report               Generate final reports

OUTPUT:
  Creates complete run directory:
    pipeline/run_[timestamp]/
    ├── 01_analysis/
    ├── 02_split/
    ├── 03_roi/
    ├── 04_augment/
    ├── 05_train/
    ├── 06_validate/
    ├── 07_gallery/
    └── 08_reports/

EXAMPLE:
  # Interactive full pipeline
  cattle-bio pipeline run --dataset /data/cattle_90k --interactive
  
  # Batch with config
  cattle-bio pipeline run --config pipeline.yaml --batch
  
  # Run specific stages
  cattle-bio pipeline run --stages analyze,split,roi
  
  # Resume from training stage
  cattle-bio pipeline run --from-stage train
  
  # Dry run to validate
  cattle-bio pipeline run --config pipeline.yaml --dry-run
```

---

## Command 15: Pipeline Resume

```
COMMAND: cattle-bio pipeline resume-from

PURPOSE: Resume pipeline from specific stage after failure/interruption

SYNTAX:
  cattle-bio pipeline resume-from STAGE [OPTIONS]

OPTIONS:
  --run-dir DIR           Pipeline run directory
  --stage STAGE           Stage to resume from (required)
  --skip-validation       Skip stage validation
  --force                 Force resume even if stage completed

EXAMPLE:
  # Resume from ROI stage
  cattle-bio pipeline resume-from roi --run-dir pipeline/run_20260108
  
  # Resume training after crash
  cattle-bio pipeline resume-from train
```

---

## Command 16: Status & Progress

```
COMMAND: cattle-bio status

PURPOSE: Show current project status and progress

SYNTAX:
  cattle-bio status [OPTIONS]

OPTIONS:
  --detailed              Show detailed status
  --runs                  List all runs
  --latest                Show only latest run
  --format FORMAT         Output format (text|json)

OUTPUT:
  Displays:
    • Project configuration
    • Dataset information
    • Training runs status
    • Latest checkpoints
    • Pending operations
    • Errors/warnings

EXAMPLE:
  # Quick status
  cattle-bio status
  
  # Detailed with all runs
  cattle-bio status --detailed --runs
```

---

## Command 17: Report Generation

```
COMMAND: cattle-bio report generate

PURPOSE: Generate comprehensive reports

SYNTAX:
  cattle-bio report generate TYPE [OPTIONS]

TYPES:
  dataset                 Dataset quality report
  roi                     ROI verification report
  training                Training run report
  evaluation              Evaluation report
  benchmark               Multi-model comparison
  final                   Executive summary

OPTIONS:
  --run-name NAME         Run to report on
  --output-dir DIR        Report output directory
  --format FORMAT         Format (pdf|html|xlsx|all)
  --include-plots         Include all plots
  --executive             Executive summary style

EXAMPLE:
  # Generate training report
  cattle-bio report generate training --run-name run_001 --format pdf
  
  # Benchmark comparison
  cattle-bio report generate benchmark --format all
  
  # Final executive report
  cattle-bio report generate final --executive
```

---

## Command 18: Dashboard

```
COMMAND: cattle-bio report dashboard

PURPOSE: Launch interactive web dashboard

SYNTAX:
  cattle-bio report dashboard [OPTIONS]

OPTIONS:
  --port N                Port number (default: 8080)
  --host HOST             Host address (default: localhost)
  --open-browser          Auto-open in browser
  --public                Allow external connections
  --read-only             Read-only mode

FEATURES:
  • Real-time training monitoring
  • Interactive plots
  • Model comparison
  • Query interface
  • Report viewer

EXAMPLE:
  # Launch local dashboard
  cattle-bio report dashboard --open-browser
  
  # Launch on network
  cattle-bio report dashboard --host 0.0.0.0 --port 8080 --public
```

---

# 6. CONFIGURATION MANAGEMENT

## Configuration File Structure

### **Main Project Config (project.yaml)**

```
project:
  name: "cattle_face_biometrics"
  version: "1.0.0"
  description: "90K cattle face identification"
  created: "2026-01-08"
  
paths:
  dataset: "/data/cattle_90k"
  output: "./output"
  models: "./models"
  cache: "./cache"
  
hardware:
  device: "cuda"
  gpu_ids: [0, 1, 2, 3]
  num_workers: 16
  
reproducibility:
  seed: 42
  deterministic: true
```

### **Dataset Analysis Config (data_config.yaml)**

```
dataset:
  structure: "auto"  # auto-detect | folder-per-id | flat
  cattle_id_pattern: "FDETIBU[0-9]+"
  supported_formats: ["jpg", "jpeg", "png"]
  
analysis:
  compute_quality: true
  compute_duplicates: true
  compute_face_detection: true
  compute_rope_detection: true
  
  quality_metrics:
    - blur_score
    - brightness
    - contrast
    - exposure
    - noise
    - sharpness
  
  thresholds:
    min_resolution: 224
    min_blur_score: 30
    
output:
  formats: ["xlsx", "json", "pdf"]
  generate_plots: true
  sample_galleries: true
```

### **ROI Config (roi_config.yaml)**

```
roi:
  strategy: "face_head_sam"
  
  sam:
    model: "vit_h"
    checkpoint: "models/pretrained/sam_vit_h_4b8939.pth"
    
  target_region:
    include: ["face", "muzzle", "eyes", "horns", "ears"]
    exclude: ["body", "legs", "background", "ropes"]
    
  mask_selection:
    min_area_ratio: 0.10
    max_area_ratio: 0.60
    aspect_ratio_range: [0.6, 1.8]
    prefer_centered: true
    
  post_processing:
    fill_holes: true
    smooth_edges: true
    morphological_closing: true
    
  background:
    mode: "replace"  # replace | blur | black
    background_dir: "data/background_images"
    
  verification:
    generate_samples: true
    sample_counts:
      random: 100
      best: 50
      worst: 50
      edge_cases: 50
```

### **Training Config (train_config.yaml)**

```
training:
  run_name: "run_001_resnet50_supcon"
  
  # Model architecture (SINGLE-BRANCH)
  model:
    backbone: "resnet50"
    pretrained: true
    embedding_dim: 512
    normalize_embeddings: true
    dropout: 0.1
    
    projection_head:
      layers:
        - {type: "linear", in: 2048, out: 1024}
        - {type: "relu"}
        - {type: "dropout", p: 0.1}
        - {type: "linear", in: 1024, out: 512}
  
  # Data
  image_size: 224
  batch_construction:
    cattle_per_batch: 32  # N
    views_per_cattle: 4   # K
    # Total batch size = 32 × 4 = 128
  
  # Augmentation
  augmentation:
    strength: "moderate_to_strong"
    adaptive: true
    # Full augmentation settings from augmentation_config.yaml
  
  # Training schedule
  epochs: 100
  warmup_epochs: 5
  early_stopping_patience: 15
  
  # Optimizer
  optimizer:
    type: "AdamW"
    lr: 0.0003
    weight_decay: 0.0001
    
  # Learning rate scheduler
  scheduler:
    type: "CosineAnnealingWarmRestarts"
    T_0: 10
    T_mult: 2
    eta_min: 0.000001
  
  # Freeze strategy
  freeze:
    initial_layers: ["layer1", "layer2"]  # 50% frozen
    freeze_bn: true
    progressive_unfreeze:
      enabled: true
      schedule:
        - {epoch: 20, unfreeze: ["layer3"]}
        - {epoch: 40, unfreeze: ["layer4"]}
        - {epoch: 60, unfreeze: "all", freeze_bn: false}
  
  # Loss function
  loss:
    type: "supervised_contrastive"
    temperature: 0.07
  
  # Checkpointing
  checkpoint:
    save_every_n_epochs: 5
    save_best: true
    save_last: true
    metric: "val_top20"
    mode: "max"
  
  # Validation
  validation:
    eval_every_n_epochs: 1
    topk: [1, 5, 10, 20]
    compute_cmc: true
    compute_robustness_every_n: 10
  
  # Logging
  logging:
    log_every_n_steps: 50
    tensorboard: true
    log_embeddings_every_n: 5
```

### **Pipeline Config (pipeline_config.yaml)**

```
pipeline:
  name: "full_pipeline_run"
  
  stages:
    - name: "analyze"
      enabled: true
      config: "data_config.yaml"
      
    - name: "split"
      enabled: true
      ratio: 0.8
      stratify_by: "cattle_id"
      balance_quality: true
      
    - name: "roi"
      enabled: true
      config: "roi_config.yaml"
      parallel_workers: 8
      
    - name: "augment"
      enabled: false  # Optional stage
      config: "augmentation_config.yaml"
      
    - name: "train"
      enabled: true
      config: "train_config.yaml"
      
    - name: "validate"
      enabled: true
      compute_all_metrics: true
      
    - name: "gallery"
      enabled: true
      index_type: "ivf"
      
    - name: "report"
      enabled: true
      formats: ["pdf", "html"]
      
  notifications:
    email:
      enabled: false
      recipients: ["user@example.com"]
      on_completion: true
      on_failure: true
      
    webhook:
      enabled: false
      url: "https://hooks.slack.com/..."
```

---

# 7. PROGRESS TRACKING & LOGGING

## Progress Display (Terminal)

### **Simple Progress Bar**
```
Processing ROI images...
[████████████████████████████░░░░░░] 78.3% | 70145/89334 | ETA: 47m 23s
```

### **Detailed Progress**
```
Stage 3/8: ROI Processing with SAM
════════════════════════════════════════════════════════════
  Status: Running
  Started: 2026-01-08 14:23:45
  
  Overall Progress:
  [████████████████████░░░░░░░░░░░░░] 62.4% | 55789/89334
  
  Current Batch: 218/349
  Images/second: 15.3
  ETA: 1h 23m
  
  Metrics:
  ├─ Masks generated: 55,432
  ├─ Fallback used: 357 (0.64%)
  ├─ Avg ROI area ratio: 0.287
  └─ Avg processing time: 65.3ms/image
  
  Workers:
  ├─ Worker 0 [GPU 0]: ████████████████ 100% | Busy
  ├─ Worker 1 [GPU 1]: ████████████████ 100% | Busy
  ├─ Worker 2 [GPU 2]: ████████████████ 100% | Busy
  └─ Worker 3 [GPU 3]: ████████████████ 100% | Busy
  
  Last log: [14:45:12] Processed batch 218/349 successfully
  
Press 'q' to stop gracefully | 's' for status | 'p' to pause
════════════════════════════════════════════════════════════
```

### **Training Progress (Live)**
```
Epoch 47/100 | Step 12,345/30,000
════════════════════════════════════════════════════════════
  Train Loss: 1.234 ↓ (0.003 vs last epoch)
  Learning Rate: 0.000123
  
  [████████████░░░░░░░░] 41.2% | ETA: 23m 15s
  
  Batch Time: 187ms | Throughput: 684 imgs/sec
  GPU 0: 94% | 7234/8192 MB | GPU 1: 96% | 7456/8192 MB
  
  Recent Val Metrics (Epoch 46):
  ├─ Top-1:   68.2% ↑
  ├─ Top-5:   86.4% ↑
  ├─ Top-20:  95.6% ↑
  ├─ SIM GAP: 0.516 ↑ ✓
  └─ Collapse: False ✓
  
  Best: Epoch 43 | Top-20: 95.8%
  
Press 'm' for full metrics | 'p' to pause | 'q' to stop
════════════════════════════════════════════════════════════
```

## Logging Structure

### **Log Hierarchy**
```
logs/
├── system.log              # System-level events
├── pipeline.log            # Pipeline execution
├── stages/
│   ├── analyze.log
│   ├── roi_processing.log
│   ├── training.log
│   └── evaluation.log
├── errors.log              # All errors aggregated
└── run_[timestamp].json    # Machine-readable run log
```

### **Log Levels**
```
DEBUG   - Detailed diagnostic information
INFO    - Informational messages
WARNING - Warning messages (continue execution)
ERROR   - Error messages (may stop stage)
CRITICAL - Critical errors (stop pipeline)
```

### **Log Format**
```
[TIMESTAMP] [LEVEL] [COMPONENT] MESSAGE

Example:
[2026-01-08 14:23:45.123] [INFO] [ROI] Starting SAM processing on 89,334 images
[2026-01-08 14:23:45.456] [INFO] [ROI] Loaded SAM model: vit_h
[2026-01-08 14:23:50.789] [WARNING] [ROI] Image IMG_12345: mask area ratio 0.09 below threshold, using fallback
[2026-01-08 14:25:00.123] [ERROR] [ROI] Failed to process IMG_67890: CUDA out of memory
```

### **Machine-Readable Logs (JSON)**
```
{
  "timestamp": "2026-01-08T14:23:45.123Z",
  "level": "INFO",
  "component": "ROI",
  "event": "processing_started",
  "data": {
    "total_images": 89334,
    "workers": 8,
    "gpu_ids": [0, 1, 2, 3]
  }
}
```

---

# 8. RESUME & RECOVERY

## Resume Philosophy

**Every long-running operation is checkpointed and resumable**

### **Operations Supporting Resume**

1. **Dataset Analysis** - Resume from last processed image
2. **ROI Processing** - Resume from last processed batch
3. **Training** - Resume from last checkpoint
4. **Gallery Building** - Resume from last embedding batch
5. **Pipeline** - Resume from last completed stage

### **Resume Mechanisms**

#### **State Files**
```
Each operation creates a state file:
  .state/
  ├── roi_processing.state
  ├── training.state
  └── gallery_build.state

State file contains:
  • Last completed unit (image/epoch/batch)
  • Processed items list
  • Configuration snapshot
  • Timestamp
  • Success/failure flags
```

#### **Resume Logic**
```
On resume:
  1. Check for state file
  2. Validate configuration hasn't changed
  3. Skip already-processed items
  4. Continue from next item
  5. Merge results with previous
```

### **Resume Commands**

#### **Automatic Resume Detection**
```
User runs same command again:
  cattle-bio roi process --dataset /data/cattle_90k

System detects:
  ✓ Found existing state file
  ✓ 55,789/89,334 images already processed
  
  Resume from where you left off? [Y/n]: y
  
  Resuming from image 55,790...
```

#### **Explicit Resume**
```
cattle-bio roi process --resume

cattle-bio train resume checkpoints/last.pth

cattle-bio pipeline resume-from train
```

### **Resume After Failure**

```
Scenario: Training crashes at epoch 47

Automatic recovery:
  1. Last checkpoint saved: epoch 46
  2. State file: epoch 46, step 29,500
  3. Metrics logged: up to epoch 46
  
Resume:
  cattle-bio train resume checkpoints/last.pth
  
  ✓ Model restored from epoch 46
  ✓ Optimizer state restored
  ✓ Scheduler state restored
  ✓ Metrics history loaded (1-46)
  ✓ Random states restored
  
  Continuing from epoch 47...
  
  [Training continues seamlessly]
```

---

# 9. OUTPUT & REPORTING

## Output Directory Structure (Complete Run)

```
output/
└── run_20260108_142345/
    │
    ├── config/
    │   ├── project_config.yaml
    │   ├── data_config.yaml
    │   ├── roi_config.yaml
    │   ├── train_config.yaml
    │   └── pipeline_config.yaml
    │
    ├── logs/
    │   ├── system.log
    │   ├── pipeline.log
    │   ├── analyze.log
    │   ├── roi_processing.log
    │   ├── training.log
    │   ├── evaluation.log
    │   └── errors.log
    │
    ├── 01_dataset_analysis/
    │   ├── dataset_inventory.csv
    │   ├── quality_scores.csv
    │   ├── quality_summary.xlsx
    │   ├── histograms/
    │   ├── samples_gallery/
    │   ├── dataset_readiness_report.json
    │   └── recommendations.json
    │
    ├── 02_train_val_split/
    │   ├── train_manifest.csv
    │   ├── val_manifest.csv
    │   └── split_info.json
    │
    ├── 03_roi_processing/
    │   ├── processed_images/
    │   ├── masks/
    │   ├── metadata.csv
    │   ├── sam_report.json
    │   └── verification_samples/
    │
    ├── 04_augmentation_gallery/    # Optional
    │   ├── original_samples/
    │   ├── photometric/
    │   ├── geometric/
    │   ├── combined/
    │   └── augmentation_report.pdf
    │
    ├── 05_training/
    │   ├── config_snapshot.yaml
    │   ├── checkpoints/
    │   │   ├── epoch_001.pth
    │   │   ├── epoch_005.pth
    │   │   ├── last.pth
    │   │   └── best.pth
    │   ├── metrics/
    │   │   ├── train_metrics.csv
    │   │   ├── val_metrics.csv
    │   │   └── embedding_health.csv
    │   ├── plots/
    │   │   ├── loss_curves.png
    │   │   ├── similarity_metrics.png
    │   │   ├── topk_trends.png
    │   │   └── cmc_curve.png
    │   └── training_report.pdf
    │
    ├── 06_validation/
    │   ├── val_results.json
    │   ├── topk_metrics.csv
    │   ├── cmc_curve_data.csv
    │   ├── hard_negatives.csv
    │   └── validation_report.pdf
    │
    ├── 07_gallery/
    │   ├── embeddings/
    │   ├── mappings/
    │   ├── metadata/
    │   ├── index/
    │   └── gallery_statistics.json
    │
    └── 08_final_report/
        ├── executive_summary.pdf
        ├── complete_report.pdf
        ├── model_card.pdf
        └── deployment_package/
            ├── model.pth
            ├── config.yaml
            ├── preprocessing_signature.json
            └── README.md
```

## Report Types

### **1. Dataset Analysis Report**
- Format: PDF, XLSX, JSON
- Contents:
  - Dataset inventory and statistics
  - Quality distribution with histograms
  - Sample galleries (best/worst)
  - Recommendations for preprocessing

### **2. ROI Verification Report**
- Format: PDF with images
- Contents:
  - SAM processing statistics
  - Step-by-step verification samples
  - Failure analysis
  - Quality metrics

### **3. Training Report**
- Format: PDF
- Contents:
  - Configuration summary
  - Loss curves
  - Similarity metrics evolution
  - Top-K performance trends
  - Trainable parameters breakdown
  - Best checkpoint information

### **4. Validation Report**
- Format: PDF, JSON
- Contents:
  - Top-K metrics
  - CMC curve
  - Similarity statistics
  - Hard negative analysis
  - Performance by quality/view

### **5. Benchmark Report**
- Format: PDF, XLSX
- Contents:
  - Multi-model comparison
  - Pareto plots (accuracy vs speed)
  - Recommended model selection
  - Ablation studies

### **6. Final Test Report**
- Format: PDF (Executive style)
- Contents:
  - Test dataset description
  - Performance metrics
  - Known vs unknown cattle analysis
  - Qualitative examples
  - Deployment recommendations
  - Disclaimer (test never influenced training)

### **7. Model Card**
- Format: PDF
- Contents:
  - Model architecture details
  - Training dataset info
  - Performance benchmarks
  - Intended use and limitations
  - Ethical considerations
  - Deployment guidelines

---

# 10. DEPLOYMENT & USAGE

## Deployment Package Structure

```
deployment_package/
├── README.md                      # Deployment instructions
├── model/
│   ├── best_model.pth            # Trained model weights
│   ├── config.yaml               # Model configuration
│   └── preprocessing_signature.json
├── gallery/
│   ├── embeddings/               # Pre-computed gallery
│   ├── mappings/
│   ├── metadata/
│   └── index.faiss
├── scripts/
│   ├── enroll_cattle.sh          # Add new cattle to gallery
│   ├── query_cattle.sh           # Query with image
│   └── batch_process.sh          # Batch processing
└── requirements.txt               # Dependencies
```

## Deployment Commands

### **Enrollment (Add New Cattle)**
```
COMMAND: cattle-bio deploy enroll

PURPOSE: Add new cattle to existing gallery

SYNTAX:
  cattle-bio deploy enroll IMAGE [OPTIONS]

OPTIONS:
  --cattle-id ID          Cattle identifier
  --gallery-dir DIR       Gallery directory
  --quality-check         Check image quality first
  --min-quality THRESHOLD Minimum quality threshold
  --update-index          Rebuild FAISS index
  --verify                Show similar cattle (sanity check)

EXAMPLE:
  # Enroll single cattle
  cattle-bio deploy enroll new_cattle.jpg --cattle-id FDETIBU99999
  
  # Enroll with quality check
  cattle-bio deploy enroll image.jpg --cattle-id 99999 --quality-check
  
  # Batch enrollment
  cattle-bio deploy enroll /new_cattle_dir/ --batch
```

### **Query (Identify Cattle)**
```
COMMAND: cattle-bio deploy query

PURPOSE: Identify cattle from image

SYNTAX:
  cattle-bio deploy query IMAGE [OPTIONS]

OPTIONS:
  --gallery-dir DIR       Gallery directory
  --model PATH            Model checkpoint
  --topk N                Return top N matches
  --threshold FLOAT       Similarity threshold
  --show-scores           Display similarity scores
  --show-images           Display result images
  --format FORMAT         Output format (text|json|csv)

OUTPUT:
  Returns:
    • Cattle ID (if confident)
    • Top-K similar cattle
    • Similarity scores
    • Confidence level

EXAMPLE:
  # Simple query
  cattle-bio deploy query unknown_cattle.jpg
  
  # Query with threshold
  cattle-bio deploy query image.jpg --threshold 0.75 --topk 5
  
  # JSON output for integration
  cattle-bio deploy query image.jpg --format json > result.json
```

### **Batch Processing**
```
COMMAND: cattle-bio deploy batch-process

PURPOSE: Process multiple cattle images

SYNTAX:
  cattle-bio deploy batch-process INPUT_DIR [OPTIONS]

OPTIONS:
  --input DIR             Input directory
  --output FILE           Output CSV file
  --model PATH            Model checkpoint
  --gallery DIR           Gallery directory
  --workers N             Parallel workers
  --threshold FLOAT       Similarity threshold

OUTPUT:
  CSV file:
    image_path,cattle_id,confidence,top1_similarity,top5_avg_similarity

EXAMPLE:
  cattle-bio deploy batch-process /daily_captures/ \
    --output results.csv \
    --workers 8
```

### **Gallery Management**
```
COMMAND: cattle-bio deploy gallery-update

PURPOSE: Update gallery with new data

SYNTAX:
  cattle-bio deploy gallery-update [OPTIONS]

OPTIONS:
  --add-cattle LIST       Cattle IDs to add
  --remove-cattle LIST    Cattle IDs to remove
  --rebuild-index         Rebuild FAISS index
  --backup                Backup before update

EXAMPLE:
  # Add new cattle
  cattle-bio deploy gallery-update --add-cattle 99999,99998
  
  # Remove cattle
  cattle-bio deploy gallery-update --remove-cattle 12345 --backup
  
  # Rebuild index
  cattle-bio deploy gallery-update --rebuild-index
```

---

## Usage Examples (Real Scenarios)

### **Scenario 1: First-Time Setup (Interactive)**

```
Step 1: Initialize project
──────────────────────────
$ cattle-bio init my_cattle_project --interactive

  Project initialized: my_cattle_project/
  
  Quick setup wizard:
  ─────────────────────────
  Dataset location: /data/cattle_90k
  Output directory: ./output
  
  Hardware:
  ✓ Detected 4 GPUs
  ✓ 64 CPU cores
  
  Project created successfully!

Step 2: Run full pipeline interactively
────────────────────────────────────────
$ cd my_cattle_project
$ cattle-bio pipeline run --interactive

  [Interactive wizard guides through all stages]
  [User makes decisions based on recommendations]
  [Pipeline runs with progress bars]
  
  ... 8-12 hours later ...
  
  ✓ Pipeline complete!
  
  Final Results:
  ├─ Training complete: run_20260108_142345
  ├─ Best model: Top-20 = 95.8%
  ├─ Gallery built: 89,334 embeddings
  └─ Reports generated: output/run_20260108_142345/08_final_report/

Step 3: Review results
──────────────────────
$ cattle-bio status

  Project: my_cattle_project
  Last run: run_20260108_142345 (completed)
  
  Dataset: 89,334 images, 68,432 cattle
  Best model: run_20260108_142345/checkpoints/best.pth
  
  Performance:
  ├─ Top-1:  68.2%
  ├─ Top-5:  86.4%
  ├─ Top-10: 92.1%
  └─ Top-20: 95.8%

Step 4: Generate final report
──────────────────────────────
$ cattle-bio report generate final --executive

  ✓ Executive summary generated
  → output/run_20260108_142345/08_final_report/executive_summary.pdf
```

---

### **Scenario 2: Batch Execution (Automation)**

```
Step 1: Prepare configuration
──────────────────────────────
$ cattle-bio config wizard

  [Interactive configuration]
  
  Config saved: configs/production.yaml

Step 2: Validate configuration
───────────────────────────────
$ cattle-bio pipeline run --config configs/production.yaml --dry-run

  Validating configuration...
  ✓ All paths exist
  ✓ GPU devices available
  ✓ Dependencies satisfied
  ✓ Configuration valid
  
  Estimated time: 8-10 hours
  Estimated disk space: 450 GB

Step 3: Run unattended
───────────────────────
$ nohup cattle-bio pipeline run \
    --config configs/production.yaml \
    --batch \
    --email admin@example.com \
    > pipeline.log 2>&1 &

  [Process runs in background]
  [Email sent on completion]

Step 4: Check progress remotely
────────────────────────────────
$ cattle-bio status --detailed

  Pipeline: RUNNING (Stage 5/8: Training)
  Started: 2026-01-08 14:23:45
  Elapsed: 6h 23m
  ETA: 2h 15m
  
  Current: Epoch 72/100 | Top-20: 95.6%
```

---

### **Scenario 3: Resume After Interruption**

```
Situation: Training interrupted at epoch 47

Step 1: Check status
────────────────────
$ cattle-bio status

  Last run: run_20260108_142345 (INTERRUPTED)
  Last stage: Training
  Last checkpoint: epoch_046.pth
  
  Can resume from: epoch 47

Step 2: Resume training
───────────────────────
$ cattle-bio train resume \
    models/trained/run_20260108_142345/checkpoints/last.pth

  ✓ Checkpoint loaded
  ✓ Resuming from epoch 47
  ✓ Metrics history restored
  
  Training continues...

Step 3: Complete pipeline
──────────────────────────
$ cattle-bio pipeline resume-from validate

  ✓ Training complete
  → Continuing to validation...
  → Continuing to gallery build...
  → Continuing to reporting...
  
  ✓ Pipeline complete!
```

---

### **Scenario 4: Experimentation (Multiple Models)**

```
Experiment: Compare ResNet50 vs EfficientNet-B2

Step 1: Run baseline (ResNet50)
────────────────────────────────
$ cattle-bio train start \
    --config configs/resnet50.yaml \
    --run-name experiment_resnet50

Step 2: Run alternative (EfficientNet-B2)
──────────────────────────────────────────
$ cattle-bio train start \
    --config configs/efficientnet_b2.yaml \
    --run-name experiment_efficientnet_b2

Step 3: Compare results
───────────────────────
$ cattle-bio report generate benchmark

  Model Comparison:
  ┌──────────────────┬────────┬────────┬─────────┬──────────┐
  │ Model            │ Top-1  │ Top-20 │ Latency │ Size     │
  ├──────────────────┼────────┼────────┼─────────┼──────────┤
  │ ResNet50         │ 68.2%  │ 95.8%  │  18ms   │  98 MB   │
  │ EfficientNet-B2  │ 70.1%  │ 96.2%  │  22ms   │  36 MB   │
  └──────────────────┴────────┴────────┴─────────┴──────────┘
  
  Recommendation: EfficientNet-B2
  Reason: +2% accuracy, smaller size, acceptable latency
```

---

### **Scenario 5: Deployment**

```
Step 1: Export best model
──────────────────────────
$ cattle-bio gallery export \
    --model models/trained/best_run/checkpoints/best.pth \
    --output deployment_package/

  ✓ Model exported
  ✓ Gallery exported
  ✓ Scripts included
  ✓ README generated
  
  Deployment package: deployment_package.zip

Step 2: Deploy to production server
────────────────────────────────────
[On production server]

$ unzip deployment_package.zip
$ cd deployment_package
$ ./setup.sh

  ✓ Dependencies installed
  ✓ Gallery loaded
  ✓ Model ready

Step 3: Test deployment
───────────────────────
$ cattle-bio deploy query test_image.jpg

  Identified: FDETIBU20001
  Confidence: 0.89
  Top-5 Matches:
  1. FDETIBU20001 (0.89) ✓
  2. FDETIBU20234 (0.72)
  3. FDETIBU18765 (0.68)
  4. FDETIBU19823 (0.65)
  5. FDETIBU20456 (0.63)

Step 4: Production usage
────────────────────────
$ cattle-bio deploy batch-process \
    /daily_captures/ \
    --output daily_results.csv

  Processing 1,234 images...
  [████████████████████████████] 100%
  
  ✓ Results saved: daily_results.csv
  
  Summary:
  ├─ Identified: 1,187 (96.2%)
  ├─ Uncertain: 34 (2.8%)
  └─ Unknown: 13 (1.1%)
```

---

## COMPLETE SYSTEM SUMMARY

### **What You Have**

✅ **Single-Branch Architecture**
- ResNet50 backbone
- 512-dim embeddings (L2-normalized)
- Captures ALL face information (muzzle, color, shape, horns)
- Simple, fast, effective

✅ **Complete CLI System**
- One command pipeline OR step-by-step
- Interactive mode (guided) OR batch mode (automated)
- Full resume capabilities
- Real-time progress tracking

✅ **All Stages Covered**
1. Dataset analysis → Recommendations
2. ROI preprocessing (SAM)
3. Train/val split
4. Training with freeze strategies
5. Validation evaluation
6. Gallery building (100% dataset)
7. Test evaluation
8. Reporting and deployment

✅ **Production-Ready**
- Configuration management
- Error handling and recovery
- Logging and monitoring
- Deployment tools
- Documentation generated automatically

---

## QUICK START COMMAND

```bash
# Complete system in one command (interactive)
cattle-bio pipeline run --dataset /data/cattle_90k --interactive

# OR batch mode with config
cattle-bio pipeline run --config my_config.yaml --batch

# OR step-by-step
cattle-bio data analyze --dataset /data/cattle_90k
cattle-bio data split --ratio 0.8
cattle-bio roi process --sam-model vit_h
cattle-bio train start --config train_config.yaml
cattle-bio eval validate --checkpoint best.pth
cattle-bio gallery build --checkpoint best.pth
cattle-bio report generate final
```

---

**This is your complete CLI-based system design. Everything specified. No code. Ready for implementation.**

**Any specific command or workflow you want me to detail further?**