#!/usr/bin/env python3
"""
Simple Cattle ROI Extraction (All Views) - BOUNDARY CUT
========================================================
Processes ALL cattle views: facepic, muzzle, leftpic, rightpic (case-insensitive)
Generates Excel audit sheet for cattle_id image availability

Features:
- Processes ALL views per cattle (not just one)
- Cuts to exact cattle boundary (not rectangular bounding box)
- No scaling/resizing - keeps original resolution
- Excel audit sheet generation
- rembg + GrabCut fallback segmentation
- Optional debug steps
- Parallel processing

Usage:
    # Basic usage
    python 05_simple_roi_extractor.py /path/to/cattle_images

    # No debug images
    python 05_simple_roi_extractor.py /path/to/cattle_images --no-debug

    # Only ROI (no mask, no debug)
    python 05_simple_roi_extractor.py /path/to/cattle_images --no-debug --roi-only

    # Custom workers
    python 05_simple_roi_extractor.py /path/to/cattle_images --workers 12
"""

import os
import sys
import argparse
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from typing import Tuple, Optional, Dict, List
import warnings

import numpy as np
import pandas as pd
import cv2
from PIL import Image
from rembg import remove
from tqdm import tqdm

warnings.filterwarnings('ignore')

# Configuration
MAX_WORKERS_CPU = 20
PADDING_PERCENT = 0.0  # No padding - cut to exact boundary


def find_valid_cattle_images(cattle_dir: Path) -> List[Tuple[str, Path]]:
    """
    Find ALL valid images (facepic, muzzle, leftpic, rightpic) in cattle folder.

    Returns:
        List of (image_type, image_path) tuples
    """
    all_images = []

    # Find all images
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']:
        all_images.extend(cattle_dir.glob(ext))

    valid_images = []

    for img_path in all_images:
        # Get filename without extension
        stem = img_path.stem.lower()

        # Check for all view types
        if stem.endswith('facepic'):
            valid_images.append(('facepic', img_path))
        elif stem.endswith('muzzle'):
            valid_images.append(('muzzle', img_path))
        elif stem.endswith('leftpic'):
            valid_images.append(('leftpic', img_path))
        elif stem.endswith('rightpic'):
            valid_images.append(('rightpic', img_path))

    return valid_images


def scan_cattle_directory(root_dir: Path) -> Tuple[List[Tuple[str, str, Path]], pd.DataFrame]:
    """
    Scan cattle directory and create audit sheet.
    Processes ALL views (facepic, muzzle, leftpic, rightpic) per cattle.

    Returns:
        (valid_images_list, audit_dataframe)
    """
    audit_records = []
    valid_images = []

    for cattle_dir in sorted(root_dir.iterdir()):
        if not cattle_dir.is_dir():
            continue

        cattle_id = cattle_dir.name
        cattle_images = find_valid_cattle_images(cattle_dir)

        if len(cattle_images) > 0:
            # Found valid images
            image_types = [img_type for img_type, _ in cattle_images]
            image_types_str = ', '.join(image_types)

            audit_records.append({
                'cattle_id': cattle_id,
                'images_present': 'YES',
                'image_count': len(cattle_images),
                'image_types': image_types_str,
                'facepic': 'YES' if 'facepic' in image_types else 'NO',
                'muzzle': 'YES' if 'muzzle' in image_types else 'NO',
                'leftpic': 'YES' if 'leftpic' in image_types else 'NO',
                'rightpic': 'YES' if 'rightpic' in image_types else 'NO'
            })

            # Add all images to processing list
            for image_type, img_path in cattle_images:
                valid_images.append((cattle_id, image_type, img_path))
        else:
            # Check if folder has any images
            all_imgs = list(cattle_dir.glob('*.jpg')) + list(cattle_dir.glob('*.png')) + \
                      list(cattle_dir.glob('*.jpeg')) + list(cattle_dir.glob('*.JPG')) + \
                      list(cattle_dir.glob('*.PNG')) + list(cattle_dir.glob('*.JPEG'))

            if len(all_imgs) > 0:
                audit_records.append({
                    'cattle_id': cattle_id,
                    'images_present': 'YES (but no valid views)',
                    'image_count': 0,
                    'image_types': 'NONE',
                    'facepic': 'NO',
                    'muzzle': 'NO',
                    'leftpic': 'NO',
                    'rightpic': 'NO'
                })
            else:
                audit_records.append({
                    'cattle_id': cattle_id,
                    'images_present': 'NO',
                    'image_count': 0,
                    'image_types': 'EMPTY',
                    'facepic': 'NO',
                    'muzzle': 'NO',
                    'leftpic': 'NO',
                    'rightpic': 'NO'
                })

    audit_df = pd.DataFrame(audit_records)
    return valid_images, audit_df


