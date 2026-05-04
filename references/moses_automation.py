"""
MOSES Automation — Demo Mode (10 Cases)
========================================
- Reads Excel input matrix (label-based, not fixed row indices)
- Fixes: safe_float handles ~169.00 cells; weight group WEIGHT key on same row as item label
- GL Noble Denton Tp derivation: sqrt(13·Hs) → sqrt(30·Hs), 5 points
- For each case creates:
    output/case_000001/
        parameters.txt   ← human-readable summary of every parameter in that case
        run.dat          ← filled template
        run.cif          ← filled template
        moses_output.txt ← MOSES stdout (after run)
        moses_errors.txt ← MOSES stderr (after run)
- Writes output/results_summary.csv on completion

DEMO MODE: set MAX_CASES = 10 to generate and run only the first 10 cases.
Set MAX_CASES = None to run everything.
Set RUN_MOSES  = False to write files but skip MOSES execution.
"""

import os
import re
import csv
import sys
import math
import time
import logging
import itertools
import subprocess
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any

import pandas as pd


# =============================================================================
#  USER CONFIG  — edit these before running
# =============================================================================

EXCEL_PATH        = "input matrix.xlsx"
DAT_TEMPLATE_PATH = "template.dat"
CIF_TEMPLATE_PATH = "template.cif"
OUT_DIR           = "output"
RESULTS_CSV       = os.path.join(OUT_DIR, "results_summary.csv")
LOG_FILE          = "automation.log"

# MOSES executable — update to your installation path
MOSES_EXE         = r"C:\Program Files\Bentley\Offshore\MOSES 2024\bin\win64\MOSESExecutive.exe"
MOSES_ARGS        = ["/nowin", "/noecho", "/silent"]

# --- Demo / run controls ---
MAX_CASES         = 3     # int → stop after N cases | None → run everything
RUN_MOSES         = True    # False → write files only, skip MOSES execution

# --- Spectrum map: Excel integer code → MOSES keyword ---
SPECTRUM_MAP      = {1: "PM", 2: "JONSWAP", 3: "ISSC", 4: "OCHI"}

# --- GL Noble Denton --- 
GL_POINTS         = 5       # number of Tp values per Hs (first = Tp, rest = Wv_Per)

# --- Weight sub-parameters expected in the weight table ---
WEIGHT_KEYS       = ["WEIGHT", "LCG", "TCG", "VCG", "LSTART", "LEND"]

# =============================================================================
#  LOGGING SETUP
# =============================================================================

def setup_logging() -> logging.Logger:
    logger = logging.getLogger("moses_auto")
    if logger.handlers:
        return logger
    logger.setLevel(logging.INFO)
    fmt = logging.Formatter("%(asctime)s  %(levelname)-8s  %(message)s",
                             datefmt="%H:%M:%S")
    fh = logging.FileHandler(LOG_FILE, mode="a", encoding="utf-8")
    fh.setFormatter(fmt)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(fmt)
    logger.addHandler(fh)
    logger.addHandler(sh)
    return logger

logger = setup_logging()

def section(title: str) -> None:
    bar = "=" * 80
    logger.info(bar)
    logger.info(title)
    logger.info(bar)


# =============================================================================
#  UTILITIES
# =============================================================================

TOKEN_RE = re.compile(r"\$AUTO_([A-Z0-9_]+)\$")

def extract_tokens(text: str) -> List[str]:
    return sorted(set(TOKEN_RE.findall(text)))

def safe_float(val) -> Optional[float]:
    """Convert to float, stripping stray characters like ~ that appear in cells."""
    if val is None:
        return None
    try:
        if isinstance(val, float) and math.isnan(val):
            return None
        return float(str(val).replace("~", "").replace(" ", "").strip())
    except (ValueError, TypeError):
        return None

def linspace(minv: float, maxv: float, divs: int, dec: int = 3) -> List[float]:
    """Return divs+1 evenly spaced values from minv to maxv inclusive."""
    if divs <= 0:
        return [round(minv, dec)]
    step = (maxv - minv) / divs
    return [round(minv + i * step, dec) for i in range(divs + 1)]

