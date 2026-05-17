export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: { name: string; level: number }[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "ai-ml-systems",
    title: "AI / ML Systems",
    icon: "Brain",
    skills: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 85 },
      { name: "Scikit-learn", level: 95 },
      { name: "XGBoost / LightGBM", level: 90 },
      { name: "Surrogate Modeling", level: 90 },
      { name: "Physics-Informed NNs", level: 80 },
      { name: "OOD Detection", level: 80 },
      { name: "SHAP / Feature Attribution", level: 80 },
      { name: "Computer Vision", level: 85 },
      { name: "NLP", level: 80 },
      { name: "Feature Engineering", level: 90 },
      { name: "Model Optimization", level: 85 },
    ],
  },
  {
    id: "llm-retrieval",
    title: "LLM & Retrieval",
    icon: "MessageSquare",
    skills: [
      { name: "LangChain", level: 90 },
      { name: "RAG Pipelines", level: 90 },
      { name: "FAISS", level: 90 },
      { name: "Vector Databases", level: 90 },
      { name: "Embedding Models", level: 85 },
      { name: "Ollama", level: 85 },
      { name: "Whisper STT", level: 85 },
      { name: "Prompt Engineering", level: 85 },
    ],
  },
  {
    id: "hydrodynamics",
    title: "Hydrodynamics & Marine Engineering",
    icon: "Waves",
    skills: [
      { name: "Bentley MOSES", level: 90 },
      { name: "Naval Architecture", level: 85 },
      { name: "Hydrostatics & Stability", level: 85 },
      { name: "IMO IS Code / SOLAS", level: 80 },
      { name: "Wave Modeling (Airy, Stokes, JONSWAP)", level: 85 },
      { name: "Morison & Diffraction", level: 80 },
      { name: "Seakeeping & RAOs", level: 80 },
      { name: "IACS / DNV-GL Classification", level: 75 },
    ],
  },
  {
    id: "fea-numerics",
    title: "FEA & Numerical Methods",
    icon: "Cog",
    skills: [
      { name: "Skyline LDLᵀ Solver", level: 90 },
      { name: "Lanczos Eigenvalues", level: 85 },
      { name: "Timoshenko Beam Elements", level: 90 },
      { name: "P-Δ / Non-linear Static", level: 85 },
      { name: "API RP 2A p-y / t-z", level: 80 },
      { name: "DOE / Latin Hypercube", level: 95 },
      { name: "Sobol & Morris (SALib)", level: 85 },
      { name: "Optuna / PyMoo (Optimization)", level: 85 },
    ],
  },
  {
    id: "cfd-design",
    title: "CFD & Design",
    icon: "Plane",
    skills: [
      { name: "ANSYS Fluent", level: 80 },
      { name: "ANSYS APDL", level: 75 },
      { name: "CFD (Re, Ma, Turbulence)", level: 80 },
      { name: "k-ω SST Modeling", level: 75 },
      { name: "Mosaic Poly-Hexcore Meshing", level: 75 },
      { name: "SolidWorks", level: 75 },
      { name: "FreeCAD", level: 70 },
    ],
  },
  {
    id: "cloud-infra",
    title: "Cloud & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "AWS (EC2, Lambda, SQS, S3)", level: 90 },
      { name: "Terraform", level: 90 },
      { name: "Docker", level: 85 },
      { name: "Kubernetes", level: 75 },
      { name: "CI/CD Pipelines", level: 85 },
      { name: "AWS Amplify", level: 80 },
      { name: "IAM & Security", level: 80 },
      { name: "Cost Optimization", level: 85 },
    ],
  },
  {
    id: "data-eng",
    title: "Data Engineering",
    icon: "Database",
    skills: [
      { name: "PySpark", level: 85 },
      { name: "Hadoop / MapReduce", level: 75 },
      { name: "ETL Pipelines", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "ONNX", level: 80 },
      { name: "Prometheus & Grafana", level: 75 },
      { name: "Data Validation", level: 85 },
      { name: "Graph Theory (Deps)", level: 75 },
    ],
  },
  {
    id: "programming-tooling",
    title: "Programming & Tooling",
    icon: "Code",
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript / TypeScript", level: 80 },
      { name: "SQL", level: 85 },
      { name: "Java", level: 70 },
      { name: "Go", level: 65 },
      { name: "C", level: 70 },
      { name: "Bash / Shell", level: 80 },
      { name: "MATLAB", level: 70 },
      { name: "FastAPI", level: 90 },
      { name: "React", level: 80 },
      { name: "Flask", level: 80 },
      { name: "Three.js", level: 70 },
      { name: "OpenCV", level: 85 },
      { name: "rembg", level: 85 },
      { name: "Git", level: 90 },
      { name: "Linux", level: 85 },
    ],
  },
];

export interface ExpertiseArea {
  title: string;
  description: string;
  icon: string;
}

export const expertiseAreas: ExpertiseArea[] = [
  {
    title: "Surrogate Modeling & Inverse Design",
    description:
      "ML surrogates that replace slow analytical / numerical solvers. Inverse design via differential evolution. Multi-layer OOD detection so surrogates refuse to answer where they shouldn't.",
    icon: "Sparkles",
  },
  {
    title: "Engineering Simulation Automation",
    description:
      "Driving ANSYS APDL and Bentley MOSES through thousands of parametric cases. Stratified Latin Hypercube DOE, resumable orchestration, defensive output parsing.",
    icon: "Cog",
  },
  {
    title: "Hydrodynamics & Naval Architecture",
    description:
      "Wave kinematics (Airy, Stokes, Chakrabarti, JONSWAP), Morison forces, hydrostatics and stability against IMO IS Code 2008 and SOLAS, IACS rule loads, DNV-GL fatigue.",
    icon: "Waves",
  },
  {
    title: "Generative AI & Retrieval",
    description:
      "Production LLM apps with RAG, multi-model architectures, FAISS-based similarity search at scale, prompt engineering, and offline-capable model stacks.",
    icon: "MessageSquare",
  },
  {
    title: "ML Pipeline Infrastructure",
    description:
      "Automated retrain-to-predict pipelines that evaluate models across varying conditions. ~1.08M model fits across 3,525 experiments with leakage-controlled splits.",
    icon: "GitBranch",
  },
  {
    title: "Cloud Architecture & DevOps",
    description:
      "End-to-end AWS infrastructure with Terraform IaC, autoscaling, GPU Lambda, cost optimisation (>30% reduction), and monitoring across cross-account deploys.",
    icon: "Cloud",
  },
  {
    title: "Predictive Diagnostics",
    description:
      "Signal-driven anomaly detection. Rule-based fault diagnostics for rotating machinery with ISO 10816 severity mapping. Vibration features, bearing-defect frequencies, transient detection.",
    icon: "TrendingUp",
  },
  {
    title: "Computer Vision & Biometrics",
    description:
      "Multi-view feature extraction (ResNet, EfficientNet, ViT, ArcFace, DINO), deep-learning segmentation, vector similarity search with fusion strategies, image quality scoring.",
    icon: "Eye",
  },
];
