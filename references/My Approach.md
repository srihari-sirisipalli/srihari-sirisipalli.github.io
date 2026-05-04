# Cattle Identification System: Technical Specification Document

**Project Name:** Cattle Biometric Identification & Retrieval System  
**Version:** 1.0  
**Date:** December 2024  
**Author:** System Architecture Team

---

## Executive Summary

This document outlines a practical, scalable cattle identification system using self-supervised deep learning for feature extraction and vector similarity search for retrieval. The system is designed to handle poor-quality field images, scale to 1 million+ cattle, support continuous deployment, and manage the full lifecycle of cattle records including deceased/transferred animals.

**Key Metrics:**
- Target Accuracy: 95-97%
- Deployment Timeline: 3 months
- Budget: $100-150K
- Scalability: 1M+ cattle
- Latency: <3 seconds end-to-end

---

## 1. System Overview

### 1.1 Problem Statement

Traditional cattle identification methods (RFID tags, ear notches, collars) are:
- Invasive and cause animal discomfort
- Prone to loss, damage, or forgery
- Require manual intervention and maintenance
- Expensive at scale

**Solution:** Non-invasive biometric identification using unique muzzle patterns, analogous to human fingerprints.

### 1.2 Core Challenges

1. **Poor Image Quality:** Field conditions produce images with blur, uneven lighting, occlusion, wet surfaces
2. **Data Scarcity:** Only 1-3 images available per animal initially
3. **Scale:** Must handle 1M+ animals with sub-second retrieval
4. **Similar Appearances:** Same breed animals have subtle differences
5. **Lifecycle Management:** Handle deceased, transferred, or aged-out cattle
6. **Continuous Growth:** 1000+ new registrations monthly

### 1.3 Solution Approach

**Self-supervised learning** model generates discriminative embeddings from unlabeled cattle images, stored in a vector database for fast similarity-based retrieval. The system continuously improves as more cattle are registered.

---

## 2. System Architecture

### 2.1 High-Level Pipeline

```
Image Input → Preprocessing → Feature Extraction → Vector Storage → Retrieval → Verification
     ↓            ↓                 ↓                   ↓               ↓           ↓
  Raw Image   Clean ROI        512D Embedding      FAISS Index    Top-K Results  Decision
```

### 2.2 Component Overview

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Muzzle Detection** | YOLOv8 | Extract region of interest |
| **Preprocessing** | CLAHE + OpenCV | Normalize lighting, enhance texture |
| **Feature Extraction** | SimCLR + ResNet50 | Generate 512D embeddings |
| **Vector Database** | FAISS (IVFFlat) | Store and search embeddings |
| **Metadata Database** | PostgreSQL/Supabase | Store cattle records and metadata |
| **Storage** | AWS S3/Google Cloud | Store original images |
| **API Layer** | FastAPI + Docker | RESTful endpoints |
| **Orchestration** | Kubernetes | Container management and scaling |

---

## 3. Detailed Component Design

### 3.1 Image Preprocessing Module

#### 3.1.1 Muzzle Detection & ROI Extraction

**Objective:** Automatically detect and crop muzzle region from full cattle images

**Implementation:**
- YOLOv8-nano fine-tuned on cattle muzzle dataset
- Input: Full cattle image (any resolution)
- Output: Cropped muzzle with 20% padding (384×384 pixels)
- Confidence threshold: 0.6 (reject below)

**Training Requirements:**
- 5000+ labeled muzzle images for YOLO fine-tuning
- 2-3 days training on single GPU
- Augmentation: rotation, scale, lighting variation

**Fallback Strategy:**
- If detection fails, use center crop
- Flag image for manual review
- Request user to recapture

#### 3.1.2 Illumination Normalization

**CLAHE (Contrast Limited Adaptive Histogram Equalization)**

**Purpose:** Handle uneven lighting, shadows, low contrast

**Process:**
1. Convert RGB to LAB color space
2. Apply CLAHE on L-channel (clip limit: 2.0, tile grid: 8×8)
3. Convert back to RGB

**Parameters:**
```python
clip_limit = 2.0
tile_grid_size = (8, 8)
```

