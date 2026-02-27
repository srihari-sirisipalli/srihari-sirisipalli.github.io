export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: { name: string; level: number }[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "ml-ai",
    title: "ML & AI",
    icon: "Brain",
    skills: [
      { name: "PyTorch", level: 90 },
      { name: "TensorFlow", level: 85 },
      { name: "Scikit-learn", level: 95 },
      { name: "Computer Vision", level: 85 },
      { name: "NLP", level: 80 },
      { name: "Signal Processing", level: 80 },
      { name: "Feature Engineering", level: 90 },
      { name: "Model Optimization", level: 85 },
    ],
  },
  {
    id: "llm-retrieval",
    title: "LLM & Retrieval Systems",
    icon: "MessageSquare",
    skills: [
      { name: "LangChain", level: 90 },
      { name: "RAG Pipelines", level: 90 },
      { name: "FAISS", level: 90 },
      { name: "Ollama", level: 85 },
      { name: "Whisper STT", level: 85 },
      { name: "Prompt Engineering", level: 85 },
      { name: "Vector Databases", level: 90 },
      { name: "Embedding Models", level: 85 },
    ],
  },
  {
    id: "cloud-infra",
    title: "Cloud & Infrastructure",
    icon: "Cloud",
    skills: [
      { name: "AWS (EC2, Lambda, S3)", level: 90 },
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
    id: "programming",
    title: "Programming Languages",
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
    ],
  },
  {
    id: "frameworks",
    title: "Frameworks & Tools",
    icon: "Wrench",
    skills: [
      { name: "FastAPI", level: 90 },
      { name: "React", level: 80 },
      { name: "Flask", level: 80 },
      { name: "Three.js", level: 70 },
      { name: "OpenCV", level: 85 },
      { name: "Git", level: 90 },
      { name: "Linux", level: 85 },
      { name: "rembg", level: 85 },
    ],
  },
  {
    id: "simulation",
    title: "Engineering & Simulation",
    icon: "Cpu",
    skills: [
      { name: "ANSYS APDL / Fluent", level: 80 },
      { name: "MOSES (Marine)", level: 85 },
      { name: "FreeCAD", level: 70 },
      { name: "CFD", level: 75 },
      { name: "SolidWorks", level: 70 },
      { name: "Parametric Studies", level: 85 },
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
    title: "Generative AI & LLMs",
    description: "Building production LLM applications with RAG, prompt engineering, and multi-model architectures. Experience with OpenAI, Anthropic, LLaMA, Mistral, and Ollama.",
    icon: "Sparkles",
  },
  {
    title: "ML Pipeline Infrastructure",
    description: "Designing automated experimentation pipelines that evaluate models across varying conditions, parameters, and architectures with retrain-to-predict workflows.",
    icon: "GitBranch",
  },
  {
    title: "Cloud Architecture & DevOps",
    description: "End-to-end AWS infrastructure with Terraform IaC, autoscaling, GPU Lambda, cost optimization (>30% reduction), and monitoring.",
    icon: "Cloud",
  },
  {
    title: "Computer Vision & Biometrics",
    description: "Multi-view feature extraction, deep learning segmentation (rembg, SAM, YOLO), vector similarity search with FAISS, and image quality analysis.",
    icon: "Eye",
  },
  {
    title: "Real-time AI Systems",
    description: "Offline AI avatars with STT/TTS/LLM integration, achieving 75% STT and 52% TTS latency reduction. Low-latency FastAPI + WebSocket stacks.",
    icon: "Zap",
  },
  {
    title: "Predictive Analytics",
    description: "Anomaly detection from sensor data, fatigue life prediction for offshore structures, and time-series analysis with feature engineering (RMS, FFT, kurtosis).",
    icon: "TrendingUp",
  },
  {
    title: "Natural Language Processing",
    description: "Patent similarity systems, bilingual QA evaluation (English/Telugu), STT fine-tuning pipelines, and domain-specific LLM benchmarking.",
    icon: "MessageSquare",
  },
  {
    title: "Data Engineering",
    description: "SAS-to-PySpark migration, ETL pipeline automation, graph-theory dependency mapping, and large-scale data validation frameworks.",
    icon: "Database",
  },
];