def enhance_contrast(img_bgr: np.ndarray) -> np.ndarray:
    """Apply CLAHE for better segmentation on dark cattle."""
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    l_enhanced = clahe.apply(l)
    lab_enhanced = cv2.merge([l_enhanced, a, b])
    enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)
    return enhanced


def apply_dl_segmentation(img_enhanced: np.ndarray) -> np.ndarray:
    """Apply rembg for foreground segmentation."""
    try:
        img_rgb = cv2.cvtColor(img_enhanced, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(img_rgb)
        output = remove(pil_img)
        output_np = np.array(output)
        if output_np.shape[2] == 4:
            alpha = output_np[:, :, 3]
        else:
            alpha = np.full(output_np.shape[:2], 255, dtype=np.uint8)
        mask = (alpha > 127).astype(np.uint8) * 255
        return mask
    except Exception:
        h, w = img_enhanced.shape[:2]
        return np.zeros((h, w), dtype=np.uint8)


def apply_grabcut_fallback(img_enhanced: np.ndarray,
                           dl_mask: Optional[np.ndarray] = None) -> np.ndarray:
    """Apply GrabCut as fallback segmentation."""
    h, w = img_enhanced.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    margin_x = int(w * 0.2)
    margin_y = int(h * 0.2)
    rect = (margin_x, margin_y, w - 2*margin_x, h - 2*margin_y)
    bgd_model = np.zeros((1, 65), dtype=np.float64)
    fgd_model = np.zeros((1, 65), dtype=np.float64)
    try:
        if dl_mask is not None and np.sum(dl_mask > 0) > 0:
            mask[dl_mask == 0] = cv2.GC_BGD
            mask[dl_mask > 0] = cv2.GC_FGD
            cv2.grabCut(img_enhanced, mask, None, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_MASK)
        else:
            cv2.grabCut(img_enhanced, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)
        mask_bin = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
        return mask_bin
    except Exception:
        mask_bin = np.zeros((h, w), dtype=np.uint8)
        mask_bin[margin_y:h-margin_y, margin_x:w-margin_x] = 255
        return mask_bin


def compute_mask_quality(mask: np.ndarray) -> float:
    """Compute mask quality score (0-100)."""
    h, w = mask.shape
    total_pixels = h * w
    fg_pixels = np.sum(mask > 0)
    fg_ratio = fg_pixels / total_pixels
    if 0.2 <= fg_ratio <= 0.8:
        area_score = 100
    elif fg_ratio < 0.2:
        area_score = (fg_ratio / 0.2) * 100
    else:
        area_score = ((1.0 - fg_ratio) / 0.2) * 100
    num_labels, labels = cv2.connectedComponents(mask)
    component_score = max(0, 100 - (num_labels - 1) * 10)
    quality = 0.6 * area_score + 0.4 * component_score
    return quality


def select_best_mask(dl_mask: np.ndarray, fallback_mask: np.ndarray) -> Tuple[np.ndarray, str]:
    """Select best mask based on quality."""
    dl_quality = compute_mask_quality(dl_mask)
    fallback_quality = compute_mask_quality(fallback_mask)
    if dl_quality >= 40 and dl_quality >= fallback_quality - 10:
        return dl_mask, "DL"
    else:
        return fallback_mask, "FALLBACK"


def clean_mask(mask: np.ndarray) -> np.ndarray:
    """Clean mask with morphological operations."""
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    mask_closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    mask_opened = cv2.morphologyEx(mask_closed, cv2.MORPH_OPEN, kernel)
    h, w = mask_opened.shape
    flood_filled = mask_opened.copy()
    mask_flood = np.zeros((h+2, w+2), dtype=np.uint8)
    cv2.floodFill(flood_filled, mask_flood, (0, 0), 255)
    flood_filled_inv = cv2.bitwise_not(flood_filled)
    mask_filled = mask_opened | flood_filled_inv
    num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(mask_filled, connectivity=8)
    if num_labels > 1:
        largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        mask_clean = (labels == largest_label).astype(np.uint8) * 255
    else:
        mask_clean = mask_filled
    return mask_clean


def find_bounding_box(mask: np.ndarray, img_shape: Tuple[int, int],
                     padding_percent: float = 0.0) -> Optional[Tuple[int, int, int, int]]:
    """Find tight bounding box around foreground mask with minimal padding."""
    coords = cv2.findNonZero(mask)
    if coords is None or len(coords) == 0:
        return None
    x, y, w, h = cv2.boundingRect(coords)
    img_h, img_w = img_shape[:2]

    # Minimal padding (just 1-2 pixels to avoid edge artifacts)
    pad = 2
    x1 = max(0, x - pad)
    y1 = max(0, y - pad)
    x2 = min(img_w, x + w + pad)
    y2 = min(img_h, y + h + pad)
    return (x1, y1, x2, y2)


def crop_to_roi(img: np.ndarray, bbox: Tuple[int, int, int, int]) -> np.ndarray:
    """Crop image to bounding box."""
    x1, y1, x2, y2 = bbox
    return img[y1:y2, x1:x2].copy()


def apply_mask_to_image(img_bgr: np.ndarray, mask: np.ndarray) -> np.ndarray:
    """Apply mask to image (background = black)."""
    mask_3ch = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)
    result = cv2.bitwise_and(img_bgr, mask_3ch)
    return result