**Results:**
- Normalizes harsh shadows
- Enhances local contrast
- Preserves color information

#### 3.1.3 Texture Enhancement

**Bilateral Filtering:**
- Edge-preserving noise reduction
- Parameters: d=9, sigmaColor=75, sigmaSpace=75
- Maintains ridge boundaries while reducing noise

**Sharpening (Optional):**
- Unsharp mask for fine ridge enhancement
- Applied only if quality score >0.7
- Kernel: Gaussian blur + subtraction

#### 3.1.4 Quality Assessment

**Metrics Computed:**
1. **Blur Detection:** Laplacian variance (threshold: 100)
2. **Exposure:** Histogram mean (acceptable: 40-220)
3. **Contrast:** Standard deviation (minimum: 30)
4. **Occlusion:** Edge density in ROI (minimum: 15%)

**Quality Score:** Weighted combination (0-1 scale)
```
quality_score = 0.4 * blur_score + 0.3 * exposure_score + 
                0.2 * contrast_score + 0.1 * occlusion_score
```

**Decision Rules:**
- Quality ≥ 0.6: Accept for primary registration
- Quality 0.4-0.6: Accept but request additional images
- Quality < 0.4: Reject, request recapture

### 3.2 Feature Extraction Module

#### 3.2.1 Model Architecture

**Base Model:** ResNet50

**Training Method:** SimCLR (Simple Framework for Contrastive Learning)

**Why SimCLR + ResNet50:**
- Self-supervised: No manual labeling required
- Proven for fine-grained recognition
- Efficient: 25M parameters vs 86M (ViT)
- Fast inference: 20-30ms on CPU
- Better on local textures than transformers

#### 3.2.2 Self-Supervised Training

**SimCLR Contrastive Learning:**

**Process:**
1. Take one cattle muzzle image
2. Generate two augmented versions (crops, rotations, color jitter)
3. Pass both through ResNet50 encoder
4. Train so augmented versions have similar embeddings
5. Different cattle images have distant embeddings

**Data Augmentation Pipeline:**
```python
- Random crop: 0.7-1.0 scale
- Random rotation: ±30 degrees
- Color jitter: brightness±0.3, contrast±0.3, saturation±0.3
- Random horizontal flip: 50%
- Gaussian blur: σ=0.1-2.0 (10% probability)
```

**Loss Function:** NT-Xent (Normalized Temperature-scaled Cross Entropy)
```
Temperature τ = 0.5
Batch size = 256 (128 pairs)
```

**Training Configuration:**
- Optimizer: LARS (Layer-wise Adaptive Rate Scaling)
- Learning rate: 0.3 with cosine decay
- Epochs: 200
- Hardware: 4× A100 GPUs
- Duration: 1 week for 50K images

#### 3.2.3 Embedding Generation

**Inference Process:**
1. Preprocessed 384×384 image → ResNet50 encoder
2. Extract 2048D feature from avgpool layer
3. Pass through projection head (2048 → 512D)
4. L2-normalize to unit vector
5. Output: 512D embedding vector

**Properties:**
- Unit length (L2 norm = 1.0)
- Cosine similarity directly comparable
- Dimensionality: 512D (balance between discriminability and storage)

#### 3.2.4 Multi-Image Enrollment

**Strategy:** Store all embeddings, compute centroid for fast search

**For each cattle:**
- Register 1-5 images initially
- Generate embedding for each
- Store all individual embeddings
- Compute centroid: `mean(embeddings)` → L2-normalize
- Use centroid for initial search
- Use individual embeddings for verification

**Benefits:**
- Robust to single poor-quality image
- Handles different angles/lighting
- Improves accuracy by 3-5%

### 3.3 Vector Storage & Database Architecture

#### 3.3.1 Metadata Database (PostgreSQL)

**Schema Design:**

