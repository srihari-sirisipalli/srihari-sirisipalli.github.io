export interface PortfolioMetric {
  value: string;
  label: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  type: "professional" | "rnd" | "academic";
  company?: string;
  period?: string;
  description: string;
  metrics?: PortfolioMetric[];
  highlights: string[];
  technologies: string[];
  icon: string;
}

export const portfolio: PortfolioProject[] = [
  // Professional
  {
    id: "patent-similarity",
    title: "Patent Similarity & Prior Art System",
    category: "GenAI • NLP • Cloud",
    type: "professional",
    company: "Pangeon",
    period: "2024 – Present",
    description:
      "Cut patent prior-art evaluation cost ~30% and lifted throughput 5–7× by re-architecting EC2 workloads onto Lambda + LLM-scored embeddings, supporting 1,000+ daily similarity evaluations.",
    metrics: [
      { value: "30%", label: "Infra cost ↓" },
      { value: "5–7×", label: "Throughput ↑" },
      { value: "1K+/day", label: "Patent evals" },
    ],
    highlights: [
      "Built LLM-based similarity scoring for patent document comparison",
      "Integrated vector databases for efficient patent search and retrieval",
      "Designed dynamic AWS architecture with EC2 autoscaling (>30% cost reduction)",
      "Delivered full Terraform IaC: Amplify, IAM, monitoring, security",
    ],
    technologies: ["Python", "LLMs", "FAISS", "AWS", "Terraform", "Lambda"],
    icon: "FileSearch",
  },
  {
    id: "offshore-digital-twin",
    title: "Offshore Digital Twin ML Infrastructure",
    category: "ML Systems • Ocean Engineering",
    type: "professional",
    company: "Vaishvik Vertex Solutions",
    period: "2025 – 2026",
    description:
      "Predicted significant wave height at R² = 0.9992 and reduced worst-case angular heading error 41% via a 156-feature retrain-to-predict pipeline driving offshore riser fatigue and motion models.",
    metrics: [
      { value: "R² 0.999", label: "Wave-height accuracy" },
      { value: "12.5°", label: "Max heading error" },
      { value: "156", label: "Features engineered" },
    ],
    highlights: [
      "Engineered 156-feature pipeline with intelligent angle encoding and adaptive scaling",
      "Built retrain-to-predict infrastructure: automated experiment → evaluation → production cycle",
      "Designed hierarchical classification-regression for circular wave heading (max error 12.5°)",
      "Achieved R² = 0.9992 on significant wave height prediction with Random Forest",
      "Automated MOSES marine simulation parametric studies via Python (794-line automation script)",
    ],
    technologies: ["Python", "Scikit-learn", "MOSES", "Signal Processing", "Pandas"],
    icon: "Waves",
  },
  {
    id: "sas-migration",
    title: "SAS-to-PySpark Migration Platform",
    category: "Data Engineering",
    type: "professional",
    company: "Sas2Py",
    period: "2023",
    description:
      "Automated migration of legacy SAS pipelines to PySpark with validation, dependency mapping, and HTML reporting.",
    metrics: [
      { value: ">99%", label: "Output parity" },
    ],
    highlights: [
      "Migrated SAS → PySpark achieving >99% validation accuracy",
      "Applied graph theory to map pipeline dependencies and uncover bottlenecks",
      "Built automated HTML validation reports for stakeholder review",
    ],
    technologies: ["Python", "PySpark", "SAS", "Graph Theory", "HTML"],
    icon: "ArrowRightLeft",
  },
  {
    id: "terraform-gui",
    title: "Terraform GUI for AWS Management",
    category: "Cloud Infrastructure • DevOps",
    type: "professional",
    company: "Pangeon",
    period: "2024",
    description:
      "Custom GUI tool for simplified AWS resource management via Terraform, enabling non-DevOps team members to manage infrastructure.",
    highlights: [
      "Built visual interface for Terraform plan/apply workflows",
      "Migrated workloads to GPU-enabled Lambda, reducing EC2 dependency",
      "Automated Lambda health checks and resource utilization audits",
    ],
    technologies: ["Terraform", "AWS", "React", "Lambda", "IAM"],
    icon: "LayoutDashboard",
  },
  // R&D
  {
    id: "pynaos-fea",
    title: "PyNAOS: Pure-Python FEA for Offshore Structures",
    category: "Numerical Methods • Offshore Engineering",
    type: "rnd",
    description:
      "Self-contained Python FEA engine for offshore platforms, monopiles, and jack-up rigs. Six analysis drivers backed by a custom Skyline LDLᵀ solver, paired with a desktop workstation for end-to-end design.",
    metrics: [
      { value: "593", label: "Tests" },
      { value: "98.6%", label: "Coverage" },
      { value: "6", label: "Analysis drivers" },
    ],
    highlights: [
      "Implemented six analysis drivers (linear/nonlinear static, eigenvalue, linear/nonlinear dynamic, buckling) over 3D Timoshenko beam, spring, damper, and mass elements with P-Δ effects",
      "Built hydrodynamic and geotechnical modules: Airy/Stokes/Chakrabarti wave kinematics, Morison forces, depth-of-fixity, API RP 2A p-y/t-z curves",
      "Authored a custom Skyline LDLᵀ direct solver and Lanczos eigenvalue routines, with no external FEM dependencies",
      "Shipped a PyQt5 + OpenGL desktop workstation with 7 analysis workspaces, 3D viewer, command palette, validation/readiness checks, and auto-save",
      "Achieved 593 passing tests at 98.63% coverage with 10 reference scenarios for reproducibility",
    ],
    technologies: ["Python", "NumPy", "SciPy", "PyQt5", "PyOpenGL", "FEA"],
    icon: "LayoutDashboard",
  },
  {
    id: "dcdc-surrogate-pipeline",
    title: "Multi-Input DC-DC Converter Surrogate & Inverse Design",
    category: "ML Surrogates • Power Electronics R&D",
    type: "rnd",
    description:
      "End-to-end ML surrogate pipeline for a dual-input DC-DC converter. Replaces an analytical state-space solver with ~60 µs predictions (~10⁴× speedup), adds OOD detection, and inverts the model for parameter design.",
    metrics: [
      { value: "~10⁴×", label: "Inference speedup" },
      { value: "R² 0.985", label: "Held-out test" },
      { value: "5K", label: "LHS samples" },
    ],
    highlights: [
      "Generated a 5,000-sample LHS dataset with 13 inputs (dual voltages, duty cycles, passives) → 12 outputs (steady-state, small-signal gain matrix, RGA)",
      "Trained 4 formulations × 3 model families (Random Forest, XGBoost, MLP); best XGBoost reached R² = 0.985 on the held-out test set",
      "Built a physics-informed network enforcing the RGA row-sum identity and a 5-layer OOD detector (Mahalanobis, ensemble variance, physics residuals, bounds, RGA consistency)",
      "Implemented differential-evolution inverse design (~5–10 s per query) with a PyQt5 GUI for parameter pinning and target specification",
      "Reproducible 16-script experiment suite producing 92 figures, 63 LaTeX tables, and 7 IEEE-Trans paper drafts",
    ],
    technologies: ["Python", "XGBoost", "PyTorch", "PINN", "scikit-learn", "PyQt5"],
    icon: "Zap",
  },
  {
    id: "naval-arch-studio",
    title: "NavalArch Studio: Ship Design & Stability Suite",
    category: "Naval Architecture • Marine Engineering",
    type: "rnd",
    description:
      "Open-source naval architecture suite: Python library plus PyQt5 desktop GUI covering hydrostatics, stability, seakeeping, damage, structural strength, and classification rules end-to-end.",
    metrics: [
      { value: "13", label: "Domain modules" },
      { value: "~450", label: "Tests" },
      { value: "Maxsurf", label: "Validated against" },
    ],
    highlights: [
      "Built 13 domain subpackages (geometry, hydrostatics, stability, damage, tanks, resistance, seakeeping, diffraction, maneuvering, strength, classification) with ~450 tests",
      "Hydrostatics module with 9 selectable integration methods and Bonjean curves; validated against Maxsurf (4,759 t displacement match)",
      "Implemented IMO IS Code 2008 intact stability, weather criterion, and SOLAS probabilistic damage (attained subdivision index)",
      "Codified IACS rule loads, hull-girder compliance, plate buckling, IRS Sec. 15.4–15.5 design motions, and DNV-GL fatigue (Palmgren-Miner + S-N curves)",
      "Delivered 13 GUI workspaces with side-by-side loading-condition comparison and branded multi-page PDF reports",
    ],
    technologies: ["Python", "NumPy", "SciPy", "geomdl", "PyQt5", "PyOpenGL", "ReportLab"],
    icon: "Waves",
  },
  {
    id: "vibration-diagnostics",
    title: "Vibration Diagnostics Rule Engine",
    category: "Condition Monitoring • Signal Processing",
    type: "rnd",
    description:
      "Transparent rule-based fault diagnostics for rotating machinery. Ranks probable mechanical, bearing, and electrical faults with traceable for/against evidence rather than opaque ML predictions.",
    metrics: [
      { value: "13", label: "Diagnostic rules" },
      { value: "30+", label: "Features extracted" },
      { value: "ISO 10816", label: "Severity standard" },
    ],
    highlights: [
      "Implemented 13 diagnostic rules covering unbalance, misalignment, looseness, BPFO/BPFI/BSF bearing defects, rotor bar / stator eccentricity, and spectrogram-based transient faults",
      "Extracted 30+ features per measurement: FFT, Hilbert envelope, crest factor, kurtosis, harmonic and sideband detection, STFT transients",
      "Computed bearing defect frequencies (BPFO, BPFI, BSF, FTF) from geometry; bundled 12 pre-loaded SKF bearing profiles",
      "Mapped overall vibration velocity to ISO 10816 severity zones with confidence/severity per diagnosis and traceable evidence chains",
      "Shipped a PyQt5 6-tab workflow plus a headless Python API for integration",
    ],
    technologies: ["Python", "NumPy", "SciPy", "PyQt5", "Signal Processing", "FFT"],
    icon: "Cog",
  },
  {
    id: "ship-recycling-expert-system",
    title: "Ship Recycling & Dismantling Expert System",
    category: "Maritime Compliance • Expert Systems",
    type: "rnd",
    description:
      "Multi-domain expert system that turns ship intake data into compliant, safe, economically viable recycling plans, combining hazmat tracking, structural cutting sequences, workflow DAG scheduling, and multi-framework regulatory checks.",
    metrics: [
      { value: "204", label: "Workflow activities" },
      { value: "4", label: "Compliance frameworks" },
      { value: "7", label: "Report types" },
    ],
    highlights: [
      "Intake wizard captures 40+ ship parameters; hazard identification combines declared IHM with age/type/equipment inference across 15 hazmat categories",
      "5-phase safe cutting sequence over a 4-tier component hierarchy (primary → secondary → tertiary → non-structural)",
      "Workflow orchestration selects 204 applicable activities, builds a DAG, runs Kahn's topological sort, and identifies the critical path",
      "Evaluates HKC, Basel Convention, EU SRR, and ILO Guidelines simultaneously; risk assessment over a 5×5 severity/probability matrix",
      "Generates 7 report types (SRP, Compliance, Hazmat, Safety, Environmental, Economic, Workflow) with PDF export and interactive dashboards",
    ],
    technologies: ["Python", "Django", "HTMX", "Tailwind", "Chart.js", "WeasyPrint", "SQLite"],
    icon: "LayoutDashboard",
  },
  {
    id: "moses-doe-pipeline",
    title: "MOSES Sea-Transport DOE Automation",
    category: "Marine Hydrodynamics • Design of Experiments",
    type: "rnd",
    description:
      "Parametric sea-transport and stability analysis platform that drives Bentley MOSES through 15,000 stratified DOE cases, then feeds outputs into ML surrogates, sensitivity analysis, and multi-objective optimization.",
    metrics: [
      { value: "15K", label: "DOE cases" },
      { value: "80", label: "Input parameters" },
      { value: "28", label: "Compartments" },
    ],
    highlights: [
      "Stratified Latin Hypercube Sampling over 4 ballast zones produces 15,000 DOE cases from 80 input parameters",
      "Automated MOSES workflow: template token replacement → model generation → physics simulation → multi-format output parsing",
      "Per-case 12-sheet Excel workbooks: 6-DOF motions/accelerations at flotation and motion points, longitudinal bending moment / shear force, intact and damage stability across 28 compartments",
      "Orchestrator supports CLI (case ranges, train/test split), PyQt5 GUI, and resume markers that skip completed cases",
      "ML/surrogate platform with PyTorch, XGBoost, LightGBM, SHAP; Sobol/Morris sensitivity (SALib); Optuna and PyMoo optimization",
    ],
    technologies: ["Python", "MOSES", "PyTorch", "XGBoost", "SHAP", "Optuna", "SALib", "PyMoo"],
    icon: "BarChart3",
  },
  // Academic
  {
    id: "cfd-aircraft",
    title: "CFD Aircraft Simulation (DLR F11)",
    category: "Aerospace • CFD",
    type: "academic",
    description:
      "Aerodynamic flow field simulation of DLR F11 commercial aircraft in landing configuration using ANSYS Fluent on Nvidia DGX-1 supercomputer.",
    metrics: [
      { value: "20M", label: "Mesh elements" },
      { value: "Re=1.35M", label: "Reynolds" },
      { value: "NASA", label: "Wind-tunnel validated" },
    ],
    highlights: [
      "20M-element Mosaic Poly-Hexcore mesh with k-ω SST turbulence model",
      "Simulated at Re=1.35M, Ma=0.175, V=60 m/s with slats (26.5°) and flaps (32°)",
      "Generated drag polar, Cl vs AoA, Cm vs Cl, and pressure profiles",
      "Results validated against NASA wind tunnel data from AIAA 2nd High Lift Prediction Workshop",
    ],
    technologies: ["ANSYS Fluent", "CFD", "Mosaic Mesh", "SolidWorks", "DGX-1"],
    icon: "Plane",
  },
  {
    id: "stock-modeling-em",
    title: "Stock Forecasting with Euler-Maruyama",
    category: "Financial Modeling • Numerical Analysis",
    type: "academic",
    description:
      "Simulated stock and option prices using Euler-Maruyama numerical method for stochastic differential equations with Black-Scholes option pricing.",
    highlights: [
      "Applied to Amazon stock data (Jan 2016 – Jan 2017) with Monte Carlo simulation",
      "European call option payoff estimation via EM-approximated SDE",
      "Comparative study: GBM vs Fractional GBM vs Euler-Maruyama convergence",
    ],
    technologies: ["Python", "Numerical Methods", "Black-Scholes", "Monte Carlo"],
    icon: "TrendingUp",
  },
  {
    id: "fgbm-stock",
    title: "Geometric Fractional Brownian Motion",
    category: "Stochastic Processes • Finance",
    type: "academic",
    description:
      "Stock-price simulation using GFBM with Hurst exponent for long-memory modeling. Demonstrated persistent vs anti-persistent behavior.",
    highlights: [
      "Cholesky decomposition for simulating Fractional Gaussian Noise",
      "Applied to Coal India stock with MAPE-based accuracy comparison",
      "Showed GFBM outperforms standard GBM for future price path simulation",
    ],
    technologies: ["Python", "GFBM", "Cholesky", "Statistical Modeling"],
    icon: "BarChart3",
  },
  {
    id: "quantum-neutrino",
    title: "Quantum Neutrino Oscillation Study",
    category: "Quantum Physics • Modeling",
    type: "academic",
    description:
      "Mathematical models for long baseline neutrino oscillation experiments with LG inequality analysis.",
    highlights: [
      "Derived oscillation parameters using Globes library",
      "Established correlations between LG inequalities and neutrino oscillations",
    ],
    technologies: ["C", "Globes Library", "Scientific Computing"],
    icon: "Atom",
  },
  {
    id: "movie-recommender",
    title: "Movie Recommender System",
    category: "Big Data • ML",
    type: "academic",
    description:
      "Scalable movie recommendation engine using item-based collaborative filtering on Hadoop MapReduce.",
    highlights: [
      "Led team of 5 building IBCF with MapReduce for parallel computation",
      "Achieved scalable recommendations across large movie datasets",
    ],
    technologies: ["Python", "Hadoop", "MapReduce", "IBCF"],
    icon: "Film",
  },
  {
    id: "wind-turbine",
    title: "Wind Turbine Power Prediction",
    category: "ML • Web Development",
    type: "academic",
    description:
      "Web application predicting wind turbine output power and energy using Random Forest with >92% R² accuracy.",
    metrics: [
      { value: ">92%", label: "R² accuracy" },
    ],
    highlights: [
      "Built Flask web app with interactive prediction interface",
      "Random Forest Regressor achieving >92% R² on energy output",
    ],
    technologies: ["Python", "Flask", "Random Forest", "ML"],
    icon: "Zap",
  },
];