def gl_wave_params(hs: float) -> Tuple[float, str, List[float]]:
    """
    GL Noble Denton peak period rule.
    Returns: (Tp, WV_PER_string, full_list)
        Tp       = first value = sqrt(13·Hs) rounded
        WV_PER   = remaining GL_POINTS-1 values as space-separated string
        full_list = all GL_POINTS values
    """
    lo = math.sqrt(13.0 * hs)
    hi = math.sqrt(30.0 * hs)
    step = (hi - lo) / (GL_POINTS - 1)
    vals = [round(lo + i * step, 3) for i in range(GL_POINTS)]
    tp     = vals[0]
    wv_per = " ".join(str(v) for v in vals[1:])
    return tp, wv_per, vals

def fill_template(template_text: str, case: Dict[str, Any]) -> Tuple[str, List[str]]:
    """
    Replace all $AUTO_KEY$ tokens with values from case dict.
    Returns (filled_text, list_of_unreplaced_tokens).
    """
    text = template_text
    for key, value in case.items():
        text = text.replace(f"$AUTO_{key}$", str(value))
    unreplaced = sorted(set(TOKEN_RE.findall(text)))
    return text, unreplaced

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def fmt_time(sec: float) -> str:
    sec = max(0.0, sec)
    if sec < 60:   return f"{sec:.0f}s"
    if sec < 3600: return f"{sec/60:.1f}m"
    return f"{sec/3600:.2f}h"


# =============================================================================
#  EXCEL PARSING
# =============================================================================