```sql
-- Cattle master table
CREATE TABLE cattle (
    cattle_id UUID PRIMARY KEY,
    name VARCHAR(255),
    breed VARCHAR(100),
    age_years INTEGER,
    gender VARCHAR(10),
    owner_id UUID,
    location_state VARCHAR(50),
    location_district VARCHAR(50),
    location_mandal VARCHAR(50),
    registration_date TIMESTAMP,
    status VARCHAR(20), -- 'active', 'deceased', 'transferred', 'lost'
    status_updated_at TIMESTAMP,
    num_registered_images INTEGER,
    avg_quality_score FLOAT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Image records
CREATE TABLE cattle_images (
    image_id UUID PRIMARY KEY,
    cattle_id UUID REFERENCES cattle(cattle_id),
    image_url TEXT, -- S3/GCS path
    quality_score FLOAT,
    capture_date TIMESTAMP,
    capture_location VARCHAR(255),
    embedding_id UUID, -- Reference to FAISS index
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Embedding metadata
CREATE TABLE embeddings (
    embedding_id UUID PRIMARY KEY,
    image_id UUID REFERENCES cattle_images(image_id),
    cattle_id UUID REFERENCES cattle(cattle_id),
    vector_index_id VARCHAR(100), -- FAISS index reference
    embedding_version VARCHAR(20), -- Model version
    is_centroid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log
CREATE TABLE cattle_status_log (
    log_id UUID PRIMARY KEY,
    cattle_id UUID REFERENCES cattle(cattle_id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    reason TEXT,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cattle_status ON cattle(status);
CREATE INDEX idx_cattle_location ON cattle(location_state, location_district, location_mandal);
CREATE INDEX idx_cattle_registration_date ON cattle(registration_date);
CREATE INDEX idx_embeddings_cattle ON embeddings(cattle_id);
```

#### 3.3.2 Vector Database (FAISS)

**Index Type:** IndexIVFFlat (Inverted File with Flat quantizer)

**Why IVFFlat:**
- Good balance: accuracy vs speed vs memory
- Supports insertions without full rebuild
- Scales to millions of vectors
- Regional sharding compatible

**Configuration:**
```python
dimension = 512
nlist = 1000  # Number of clusters (sqrt(N) rule)
metric = METRIC_INNER_PRODUCT  # Cosine similarity (after L2 norm)

# Create index
quantizer = faiss.IndexFlatIP(dimension)
index = faiss.IndexIVFFlat(quantizer, dimension, nlist)

# Training
index.train(training_embeddings)  # Need 30*nlist samples

# Search parameters
index.nprobe = 20  # Query 20 nearest clusters
```

**Regional Sharding Strategy:**

**Organization:**
```
India/
├── Karnataka/
│   ├── Bangalore/
│   │   └── faiss_index.bin (50K cattle)
│   ├── Mysore/
│   │   └── faiss_index.bin (30K cattle)
├── Maharashtra/
│   ├── Pune/
│   └── Mumbai/
```

**Benefits:**
- Reduces search space 10-20×
- Parallel searches across regions
- Easier index management
- Localized updates

**Index Loading Strategy:**
- Keep active regions in memory (2-3 most queried)
- Lazy-load on-demand from cloud storage
- Cache for 1 hour, then unload
- Memory budget: 8GB allows ~5 regional indices

#### 3.3.3 Storage Layout

**Cloud Storage (S3/GCS):**

```
cattle-biometrics-bucket/
├── images/
│   └── {state}/
│       └── {district}/
│           └── {cattle_id}/
│               ├── {image_id}_original.jpg
│               └── {image_id}_processed.jpg
├── embeddings/
│   └── {state}/
│       └── {district}/
│           ├── faiss_index.bin
│           ├── id_mapping.pkl  # FAISS_idx → cattle_id
│           └── metadata.json
└── models/
    ├── yolo_muzzle_v1.pt
    ├── simclr_resnet50_v1.pth
    └── model_metadata.json
```

**Access Patterns:**
- Images: Read rarely (verification only)
- Embeddings: Read frequently (every search)
- Models: Read once at server startup

**Cost Optimization:**
- Original images: Standard storage
- Processed images: Standard storage (delete after 30 days)
- Embeddings: Standard storage with frequent access
- Archived cattle: Glacier/Coldline storage

### 3.4 Registration Workflow

