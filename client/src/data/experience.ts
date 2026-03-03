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
    title: "Software Engineer – LLM & ML Infrastructure",
    company: "Pangeon",
    period: "Mar 2024 – Present",
    location: "Contract",
    achievements: [
      "Developed and deployed high-throughput embedding pipelines integrated with LLM semantic scoring for automated prior-art ranking",
      "Support 1,000+ patent similarity evaluations daily, enabling scalable semantic comparison across large patent datasets",
      "Re-architected compute-intensive workloads from EC2 to AWS Lambda, reducing infrastructure costs by 30% and improving batch completion speed by 5–7x",
      "Built asynchronous processing and multiprocessing frameworks to increase similarity evaluation throughput",
      "Provisioned reproducible AWS infrastructure using Terraform to enable consistent cross-account deployments",
    ],
  },
  {
    id: "sas2py",
    title: "Data Engineer",
    company: "Sas2Py",
    period: "Mar 2023 – Jun 2023",
    location: "Full-Time",
    achievements: [
      "Led migration of legacy SAS data pipelines to PySpark, redesigning batch workflows for distributed execution and improved scalability",
      "Built automated validation framework ensuring >99% functional parity between SAS and PySpark outputs across production workloads",
      "Modeled job dependency graphs to eliminate scheduling bottlenecks and optimize distributed execution efficiency",
    ],
  },
  {
    id: "corteva",
    title: "Machine Learning Intern",
    company: "Corteva Agriscience",
    period: "Jul 2022 – Dec 2022",
    location: "Internship",
    achievements: [
      "Converted TensorFlow and PyTorch models to ONNX for cross-platform deployment compatibility",
      "Optimized inference performance using structured pruning and post-training quantization",
      "Validated numerical consistency across model formats to ensure reliable production deployment",
    ],
  },
  {
    id: "dojima",
    title: "Software Engineer Intern",
    company: "Dojima Networks",
    period: "Jun 2022 – Dec 2022",
    location: "Internship",
    achievements: [
      "Integrated Polkadot ecosystem components to enable cross-chain interoperability within Dojima's blockchain infrastructure",
      "Implemented cross-chain communication workflows for transaction routing and state synchronization",
      "Deployed Prometheus–Grafana monitoring stack to provide real-time API observability and system health tracking",
    ],
  },
];

export interface ConsultingProject {
  id: string;
  title: string;
  achievements: string[];
}

export interface ConsultingRole {
  title: string;
  company: string;
  period: string;
  location: string;
  projects: ConsultingProject[];
}

export const consultingRole: ConsultingRole = {
  title: "AI Systems Engineer",
  company: "Independent Consulting & R&D",
  period: "Jun 2023 – Present",
  location: "Contract",
  projects: [
    {
      id: "digital-twin",
      title: "Digital Twin Systems – Offshore Riser Modeling",
      achievements: [
        "Developed surrogate ML models trained on 88,560 simulated sea states for offshore motion and fatigue prediction",
        "Executed 3,525 ML/DL experiments and ~1.08M model fits to identify optimal architecture and feature configurations",
        "Processed 3,888 time-series simulation files (4 Hz sampling) to construct structured environmental prediction pipelines",
        "Reduced worst-case angular prediction error by 41% through structured feature optimization and circular regression modeling",
        "Established reproducible training and inference workflows with strict dataset partition control to eliminate leakage",
      ],
    },
    {
      id: "simulation-automation",
      title: "Engineering Simulation Automation",
      achievements: [
        "Built ANSYS APDL and MOSES batch execution pipelines to automate large-scale simulation data generation",
        "Orchestrated structured extraction and transformation of simulation outputs into ML-ready datasets",
        "Standardized execution workflows to improve experiment repeatability and reduce manual intervention",
      ],
    },
    {
      id: "anomaly-detection",
      title: "Anomaly Detection & Signal Processing",
      achievements: [
        "Developed unsupervised vibration-based fault detection pipeline using 16+ time-domain and 11 frequency-domain features",
        "Processed multi-day sensor time-series datasets to construct structured feature matrices for anomaly modeling",
        "Applied PCA-based dimensionality reduction to enhance cluster separability prior to classification",
        "Implemented clustering-based anomaly detection trained on normal operating data, achieving zero false positives during baseline validation",
        "Quantified anomaly robustness using cluster compactness metrics (WCSS: 441.78) and distance thresholds",
      ],
    },
    {
      id: "retrieval-cv",
      title: "Retrieval & Computer Vision Systems",
      achievements: [
        "Architected multi-stage similarity pipeline across 100,000+ unique cattle images",
        "Indexed 100K+ embeddings using FAISS multi-index vector structures and ranking fusion strategies",
        "Distributed feature computation across 20 worker processes to support high-volume similarity evaluation",
      ],
    },
    {
      id: "rag",
      title: "Retrieval-Augmented Generation (RAG)",
      achievements: [
        "Implemented retrieval-augmented generation pipelines over multi-year internal technical report corpora",
        "Designed embedding ingestion workflows including chunking, metadata filtering, and indexing strategies",
        "Integrated FAISS-based similarity search into FastAPI backend services",
        "Reduced transcription latency by 75% and synthesis time by 52% through backend optimization",
      ],
    },
  ],
};

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
