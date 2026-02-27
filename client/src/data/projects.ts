export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  type: "professional" | "rnd" | "academic";
  company?: string;
  period?: string;
  description: string;
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
      "LLM-powered patent analysis platform for prior art detection, novelty assessment, and infringement analysis with vector search retrieval.",
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
    company: "VVS Systems",
    period: "2025 – 2026",
    description:
      "Automated ML pipeline infrastructure for offshore riser behavior modeling — fatigue prediction, wave height estimation, and circular wave heading prediction.",
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
    id: "cattle-biometrics",
    title: "Cattle Biometric R&D Platform (Goodhar)",
    category: "Computer Vision • Biometrics",
    type: "rnd",
    period: "Nov 2024 – Feb 2025",
    description:
      "Complete R&D application for cattle biometric identification — 16-stage modular pipeline with production ROI extraction, multi-view vector search, and deep feature analysis.",
    highlights: [
      "Built production ROI extractor using rembg (DL segmentation) with OpenCV GrabCut fallback",
      "CLAHE contrast enhancement in LAB color space + morphological mask cleaning + quality scoring (0-100)",
      "Multi-view FAISS vector DB with 6 fusion strategies: intersection, weighted voting, rank aggregation, cascade, union, dynamic adaptive",
      "Deep feature extraction: ResNet, EfficientNet, ViT, ArcFace, DINO, SimCLR, MAE, MoCo, BYOL",
      "40+ quality metrics across 7 categories (sharpness, exposure, noise, texture, color, muzzle-specific, technical)",
      "Parallel processing (ProcessPoolExecutor, 20 workers) with Excel audit sheets and debug visualization",
    ],
    technologies: ["Python", "FAISS", "PyTorch", "rembg", "OpenCV", "ArcFace", "YOLO"],
    icon: "Fingerprint",
  },
  {
    id: "ai-avatar",
    title: "Real-Time 3D AI Avatar System",
    category: "AI/ML • Real-time Systems",
    type: "rnd",
    description:
      "Offline-capable 3D AI avatar for defense applications with real-time speech-to-text, LLM reasoning, RAG knowledge retrieval, and TTS lip-sync.",
    highlights: [
      "Built offline stack: Whisper STT → Ollama LLM → LangChain RAG → Silero TTS → 3D lip-sync",
      "Reduced STT latency by 75% and TTS latency by 52%",
      "Designed RAG Control Gate mechanism ensuring accurate knowledge base retrieval",
      "Deployed low-latency architecture: FastAPI + React + Three.js",
    ],
    technologies: ["Python", "FastAPI", "React", "Three.js", "Whisper", "LangChain", "Ollama"],
    icon: "Bot",
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance – Naval Systems",
    category: "Predictive Analytics • Defense",
    type: "rnd",
    description:
      "Anomaly detection system for naval equipment health monitoring using accelerometer data and machine learning.",
    highlights: [
      "Built feature extraction pipelines: RMS, FFT, kurtosis, spectral features",
      "Trained and evaluated RF, SVM, k-NN, and DL models with cross-validation + expert-in-the-loop",
      "Enabled early fault detection, reducing equipment downtime",
      "Findings presented at defense R&D conference",
    ],
    technologies: ["Python", "Random Forest", "SVM", "Signal Processing", "FFT"],
    icon: "Cog",
  },
  // Academic
  {
    id: "cfd-aircraft",
    title: "CFD Aircraft Simulation (DLR F11)",
    category: "Aerospace • CFD",
    type: "academic",
    description:
      "Aerodynamic flow field simulation of DLR F11 commercial aircraft in landing configuration using ANSYS Fluent on Nvidia DGX-1 supercomputer.",
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
    highlights: [
      "Built Flask web app with interactive prediction interface",
      "Random Forest Regressor achieving >92% R² on energy output",
    ],
    technologies: ["Python", "Flask", "Random Forest", "ML"],
    icon: "Zap",
  },
];