def load_excel(path: str) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Returns:
        df_main  — the INPUTS table (columns: INPUTS, MINMUM, MAXIMUM, NO. OF DIVISIONS)
        df_weight — the weight sub-table (columns: ITEM, PARAMETER, BASE, MINIMUM, MAXIMUM, DIVS, STEP)
    """
    raw = pd.read_excel(path, sheet_name=0, header=None)
    logger.info("Raw sheet shape: %s", raw.shape)

    # --- Locate INPUTS header row ---
    inputs_row = None
    for i, row in raw.iterrows():
        vals = [str(v).strip().upper() for v in row.values]
        if "INPUTS" in vals:
            inputs_row = i
            break
    if inputs_row is None:
        raise RuntimeError("Cannot find row containing 'INPUTS' in Excel sheet.")

    df_main = raw.iloc[inputs_row + 1:].copy()
    df_main.columns = [str(v).strip().upper() for v in raw.iloc[inputs_row].values]
    df_main = df_main.dropna(how="all").reset_index(drop=True)

    for col in ["MINMUM", "MAXIMUM", "NO. OF DIVISIONS"]:
        if col in df_main.columns:
            df_main[col] = pd.to_numeric(df_main[col], errors="coerce")

    # --- Locate WEIGHT sub-table (header contains both ITEM and PARAMETER) ---
    weight_row = None
    for i, row in raw.iterrows():
        vals = [str(v).strip().upper() for v in row.values]
        if "ITEM" in vals and "PARAMETER" in vals:
            weight_row = i
            break

    if weight_row is None:
        raise RuntimeError("Cannot find weight sub-table header (ITEM | PARAMETER) in Excel.")

    df_weight = raw.iloc[weight_row + 1:].copy()
    df_weight.columns = [str(v).strip().upper() for v in raw.iloc[weight_row].values]
    df_weight = df_weight.dropna(how="all").reset_index(drop=True)

    # Apply safe_float to numeric columns in weight table
    for col in ["BASE", "MINIMUM", "MAXIMUM", "DIVS", "STEP"]:
        if col in df_weight.columns:
            df_weight[col] = df_weight[col].apply(safe_float)

    logger.info("df_main rows: %d  |  df_weight rows: %d", len(df_main), len(df_weight))
    return df_main, df_weight


def parse_tanks(df_main: pd.DataFrame) -> Tuple[List[str], Dict[str, List[float]]]:
    """
    Returns (ordered list of tank names, dict of tank → fill % values).
    """
    rows = df_main[df_main["INPUTS"].astype(str).str.contains("WBT", na=False)]
    tank_names  = []
    tank_ranges = {}
    for _, r in rows.iterrows():
        name = str(r["INPUTS"]).strip()
        mn = safe_float(r["MINMUM"])
        mx = safe_float(r["MAXIMUM"])
        dv = safe_float(r["NO. OF DIVISIONS"])
        if None in (mn, mx, dv):
            logger.warning("Tank '%s' — missing MIN/MAX/DIVS, skipping.", name)
            continue
        tank_names.append(name)
        tank_ranges[name] = linspace(mn, mx, int(dv))
    return tank_names, tank_ranges


def parse_scalar(df_main: pd.DataFrame, label: str) -> List[float]:
    """Find a labelled row in df_main by INPUTS column and return its linspace values."""
    mask = df_main["INPUTS"].astype(str).str.contains(label, case=False, na=False)
    matches = df_main[mask]
    if matches.empty:
        logger.warning("Label '%s' not found in INPUTS column.", label)
        return []
    r  = matches.iloc[0]
    mn = safe_float(r["MINMUM"])
    mx = safe_float(r["MAXIMUM"])
    dv = safe_float(r["NO. OF DIVISIONS"])
    if None in (mn, mx, dv):
        logger.warning("Label '%s' — missing MIN/MAX/DIVS.", label)
        return []
    return linspace(mn, mx, int(dv))


def parse_weight_groups(df_weight: pd.DataFrame) -> Dict[str, Dict[str, List[float]]]:
    """
    Parse W1..W8 from the weight sub-table.

    Excel layout:
        ITEM  | PARAMETER    | ... | MINIMUM | MAXIMUM | DIVS
        w1    | Weight (MT)  |     | 1080    | 1320    | 2
              | LCG (m)      |     | 65.21   | 67.21   | 2
              | ...

    FIX: The item label (w1) and its first parameter (Weight) are on the SAME row.
         We must NOT `continue` after detecting the item — fall through to also
         parse the parameter on that same row.
    """
    W: Dict[str, Dict[str, List[float]]] = {}
    current: Optional[str] = None

    for _, r in df_weight.iterrows():
        item  = str(r.get("ITEM",      "")).strip().upper()
        param = str(r.get("PARAMETER", "")).strip().upper()

        # --- Detect new weight group row (W1, W2, … W8) ---
        # Do NOT `continue` — the WEIGHT parameter is on this same row.
        if re.fullmatch(r"W\d+", item):
            current = item
            W[current] = {}
            # fall through intentionally ↓

        if current is None:
            continue

        # --- Map parameter label to internal key ---
        key: Optional[str] = None
        if   "WEIGHT" in param:                        key = "WEIGHT"
        elif "LCG"    in param:                        key = "LCG"
        elif "TCG"    in param:                        key = "TCG"
        elif "VCG"    in param:                        key = "VCG"
        elif "START"  in param or "LSTART" in param:   key = "LSTART"
        elif "END"    in param or "LEND"   in param:   key = "LEND"

        if key is None:
            continue

        mn = safe_float(r.get("MINIMUM"))
        mx = safe_float(r.get("MAXIMUM"))
        dv = safe_float(r.get("DIVS"))
        if None in (mn, mx, dv):
            logger.warning("%s.%s — missing MINIMUM/MAXIMUM/DIVS, skipping.", current, key)
            continue

        W[current][key] = linspace(mn, mx, int(dv))

    return W


def parse_spectra(df_main: pd.DataFrame) -> List[str]:
    """
    Reads the spectrum block: rows beneath 'Spectrum' in INPUTS column
    that have a numeric key (1–4) mapped via SPECTRUM_MAP.
    Falls back to all 4 spectra if block not found.
    """
    spectra: List[str] = []
    in_block = False
    col2 = df_main.columns[1]   # second column (MINMUM) holds the spectrum name

    for _, r in df_main.iterrows():
        label = str(r["INPUTS"]).strip()
        if "spectrum" in label.lower():
            in_block = True
            continue
        if in_block:
            try:
                key = int(float(label))
                name = SPECTRUM_MAP.get(key)
                if name:
                    spectra.append(name)
            except (ValueError, TypeError):
                # Blank or next section — end of block
                if label and label.upper() != "NAN":
                    break

    if not spectra:
        logger.warning("Spectrum block not found — using all 4 default spectra.")
        spectra = list(SPECTRUM_MAP.values())
    return spectra


# =============================================================================
#  CASE GENERATOR
# =============================================================================

def case_generator(
    tank_names:    List[str],
    tank_ranges:   Dict[str, List[float]],
    weights:       Dict[str, Dict[str, List[float]]],
    hs_vals:       List[float],
    heading_vals:  List[float],
    spectra:       List[str],
    windage_vals:  List[float],
    speed_vals:    List[float],
    tanaka_vals:   List[float],
):
    """
    Lazy generator — yields one case dict at a time.
    Outer loops: spectrum → heading → Hs → windage → speed → tanaka → weights → tanks
    """
    w_names = sorted(weights.keys())   # W1, W2, … W8

    # Pre-build all combinations of each weight group's 6 sub-params
    w_combos = {
        wn: list(itertools.product(
            weights[wn].get("WEIGHT", [0]),
            weights[wn].get("LCG",    [0]),
            weights[wn].get("TCG",    [0]),
            weights[wn].get("VCG",    [0]),
            weights[wn].get("LSTART", [0]),
            weights[wn].get("LEND",   [0]),
        ))
        for wn in w_names
    }

    tank_value_lists = [tank_ranges[t] for t in tank_names]

    for spec in spectra:
        for hdg in heading_vals:
            for hs in hs_vals:
                tp, wv_per, _ = gl_wave_params(hs)
                for wind in windage_vals:
                    for spd in speed_vals:
                        for tan in tanaka_vals:
                            for w_combo in itertools.product(*[w_combos[wn] for wn in w_names]):
                                for tank_vals in itertools.product(*tank_value_lists):

                                    case: Dict[str, Any] = {}

                                    # --- Environmental / wave ---
                                    case["SPECTRUM"]     = spec
                                    case["HEADING"]      = hdg
                                    case["HS"]           = hs
                                    case["TP"]           = tp
                                    case["WV_PER"]       = wv_per
                                    case["WINDAGE_AREA"] = wind
                                    case["SPEED"]        = spd
                                    case["TANAKA"]       = int(tan) if float(tan).is_integer() else tan

                                    # --- Weight groups ---
                                    for wi, wn in enumerate(w_names):
                                        vals = w_combo[wi]   # (WEIGHT, LCG, TCG, VCG, LSTART, LEND)
                                        case[f"{wn}_WEIGHT"] = vals[0]
                                        case[f"{wn}_LCG"]    = vals[1]
                                        case[f"{wn}_TCG"]    = vals[2]
                                        case[f"{wn}_VCG"]    = vals[3]
                                        case[f"{wn}_LSTART"] = vals[4]
                                        case[f"{wn}_LEND"]   = vals[5]

                                    # --- Ballast tanks ---
                                    for tname, tval in zip(tank_names, tank_vals):
                                        case[tname] = tval

                                    yield case


# =============================================================================
#  PARAMETERS.TXT WRITER
# =============================================================================

def write_parameters_txt(path: str, case_id: int, case: Dict[str, Any],
                         unreplaced_dat: List[str], unreplaced_cif: List[str]) -> None:
    """
    Write a human-readable parameter summary for a single case.
    Groups: Environmental | Weight Groups | Ballast Tanks | Token Warnings
    """
    lines = []
    lines.append("=" * 70)
    lines.append(f"  CASE {case_id:06d}  —  Parameter Summary")
    lines.append(f"  Generated: {datetime.now().strftime('%Y-%m-%d  %H:%M:%S')}")
    lines.append("=" * 70)

    # --- Environmental / wave ---
    lines.append("")
    lines.append("  ENVIRONMENTAL & WAVE PARAMETERS")
    lines.append("  " + "-" * 40)
    env_keys = ["HS", "TP", "WV_PER", "SPECTRUM", "HEADING",
                "WINDAGE_AREA", "SPEED", "TANAKA"]
    for k in env_keys:
        if k in case:
            lines.append(f"  {k:<20s}  =  {case[k]}")

    # --- Weight groups ---
    lines.append("")
    lines.append("  WEIGHT GROUPS")
    lines.append("  " + "-" * 40)
    for wn in ["W1","W2","W3","W4","W5","W6","W7","W8"]:
        sub = {k.replace(f"{wn}_", ""): v
               for k, v in case.items()
               if k.startswith(f"{wn}_")}
        if sub:
            lines.append(f"  {wn}:")
            for sk, sv in sub.items():
                lines.append(f"      {sk:<10s}  =  {sv}")

    # --- Ballast tanks ---
    lines.append("")
    lines.append("  BALLAST TANK FILL  (%)")
    lines.append("  " + "-" * 40)
    tank_items = {k: v for k, v in case.items()
                  if "WBT" in k}
    for tname, tval in tank_items.items():
        lines.append(f"  {tname:<16s}  =  {tval}")

    # --- Token warnings ---
    if unreplaced_dat or unreplaced_cif:
        lines.append("")
        lines.append("  !! UNREPLACED TOKENS !!")
        lines.append("  " + "-" * 40)
        if unreplaced_dat:
            lines.append(f"  DAT: {unreplaced_dat}")
        if unreplaced_cif:
            lines.append(f"  CIF: {unreplaced_cif}")

    lines.append("")
    lines.append("=" * 70)

    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


# =============================================================================
#  MOSES RUNNER
# =============================================================================

def run_moses(moses_exe: str, cif_path: str, work_folder: str) -> Tuple[int, str, str, float]:
    """
    Run MOSES using the same subprocess pattern as automation.py.
    Returns (returncode, stdout, stderr, elapsed_seconds).
    """
    start = time.time()

    # MOSES CLI: MOSESExecutive.exe  <cif_file>  /nowin  /noecho
    cmd = [moses_exe, cif_path] + MOSES_ARGS

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    out, err = proc.communicate()
    return proc.returncode, out, err, time.time() - start


# =============================================================================
#  PARSE MOSES SUMMARY OUTPUT
# =============================================================================

def parse_summary(stdout: str) -> Dict[str, str]:
    """
    Parses lines like:
        MOTION_AMPL: SU=0.12 SW=0.08 HE=0.05 RO=1.2 PI=0.9 YA=0.3
        ACCEL_AMPL:  SU=0.01 SW=0.02 HE=0.01 RO=0.1 PI=0.05 YA=0.02
    Returns flat dict with keys M_SU, M_SW … A_SU, A_SW …
    """
    result: Dict[str, str] = {}
    for line in stdout.splitlines():
        line = line.strip()
        if line.startswith("MOTION_AMPL:"):
            for part in line.replace("MOTION_AMPL:", "").strip().split():
                if "=" in part:
                    k, v = part.split("=", 1)
                    result[f"M_{k}"] = v
        elif line.startswith("ACCEL_AMPL:"):
            for part in line.replace("ACCEL_AMPL:", "").strip().split():
                if "=" in part:
                    k, v = part.split("=", 1)
                    result[f"A_{k}"] = v
        elif line.startswith("SUMMARY:"):
            result["SUMMARY_LINE"] = line
    return result


# =============================================================================
#  MAIN
# =============================================================================

def main():
    section("MOSES AUTOMATION — DEMO MODE" if MAX_CASES else "MOSES AUTOMATION — FULL RUN")
    logger.info("MAX_CASES=%s  RUN_MOSES=%s", MAX_CASES, RUN_MOSES)

    # ── Preflight: check required files ──────────────────────────────────────
    section("PREFLIGHT — FILE CHECK")
    for fp in [EXCEL_PATH, DAT_TEMPLATE_PATH, CIF_TEMPLATE_PATH]:
        if not os.path.exists(fp):
            logger.error("Missing required file: %s", fp)
            raise SystemExit(f"Missing file: {fp}")
        logger.info("  ✅  Found: %s", fp)

    if RUN_MOSES and not os.path.exists(MOSES_EXE):
        logger.warning("MOSES_EXE not found: %s — RUN_MOSES will be skipped.", MOSES_EXE)

    # ── Load templates ────────────────────────────────────────────────────────
    section("LOAD TEMPLATES")
    with open(DAT_TEMPLATE_PATH, "r", encoding="utf-8", errors="ignore") as f:
        dat_template = f.read()
    with open(CIF_TEMPLATE_PATH, "r", encoding="utf-8", errors="ignore") as f:
        cif_template = f.read()

    dat_tokens = extract_tokens(dat_template)
    cif_tokens = extract_tokens(cif_template)
    logger.info("DAT tokens (%d): %s", len(dat_tokens), dat_tokens)
    logger.info("CIF tokens (%d): %s", len(cif_tokens), cif_tokens)

    # ── Parse Excel ───────────────────────────────────────────────────────────
    section("PARSE EXCEL")
    df_main, df_weight = load_excel(EXCEL_PATH)

    tank_names, tank_ranges = parse_tanks(df_main)
    logger.info("Tanks (%d): %s", len(tank_names), tank_names)
    for t in tank_names:
        v = tank_ranges[t]
        logger.info("  %-14s  %d values  [%.1f … %.1f]", t, len(v), v[0], v[-1])

    hs_vals      = parse_scalar(df_main, "Wave Height")
    tp_vals_raw  = parse_scalar(df_main, "Wave Period")  # for reference only
    heading_vals = parse_scalar(df_main, "Heading")
    windage_vals = parse_scalar(df_main, "Windage Area")
    speed_vals   = parse_scalar(df_main, "Forward Speed")
    tanaka_vals  = parse_scalar(df_main, "Tanaka")
    tanaka_vals  = [int(v) for v in tanaka_vals]
    spectra      = parse_spectra(df_main)

    logger.info("Hs values       : %s", hs_vals)
    logger.info("Headings        : %s", heading_vals)
    logger.info("Windage         : %s", windage_vals)
    logger.info("Speed           : %s", speed_vals)
    logger.info("Tanaka          : %s", tanaka_vals)
    logger.info("Spectra         : %s", spectra)

    weights = parse_weight_groups(df_weight)
    logger.info("Weight groups:")
    all_ok = True
    for wn in sorted(weights):
        keys  = list(weights[wn].keys())
        miss  = [k for k in WEIGHT_KEYS if k not in keys]
        ok    = "✅" if not miss else f"⚠️  MISSING: {miss}"
        logger.info("  %-4s  %s   %s", wn, keys, ok)
        if miss:
            all_ok = False
    if not all_ok:
        raise SystemExit("Fix weight table in Excel and rerun.")

    # ── GL Tp demo ────────────────────────────────────────────────────────────
    section("GL NOBLE DENTON Tp DERIVATION")
    for hs in hs_vals:
        tp, wvp, full = gl_wave_params(hs)
        logger.info("  Hs=%4.1f  →  Tp=%5.3f  WV_PER=[%s]", hs, tp,
                    " ".join(f"{v:.3f}" for v in full[1:]))

    # ── Token validation ──────────────────────────────────────────────────────
    section("TOKEN VALIDATION")
    expected: set = set()
    for t in tank_names:
        expected.add(t)
    for wn in weights:
        for k in WEIGHT_KEYS:
            expected.add(f"{wn}_{k}")
    expected |= {"HS","TP","WV_PER","TANAKA","WINDAGE_AREA","SPEED","HEADING","SPECTRUM"}

    all_template_tokens = set(dat_tokens) | set(cif_tokens)
    not_covered = sorted(all_template_tokens - expected)
    if not_covered:
        logger.error("Tokens in templates NOT covered by Excel/Python: %s", not_covered)
        raise SystemExit("Fix missing token coverage and rerun.")
    else:
        logger.info("✅ All template tokens are covered.")

    # ── Total case count ──────────────────────────────────────────────────────
    section("COMBINATION COUNT")
    n_env      = len(hs_vals) * len(heading_vals) * len(spectra) * \
                 len(windage_vals) * len(speed_vals) * len(tanaka_vals)
    n_weights  = 1
    for wn in weights:
        for k in WEIGHT_KEYS:
            n_weights *= len(weights[wn][k])
    n_tanks    = 1
    for t in tank_names:
        n_tanks *= len(tank_ranges[t])
    total_cases = n_env * n_weights * n_tanks

    logger.info("Environmental combinations : %12d", n_env)
    logger.info("Weight combinations        : %12d", n_weights)
    logger.info("Tank combinations          : %12d", n_tanks)
    logger.info("Total cases                : %12d", total_cases)
    to_run = min(total_cases, MAX_CASES) if MAX_CASES is not None else total_cases
    logger.info("Cases this run             : %12d  (MAX_CASES=%s)", to_run, MAX_CASES)

    # ── Prepare output dir + CSV ──────────────────────────────────────────────
    section("PREPARE OUTPUT")
    ensure_dir(OUT_DIR)
    csv_fields = [
        "CASE_ID", "STATUS", "RUNTIME_S",
        "HS", "TP", "WV_PER", "SPECTRUM", "HEADING",
        "TANAKA", "WINDAGE_AREA", "SPEED",
        "M_SU","M_SW","M_HE","M_RO","M_PI","M_YA",
        "A_SU","A_SW","A_HE","A_RO","A_PI","A_YA",
        "SUMMARY_LINE"
    ]
    with open(RESULTS_CSV, "w", newline="", encoding="utf-8") as f:
        csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore").writeheader()
    logger.info("Results CSV initialised: %s", RESULTS_CSV)

    # ── MAIN CASE LOOP ────────────────────────────────────────────────────────
    section("RUNNING CASES")

    gen = case_generator(
        tank_names, tank_ranges, weights,
        hs_vals, heading_vals, spectra,
        windage_vals, speed_vals, tanaka_vals,
    )

    started      = time.time()
    runtimes     = []
    failures     = []
    processed    = 0

    for case in gen:
        if MAX_CASES is not None and processed >= MAX_CASES:
            break

        processed += 1
        case_id    = processed
        case_dir   = os.path.join(OUT_DIR, f"case_{case_id:06d}")
        ensure_dir(case_dir)

        logger.info("-" * 60)
        logger.info("CASE %d/%d  |  Hs=%.2f  Tp=%.3f  Hdg=%.1f  Sp=%s",
                    case_id, to_run,
                    case["HS"], case["TP"], case["HEADING"], case["SPECTRUM"])

        # --- Fill templates ---
        dat_filled, miss_dat = fill_template(dat_template, case)
        cif_filled, miss_cif = fill_template(cif_template, case)

        if miss_dat or miss_cif:
            logger.warning("  Unreplaced tokens — DAT:%s  CIF:%s", miss_dat, miss_cif)

        # --- Write parameters.txt ---
        params_path = os.path.join(case_dir, "parameters.txt")
        write_parameters_txt(params_path, case_id, case, miss_dat, miss_cif)
        logger.info("  Wrote: parameters.txt")

        # --- Write run.dat ---
        dat_path = os.path.join(case_dir, "run.dat")
        with open(dat_path, "w", encoding="utf-8", errors="surrogateescape") as f:
            f.write(dat_filled)
        logger.info("  Wrote: run.dat")

        # --- Write run.cif ---
        cif_path = os.path.join(case_dir, "run.cif")
        with open(cif_path, "w", encoding="utf-8", errors="surrogateescape") as f:
            f.write(cif_filled)
        logger.info("  Wrote: run.cif")

        # --- Run MOSES ---
        status     = "FILES_WRITTEN"
        runtime_s  = 0.0
        stdout_txt = ""
        stderr_txt = ""

        if RUN_MOSES and os.path.exists(MOSES_EXE):
            rc, stdout_txt, stderr_txt, runtime_s = run_moses(MOSES_EXE, cif_path, case_dir)
            runtimes.append(runtime_s)

            with open(os.path.join(case_dir, "moses_output.txt"), "w",
                      encoding="utf-8", errors="replace") as f:
                f.write(stdout_txt)
            with open(os.path.join(case_dir, "moses_errors.txt"), "w",
                      encoding="utf-8", errors="replace") as f:
                f.write(stderr_txt)

            if rc != 0:
                status = f"FAIL_RC_{rc}"
                failures.append(case_id)
                logger.warning("  ❌ MOSES failed (rc=%d)", rc)
            else:
                status = "OK"
                logger.info("  ✅ MOSES OK  %.1fs", runtime_s)
        elif RUN_MOSES:
            logger.warning("  MOSES_EXE not found — skipped.")
            status = "MOSES_EXE_MISSING"

        # --- Parse results ---
        summary = parse_summary(stdout_txt)

        # --- Write CSV row ---
        row = {
            "CASE_ID":      case_id,
            "STATUS":       status,
            "RUNTIME_S":    round(runtime_s, 2),
            "HS":           case["HS"],
            "TP":           case["TP"],
            "WV_PER":       case["WV_PER"],
            "SPECTRUM":     case["SPECTRUM"],
            "HEADING":      case["HEADING"],
            "TANAKA":       case["TANAKA"],
            "WINDAGE_AREA": case["WINDAGE_AREA"],
            "SPEED":        case["SPEED"],
            "M_SU":         summary.get("M_SU", ""),
            "M_SW":         summary.get("M_SW", ""),
            "M_HE":         summary.get("M_HE", ""),
            "M_RO":         summary.get("M_RO", ""),
            "M_PI":         summary.get("M_PI", ""),
            "M_YA":         summary.get("M_YA", ""),
            "A_SU":         summary.get("A_SU", ""),
            "A_SW":         summary.get("A_SW", ""),
            "A_HE":         summary.get("A_HE", ""),
            "A_RO":         summary.get("A_RO", ""),
            "A_PI":         summary.get("A_PI", ""),
            "A_YA":         summary.get("A_YA", ""),
            "SUMMARY_LINE": summary.get("SUMMARY_LINE", ""),
        }
        with open(RESULTS_CSV, "a", newline="", encoding="utf-8") as f:
            csv.DictWriter(f, fieldnames=csv_fields, extrasaction="ignore").writerow(row)

        # --- Progress / ETA ---
        elapsed  = time.time() - started
        remaining = max(0, to_run - case_id)
        if runtimes:
            avg = sum(runtimes[-10:]) / len(runtimes[-10:])
            eta = avg * remaining
            logger.info("  Progress %d/%d  |  Elapsed %s  Avg %.1fs  ETA %s  Failures %d",
                        case_id, to_run, fmt_time(elapsed), avg, fmt_time(eta), len(failures))
        else:
            logger.info("  Progress %d/%d  |  Elapsed %s  Failures %d",
                        case_id, to_run, fmt_time(elapsed), len(failures))

    # ── Done ──────────────────────────────────────────────────────────────────
    section("DONE")
    logger.info("Cases processed : %d", processed)
    logger.info("Failures        : %d  %s", len(failures),
                failures if failures else "")
    logger.info("Results CSV     : %s", RESULTS_CSV)
    logger.info("Output folder   : %s", os.path.abspath(OUT_DIR))


if __name__ == "__main__":
    main()