#### 3.4.1 Image Capture & Validation

**Step 1: Image Upload**
```
POST /api/register/start
Body: {
  "cattle_metadata": {...},
  "images": [base64_encoded_images]
}
```

**Step 2: Quality Check**
- Run quality assessment on each image
- Filter: keep only quality ≥ 0.4
- Validate: minimum 1 image with quality ≥ 0.6
- Response: accepted/rejected images with scores

**Step 3: Preprocessing**
- YOLO muzzle detection
- CLAHE normalization
- Bilateral filtering
- Resize to 384×384

#### 3.4.2 Feature Extraction

**Step 4: Generate Embeddings**
- Pass each preprocessed image through SimCLR
- Extract 512D embeddings
- L2-normalize
- Compute centroid if multiple images

**Step 5: Duplicate Detection**
- Search FAISS with centroid embedding
- Retrieve top-5 nearest neighbors
- Calculate cosine similarities
- If any similarity > 0.90: Flag as potential duplicate

**Duplicate Handling:**
```python
if max_similarity > 0.90:
    return {
        "status": "duplicate_detected",
        "similar_cattle": [
            {
                "cattle_id": "...",
                "similarity": 0.93,
                "images": [...]
            }
        ],
        "action_required": "manual_verification"
    }
```

#### 3.4.3 Registration Completion

**Step 6: Store Data**

**Database Transaction:**
```sql
BEGIN;
  -- Insert cattle record
  INSERT INTO cattle (cattle_id, ..., status='active') VALUES (...);
  
  -- Insert image records
  INSERT INTO cattle_images (image_id, cattle_id, ...) VALUES (...);
  
  -- Insert embedding metadata
  INSERT INTO embeddings (embedding_id, cattle_id, ...) VALUES (...);
  
COMMIT;
```

**FAISS Update:**
```python
# Add embeddings to regional index
regional_index = load_index(state, district)
new_indices = regional_index.add(embeddings)

# Update ID mapping
id_mapping[new_indices] = cattle_id

# Save updated index
save_index(regional_index, state, district)
```

**Cloud Storage:**
- Upload original images to S3
- Upload processed images (temporary)
- Update FAISS index file
- Update ID mapping pickle file

**Step 7: Response**
```json
{
  "status": "success",
  "cattle_id": "uuid-here",
  "registered_images": 3,
  "avg_quality_score": 0.72,
  "embedding_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### 3.5 Retrieval Workflow

#### 3.5.1 Query Processing

**Step 1: Image Upload**
```
POST /api/identify
Body: {
  "image": base64_encoded_image,
  "search_region": {
    "state": "Karnataka",
    "district": "Bangalore"  # Optional
  }
}
```

**Step 2: Preprocessing**
- Same pipeline as registration
- YOLO detection → CLAHE → filtering → resize

**Step 3: Feature Extraction**
- Generate 512D embedding
- L2-normalize

#### 3.5.2 Candidate Retrieval

**Step 4: Regional FAISS Search**

**Load Appropriate Index:**
```python
if district_specified:
    index = load_index(state, district)
else:
    # Search across all district indices in state
    indices = load_all_district_indices(state)
```

**Search Parameters:**
```python
k = 20  # Retrieve top-20 candidates
nprobe = 20  # Search 20 nearest clusters

distances, indices = index.search(query_embedding, k)
# distances: cosine similarities (inner product after L2 norm)
```

**Filter by Threshold:**
```python
candidates = []
for dist, idx in zip(distances[0], indices[0]):
    if dist >= 0.70:  # Minimum similarity threshold
        cattle_id = id_mapping[idx]
        candidates.append({
            "cattle_id": cattle_id,
            "similarity": float(dist),
            "embedding_id": idx
        })