def process_single_cattle(cattle_id: str, image_type: str, img_path: Path,
                          output_base: Path, no_debug: bool = False, roi_only: bool = False) -> bool:
    """
    Process single cattle image:
    1. Background removal
    2. Find bounding box
    3. Crop to ROI
    4. Save complete cattle

    Args:
        no_debug: Skip debug step images
        roi_only: Save only ROI image (no mask)
    """
    try:
        final_dir = output_base / 'final_cattle_roi'
        final_dir.mkdir(parents=True, exist_ok=True)

        # Debug directory (only if not no_debug)
        if not no_debug:
            debug_dir = output_base / 'debug_steps' / cattle_id
            debug_dir.mkdir(parents=True, exist_ok=True)

        # Load image
        img_original = cv2.imread(str(img_path))
        if img_original is None:
            return False

        if not no_debug:
            cv2.imwrite(str(debug_dir / '01_original.png'), img_original)

        # Contrast enhancement
        img_enhanced = enhance_contrast(img_original)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '02_contrast_enhanced.png'), img_enhanced)

        # DL segmentation
        dl_mask = apply_dl_segmentation(img_enhanced)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '03_dl_mask.png'), dl_mask)

        # Fallback segmentation
        fallback_mask = apply_grabcut_fallback(img_enhanced, dl_mask)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '04_fallback_mask.png'), fallback_mask)

        # Select best mask
        selected_mask, method = select_best_mask(dl_mask, fallback_mask)

        # Clean mask
        cleaned_mask = clean_mask(selected_mask)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '05_cleaned_mask.png'), cleaned_mask)

        # Find tight bounding box (cuts to exact boundary with minimal padding)
        bbox = find_bounding_box(cleaned_mask, img_original.shape, padding_percent=PADDING_PERCENT)

        if bbox is None:
            return False

        # Visualize bounding box
        if not no_debug:
            bbox_viz = img_original.copy()
            x1, y1, x2, y2 = bbox
            cv2.rectangle(bbox_viz, (x1, y1), (x2, y2), (0, 255, 0), 3)
            cv2.putText(bbox_viz, f"{image_type.upper()} ({method})", (x1, y1-10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.imwrite(str(debug_dir / '06_bounding_box.png'), bbox_viz)

        # Apply mask to get cattle with no background
        cattle_no_bg = apply_mask_to_image(img_original, cleaned_mask)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '07_cattle_no_background.png'), cattle_no_bg)

        # Crop to ROI
        cattle_cropped = crop_to_roi(cattle_no_bg, bbox)
        if not no_debug:
            cv2.imwrite(str(debug_dir / '08_cattle_cropped_roi.png'), cattle_cropped)

        # Save cropped mask (only if not roi_only)
        if not no_debug and not roi_only:
            mask_cropped = crop_to_roi(cleaned_mask, bbox)
            cv2.imwrite(str(debug_dir / '09_mask_cropped.png'), mask_cropped)

        # Save final output (always save ROI with view type in filename)
        cv2.imwrite(str(final_dir / f'{cattle_id}_{image_type}.png'), cattle_cropped)

        # Save mask in final output (only if not roi_only)
        if not roi_only:
            mask_cropped = crop_to_roi(cleaned_mask, bbox)
            cv2.imwrite(str(final_dir / f'{cattle_id}_{image_type}_mask.png'), mask_cropped)

        return True

    except Exception:
        return False


