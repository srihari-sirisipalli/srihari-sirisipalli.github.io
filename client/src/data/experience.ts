export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export const workExperience: ExperienceEntry[] = [
  {
    id: "pangeon",
    title: "Software Engineer – GenAI & Cloud Infrastructure",
    company: "Pangeon",
    period: "Mar 2024 – Present",
    location: "Remote",
    achievements: [
      "Built patent similarity system using LLMs for prior art detection, novelty assessment, and infringement analysis",
      "Designed dynamic AWS architecture with EC2 autoscaling, reducing infrastructure costs by >30%",
      "Migrated workloads to GPU-enabled Lambda, reducing EC2 dependency",
      "Delivered end-to-end AWS infrastructure with Terraform (Amplify, IAM, monitoring, security)",
      "Built custom Terraform GUI for simplified AWS resource management",
    ],
  },
  {
    id: "vvs",
    title: "AI Systems Engineer – Offshore Digital Twin Systems",
    company: "VVS Systems",
    period: "Jun 2025 – Feb 2026",
    location: "Contract",
    achievements: [
      "Engineered automated ML pipeline evaluating models across varying conditions, parameters, and architectures",
      "Built 156-feature engineering pipeline with intelligent angle encoding, normality-based transforms, and adaptive scaling",
      "Designed hierarchical classification-regression architecture for circular wave heading prediction",
      "Built retrain-to-predict infrastructure automating the full experiment-to-production cycle",
    ],
  },
  {
    id: "sas2py",
    title: "Data Engineer",
    company: "Sas2Py",
    period: "Mar 2023 – Jun 2023",
    location: "Hyderabad",
    achievements: [
      "Migrated SAS → PySpark pipelines, improving scalability & performance",
      "Built automated validation scripts with HTML reports, ensuring >99% migration accuracy",
      "Applied graph theory to map dependencies, uncovering pipeline bottlenecks",
    ],
  },
  {
    id: "corteva",
    title: "Machine Learning Intern",
    company: "Corteva Agriscience",
    period: "Jul 2022 – Dec 2022",
    location: "Hyderabad",
    achievements: [
      "Converted models across TensorFlow/PyTorch → ONNX for cross-platform deployment",
      "Optimized computer vision models via compression, quantization, and pruning",
    ],
  },
  {
    id: "dojima",
    title: "Software Engineer Intern",
    company: "Dojima Networks",
    period: "Jun 2022 – Dec 2022",
    location: "Remote",
    achievements: [
      "Integrated Polkadot ecosystem with Dojima blockchain for cross-chain interoperability",
      "Built Prometheus–Grafana dashboards for real-time API monitoring",
    ],
  },
];

export interface RnDEntry {
  id: string;
  title: string;
  description: string;
  achievements: string[];
}

export const rndExperience: RnDEntry[] = [
  {
    id: "cattle-biometrics",
    title: "Cattle Biometric R&D Platform (Goodhar)",
    description:
      "Complete R&D platform for cattle biometric identification — Nov 2024 to Feb 2025",
    achievements: [
      "Built complete R&D application: 16-stage modular pipeline from image input → preprocessing → feature extraction → FAISS indexing → retrieval → evaluation",
      "Developed production ROI extractor using rembg (deep learning segmentation) with OpenCV GrabCut fallback, CLAHE contrast enhancement in LAB color space, and mask quality scoring",
      "Engineered multi-view vector database system with separate FAISS indices per feature type and 6 fusion strategies (intersection, weighted voting, rank aggregation, cascade, union, dynamic adaptive)",
      "Implemented deep feature extraction pipeline: ResNet, EfficientNet, ViT, ArcFace, and self-supervised models (DINO, SimCLR, MAE, MoCo, BYOL)",
      "Designed 40+ image quality metrics across 7 categories (sharpness, exposure, noise, texture, color, muzzle-specific, technical) with configurable thresholds",
      "Built parallel processing with ProcessPoolExecutor (up to 20 workers), Excel audit sheet generation, and debug visualization mode",
    ],
  },
  {
    id: "ai-avatar",
    title: "Real-Time AI Avatar System",
    description:
      "Offline-capable 3D AI avatar for defense applications",
    achievements: [
      "Built offline 3D avatar with Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS lip-sync",
      "Reduced STT latency by 75% and TTS latency by 52%",
      "Deployed low-latency stack: FastAPI + React + Three.js",
      "Designed RAG Control Gate ensuring accurate knowledge base retrieval",
    ],
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance – Naval Systems",
    description:
      "Anomaly detection for naval equipment health monitoring",
    achievements: [
      "Built anomaly detection pipelines from accelerometer data (RMS, FFT, kurtosis features)",
      "Trained Random Forest, SVM, k-NN, and DL models with cross-validation",
      "Enabled early fault detection, reducing downtime",
      "Findings presented at defense R&D conference",
    ],
  },
  {
    id: "offshore-riser",
    title: "Offshore Riser Behavior Modeling",
    description:
      "AI-driven fatigue prediction for offshore structures",
    achievements: [
      "Engineered automated ML pipeline across 8 algorithms and 156 features",
      "Built hierarchical quadrant cascade reducing max heading error to 12.5°",
      "Achieved R² = 0.9992 on significant wave height prediction",
      "Automated MOSES marine simulation parametric studies via Python",
    ],
  },
];

export interface AdvisoryEntry {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

export const advisoryExperience: AdvisoryEntry[] = [
  {
    id: "agritech-advisor",
    title: "AI/ML Advisor",
    company: "Agritech Startup",
    period: "Mar 2025 – Aug 2025",
    location: "Remote",
    achievements: [
      "Benchmarked commercial (OpenAI, Anthropic) and open-source LLMs (LLaMA, Mistral) for agriculture QA",
      "Evaluated bilingual answering (English & Telugu) for Andhra agriculture use cases",
      "Designed STT fine-tuning pipeline: audio collection → transcription → diarization → dataset prep",
      "Fine-tuned models with agriculture-specific vocabulary for farmer query accuracy",
    ],
  },
];