```

#### 3.5.3 Multi-Embedding Verification

**Step 5: Detailed Comparison**

For each candidate cattle with multiple registered images:

```python
def verify_candidate(query_embedding, cattle_id):
    # Retrieve all embeddings for this cattle
    embeddings = get_all_embeddings(cattle_id)
    
    # Calculate similarity with each
    similarities = [
        cosine_similarity(query_embedding, emb) 
        for emb in embeddings
    ]
    
    # Aggregate strategies:
    max_sim = max(similarities)  # Best match
    avg_top3 = mean(sorted(similarities, reverse=True)[:3])
    
    return {
        "max_similarity": max_sim,
        "avg_top3_similarity": avg_top3,
        "num_embeddings": len(embeddings)
    }
```

**Re-rank Candidates:**
```python
for candidate in candidates:
    verification = verify_candidate(query_embedding, candidate['cattle_id'])
    candidate['max_similarity'] = verification['max_similarity']
    candidate['avg_similarity'] = verification['avg_top3_similarity']

# Sort by max_similarity
candidates.sort(key=lambda x: x['max_similarity'], reverse=True)
```

#### 3.5.4 Decision Logic

**Step 6: Confidence-Based Response**

```python
top_candidate = candidates[0]
max_sim = top_candidate['max_similarity']

if max_sim >= 0.88:
    # HIGH CONFIDENCE MATCH
    return {
        "status": "match_found",
        "confidence": "high",
        "cattle_id": top_candidate['cattle_id'],
        "similarity": max_sim,
        "cattle_details": get_cattle_details(top_candidate['cattle_id'])
    }

elif 0.80 <= max_sim < 0.88:
    # MEDIUM CONFIDENCE - Manual Verification
    return {
        "status": "manual_verification_required",
        "confidence": "medium",
        "top_candidates": candidates[:3],  # Top 3 for comparison
        "action": "show_images_for_visual_comparison"
    }

elif 0.70 <= max_sim < 0.80:
    # LOW CONFIDENCE - Possibly New
    return {
        "status": "low_confidence",
        "confidence": "low",
        "possible_matches": candidates[:5],
        "suggestion": "likely_new_cattle",
        "action": "register_or_verify"
    }

else:  # max_sim < 0.70
    # NEW CATTLE
    return {
        "status": "no_match",
        "confidence": "high_new",
        "suggestion": "register_new_cattle"
    }
```

#### 3.5.5 Image-to-Image Verification (Secondary)

**For Medium Confidence Cases (0.80-0.88):**

**Step 7: Visual Verification**

Retrieve original images for visual comparison:

```python
def visual_verification(query_image_id, candidate_cattle_id):
    # Load images from cloud storage
    query_img = load_image(query_image_id)
    candidate_imgs = load_cattle_images(candidate_cattle_id, limit=3)
    
    # Optional: Compute SSIM (Structural Similarity)
    ssim_scores = [
        compute_ssim(query_img, cand_img) 
        for cand_img in candidate_imgs
    ]
    
    return {
        "query_image": query_img_url,
        "candidate_images": [img_url for img in candidate_imgs],
        "ssim_scores": ssim_scores
    }
```

**Human Operator Interface:**
- Side-by-side image comparison
- Similarity scores displayed
- Buttons: "Confirm Match" / "Reject Match" / "Unsure"
- Feedback logged for model improvement

### 3.6 Lifecycle Management

#### 3.6.1 Status Management

**Cattle Status Values:**
```python
STATUS_ACTIVE = "active"          # Normal, searchable
STATUS_DECEASED = "deceased"      # Dead, archived
STATUS_TRANSFERRED = "transferred" # Moved to different owner/region
STATUS_LOST = "lost"              # Missing, unknown status
STATUS_SOLD = "sold"              # Sold to different owner
```

**Status Update API:**
```
PUT /api/cattle/{cattle_id}/status
Body: {
  "new_status": "deceased",
  "reason": "Natural causes",
  "date": "2024-12-01"
}
```

**Database Update:**
```sql
BEGIN;
  -- Log status change
  INSERT INTO cattle_status_log (cattle_id, old_status, new_status, reason)
  VALUES (cattle_id, old_status, 'deceased', 'Natural causes');
  
  -- Update cattle record
  UPDATE cattle 
  SET status = 'deceased', status_updated_at = NOW()
  WHERE cattle_id = cattle_id;
  