def main():
    parser = argparse.ArgumentParser(
        description='Simple Cattle ROI Extraction (All Views)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage
  python 05_simple_roi_extractor.py /path/to/cattle_images

  # No debug images (saves disk space)
  python 05_simple_roi_extractor.py /path/to/cattle_images --no-debug

  # Only ROI (no mask, no debug)
  python 05_simple_roi_extractor.py /path/to/cattle_images --no-debug --roi-only

  # Custom workers
  python 05_simple_roi_extractor.py /path/to/cattle_images --workers 12 --no-debug
        """
    )

    parser.add_argument('input_dir', help='Path to cattle images directory')
    parser.add_argument('--output', default='cattle_roi_outputs', help='Output base directory')
    parser.add_argument('--workers', type=int, default=MAX_WORKERS_CPU, help=f'Number of parallel workers (default: {MAX_WORKERS_CPU})')
    parser.add_argument('--no-debug', action='store_true', help='Skip debug step images (saves disk space)')
    parser.add_argument('--roi-only', action='store_true', help='Save ONLY final ROI (no mask files)')

    args = parser.parse_args()

    input_dir = Path(args.input_dir)

    if not input_dir.is_dir():
        print(f"Error: Directory not found: {input_dir}")
        sys.exit(1)

    print("="*80)
    print("CATTLE BOUNDARY CUT ROI EXTRACTION (All Views)")
    print("="*80)
    print("Filter: Process ALL views - facepic, muzzle, leftpic, rightpic (case-insensitive)")
    print("Cut: Exact cattle boundary (minimal 2px padding, keeps original resolution)")
    if args.no_debug:
        print("Mode: NO DEBUG IMAGES")
    if args.roi_only:
        print("Mode: ROI ONLY (no mask files)")
    print()

    # Scan and create audit
    print("Scanning cattle directory...")
    valid_images, audit_df = scan_cattle_directory(input_dir)

    print(f"Total cattle folders: {len(audit_df)}")
    print(f"Valid images found: {len(valid_images)}")
    print()

    # Show breakdown
    print("View Type Breakdown:")
    view_counts = {}
    for _, view_type, _ in valid_images:
        view_counts[view_type] = view_counts.get(view_type, 0) + 1
    for view_type in sorted(view_counts.keys()):
        print(f"  {view_type}: {view_counts[view_type]}")
    print()

    if len(valid_images) == 0:
        print("No valid images found!")
        sys.exit(1)

    # Save audit
    output_base = Path(args.output)
    output_base.mkdir(exist_ok=True)

    audit_path = output_base / 'cattle_image_audit.xlsx'
    audit_df.to_excel(audit_path, index=False, sheet_name='Audit')
    print(f"Audit sheet saved: {audit_path}")
    print()

    print(f"Processing mode: CPU PARALLEL ({args.workers} workers)")
    print()
    print("Processing images...")

    success_count = 0

    with ProcessPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(process_single_cattle, cattle_id, image_type, img_path, output_base, args.no_debug, args.roi_only): cattle_id
            for cattle_id, image_type, img_path in valid_images
        }

        with tqdm(total=len(futures), desc="Extracting ROI") as pbar:
            for future in as_completed(futures):
                try:
                    success = future.result()
                    if success:
                        success_count += 1
                except Exception:
                    pass
                finally:
                    pbar.update(1)

    # Summary
    print("\n" + "="*80)
    print("CATTLE ROI EXTRACTION COMPLETE")
    print("="*80)
    print(f"Total valid images: {len(valid_images)}")
    print(f"Successfully processed: {success_count}")
    print(f"Failed: {len(valid_images) - success_count}")
    print(f"\nOutputs:")
    print(f"  Audit sheet: {audit_path}")
    print(f"  Final cattle ROIs: {output_base / 'final_cattle_roi'}")
    if not args.no_debug:
        print(f"  Debug steps: {output_base / 'debug_steps'}")
    print("\nProcessing Details:")
    print("  ✓ ALL views processed: facepic, muzzle, leftpic, rightpic")
    print("  ✓ Case-insensitive matching")
    print("  ✓ Original resolution preserved (no scaling)")
    if args.no_debug:
        print("  ✓ No debug images (disk space saved)")
    if args.roi_only:
        print("  ✓ ROI only (no mask files)")
    print("="*80)


if __name__ == '__main__':
    main()