COMMIT;
```

#### 3.6.2 Index Management

**Active vs Archive Indices:**

**Active Index** (Fast Search):
- Contains only status='active' cattle
- Loaded in memory
- Rebuilt monthly

**Archive Index** (Historical Search):
- Contains all cattle (active + deceased + transferred)
- Stored on disk, loaded on-demand
- Used for historical queries

**Monthly Cleanup Process:**

```python
def rebuild_active_index():
    # 1. Query active cattle from database
    active_cattle = db.query(
        "SELECT cattle_id, embedding_id FROM cattle WHERE status='active'"
    )
    
    # 2. Load all active embeddings
    active_embeddings = []
    id_mapping = {}
    
    for idx, cattle in enumerate(active_cattle):
        embedding = load_embedding(cattle['embedding_id'])
        active_embeddings.append(embedding)
        id_mapping[idx] = cattle['cattle_id']
    
    # 3. Build new FAISS index
    new_index = faiss.IndexIVFFlat(quantizer, dimension, nlist)
    new_index.train(active_embeddings)
    new_index.add(active_embeddings)
    
    # 4. Atomically replace old index
    save_index(new_index, region, "active_index_temp.bin")
    os.rename("active_index_temp.bin", "active_index.bin")
    save_id_mapping(id_mapping)
    
    # 5. Archive old index
    archive_index(old_index, f"archive_{date}.bin")
```

**Scheduled Job:**
- Runs monthly (e.g., 1st of each month, 2 AM)
- Per-region parallel execution
- Zero-downtime: new index replaces old atomically
- Old indices archived for 1 year

#### 3.6.3 Data Retention Policy

**Images:**
- Active cattle: Retained indefinitely
- Deceased cattle: Retained 5 years, then archive to cold storage
- Transferred cattle: Retained 2 years in original region

**Embeddings:**
- Active cattle: Hot storage (SSD)
- Inactive cattle: Cold storage, retrieved on-demand
- Archived cattle: Glacier/tape backup

**Database Records:**
- Never deleted (audit trail)
- Status field indicates current state
- Soft deletes only

### 3.7 Continuous Learning & Model Updates

#### 3.7.1 Data Collection Pipeline

**Continuous Improvement Loop:**

```
New Registrations → Staging Buffer → Quality Filter → Training Dataset → Periodic Retraining
```

**Staging Buffer:**
- Collect all new registrations
- Buffer size: 10,000 images
- When buffer full: trigger retraining evaluation

**Quality Criteria:**
- Quality score ≥ 0.6
- No duplicate cattle
- Diverse breeds, locations, conditions
- Balanced representation

#### 3.7.2 Retraining Strategy

**Monthly Retraining Schedule:**

**Week 1: Data Preparation**
- Export new cattle images from staging buffer
- Combine with existing training set
- Apply data augmentation
- Split: 90% train, 10% validation

**Week 2-3: Model Training**
- Fine-tune existing SimCLR model (not from scratch)
- Use existing weights as initialization
- Lower learning rate: 0.01 (vs 0.3 initial)
- Epochs: 50 (vs 200 initial)
- Hardware: 4× GPUs
- Duration: ~3 days

**Week 4: Validation & Deployment**
- Evaluate on validation set
- Compare with previous model version
- A/B test on 10% traffic
- If accuracy maintained or improved: full deployment
- If degraded: rollback, investigate

**Model Versioning:**
```
models/
├── simclr_v1.0_2024-01.pth  # Initial model
├── simclr_v1.1_2024-02.pth  # After 1 month
├── simclr_v1.2_2024-03.pth  # After 2 months
└── simclr_production.pth     # Symlink to current
```

#### 3.7.3 Embedding Migration Strategy

**Challenge:** Model updates change embedding space

**Solution: Backward Compatible Embeddings**

**Option A: Re-encode All Cattle (Preferred)**
- When deploying new model version
- Re-generate embeddings for all registered cattle
- Rebuild FAISS indices
- Downtime: 2-4 hours (depends on scale)
- Cost: $500-1000 GPU compute

**Option B: Dual Embedding Storage**
- Store embeddings from both old and new models
- During transition period, search both indices
- Gradually phase out old embeddings
- No downtime, higher storage cost

**Implementation:**
```python
def migrate_embeddings(old_model, new_model):
    all_cattle = db.query("SELECT cattle_id, image_ids FROM cattle WHERE status='active'")
    
    batch_size = 256
    for batch in chunked(all_cattle, batch_size):
        # Load images
        images = load_images(batch['image_ids'])
        
        # Generate new embeddings
        new_embeddings = new_model.encode(images)
        
        # Update database
        update_embeddings(batch['cattle_id'], new_embeddings)
        
        # Update FAISS indices
        update_faiss_indices(batch['cattle_id'], new_embeddings)
```

#### 3.7.4 Active Learning

**Human Feedback Loop:**

**Low Confidence Cases (0.75-0.85):**
- Operator confirms or rejects match
- Feedback stored in database

**Monthly Analysis:**
- Identify failure patterns
- Common misclassifications
- Breeds with low accuracy
- Lighting conditions causing issues

**Targeted Improvements:**
- Collect more data for problem areas
- Adjust preprocessing for specific issues
- Fine-tune on hard examples

---

## 4. API Specifications

### 4.1 Registration Endpoints

#### POST /api/register
**Register new cattle with images**

**Request:**
```json
{
  "cattle_metadata": {
    "name": "Lakshmi",
    "breed": "Gir",
    "age_years": 3,
    "gender": "female",
    "owner_id": "uuid-owner",
    "location": {
      "state": "Karnataka",
      "district": "Bangalore",
      "mandal": "Anekal"
    }
  },
  "images": [
    {
      "data": "base64_encoded_image",
      "capture_date": "2024-12-01T10:30:00Z"
    }
  ]
}
```

**Response (Success):**
```json
{
  "status": "success",
  "cattle_id": "uuid-cattle",
  "registered_images": 3,
  "avg_quality_score": 0.78,
  "embeddings_generated": 3,
  "message": "Cattle registered successfully"
}
```

**Response (Duplicate Detected):**
```json
{
  "status": "duplicate_detected",
  "similar_cattle": [
    {
      "cattle_id": "uuid-existing",
      "similarity": 0.93,
      "name": "Existing Name",
      "owner": "Owner Name",
      "images": ["url1", "url2"]
    }
  ],
  "action_required": "manual_verification"
}
```

#### POST /api/register/enroll-additional
**Add more images to existing cattle**

**Request:**
```json
{
  "cattle_id": "uuid-cattle",
  "images": [
    {
      "data": "base64_encoded_image",
      "capture_date": "2024-12-05T14:20:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "cattle_id": "uuid-cattle",
  "new_images_added": 2,
  "total_images": 5,
  "embeddings_updated": true
}
```

### 4.2 Identification Endpoints

#### POST /api/identify
**Identify cattle from query image**

**Request:**
```json
{
  "image": "base64_encoded_image",
  "search_region": {
    "state": "Karnataka",
    "district": "Bangalore"
  },
  "options": {
    "return_top_k": 5,
    "min_similarity": 0.70
  }
}
```

**Response (High Confidence Match):**
```json
{
  "status": "match_found",
  "confidence": "high",
  "cattle": {
    "cattle_id": "uuid-cattle",
    "name": "Lakshmi",
    "breed": "Gir",
    "age_years": 3,
    "owner": "Owner Name",
    "location": "Karnataka/Bangalore/Anekal",
    "status": "active"
  },
  "similarity": 0.92,
  "matched_images": ["url1", "url2"]
}
```

**Response (Medium Confidence):**
```json
{
  "status": "manual_verification_required",
  "confidence": "medium",
  "top_candidates": [
    {
      "cattle_id": "uuid1",
      "name": "Candidate1",
      "similarity": 0.85,
      "images": ["url1", "url2"]
    },
    {
      "cattle_id": "uuid2",
      "name": "Candidate2",
      "similarity": 0.83,
      "images": ["url3", "url4"]
    }
  ],
  "action": "Please review images and confirm match"
}
```

**Response (No Match):**
```json
{