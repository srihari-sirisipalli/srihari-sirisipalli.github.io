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
    id: "openct",
    title: "Fractional CTO",
    company: "Openct",
    period: "Feb 2026 – Present",
    location: "Self-employed · Remote",
    achievements: [
      "Embedded as fractional CTO leading product audit, new feature development, complete website redesign, backend architecture rebuild, and mobile app rebuild",
      "Complete redesign of the openct.co website with new design system, information architecture, and content flow",
      "Rebuilding the Openct Flutter mobile app end-to-end with new architecture, state management, and design system",
      "New backend architecture from scratch on DigitalOcean, Redis, and PostgreSQL with third-party integrations across payments, communication, and analytics",
      "Owning architecture decisions, technical roadmap, hiring input, and product-engineering delivery cadence",
    ],
  },
  {
    id: "pangeon",
    title: "Software Engineer, LLM & Cloud Infrastructure",
    company: "Pangeon",
    period: "Mar 2024 – Present",
    location: "Part-time · Remote",
    achievements: [
      "Patent similarity and prior-art LLM system at production scale",
      "Embedding-driven retrieval integrated with LLM semantic scoring",
      "Re-architected compute workloads from EC2 to AWS Lambda",
      "Reproducible AWS provisioning with Terraform across accounts",
      "Async and multiprocessing framework for high-throughput evaluation",
      "Custom Terraform GUI for AWS resource management",
    ],
  },
  {
    id: "sas2py",
    title: "Data Engineer",
    company: "Sas2Py",
    period: "Mar 2023 – Jun 2023",
    location: "Full-Time",
    achievements: [
      "Led migration of legacy SAS data pipelines to PySpark, redesigning batch workflows for distributed execution",
      "Built automated validation framework ensuring functional parity between SAS and PySpark outputs",
      "Modeled job dependency graphs to eliminate scheduling bottlenecks",
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
      "Integrated Polkadot ecosystem components to enable cross-chain interoperability",
      "Implemented cross-chain communication workflows for transaction routing and state synchronization",
      "Deployed Prometheus and Grafana monitoring stack for real-time API observability",
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
  company: "Independent Systems Engineering",
  period: "Jun 2023 – Present",
  location: "Freelance · Remote",
  projects: [
    {
      id: "core-engineering",
      title: "Core Engineering",
      achievements: [
        "CFD (ANSYS Fluent, k-omega SST)",
        "FEA (ANSYS APDL, custom Python engine)",
        "Hydrodynamics (Bentley MOSES, panel methods, wave modeling)",
        "Naval architecture (IMO IS Code, SOLAS, IACS, DNV-GL)",
        "CAD/CAE automation (FreeCAD, ANSYS APDL)",
        "Structural, modal, fatigue, and seakeeping analysis",
      ],
    },
    {
      id: "digital-twins",
      title: "Digital Twins & Simulation",
      achievements: [
        "Offshore riser fatigue and motion digital twin",
        "Mooring digital twin",
        "Battery digital twin",
        "Ship emergency-response digital twin",
        "MOSES sea-transport DOE automation platform",
        "NavalArch Studio, ship design and stability suite",
        "PyNAOS, pure-Python FEA engine for offshore structures",
      ],
    },
    {
      id: "auv-underwater",
      title: "AUV & Underwater Systems",
      achievements: [
        "Led engineering team on autonomous underwater vehicle (AUV) design and development",
        "Underwater vehicle propulsion structural reliability analysis",
        "Marine, offshore, and subsea engineering deliverables",
      ],
    },
    {
      id: "ai-genai",
      title: "AI & GenAI",
      achievements: [
        "RAG systems, embeddings, and semantic retrieval",
        "Real-time offline 3D AI avatar (deployed)",
        "Offline conversational AI with real-time speech (Whisper, Ollama)",
        "Offline document intelligence",
        "Compliance and regulatory expert systems (Ship Recycling Expert System)",
      ],
    },
    {
      id: "computer-vision",
      title: "Computer Vision",
      achievements: [
        "Multi-view biometric retrieval at scale (100K+ images, FAISS multi-index)",
        "Distributed image-processing pipelines",
      ],
    },
    {
      id: "ml-r-and-d",
      title: "ML for Engineering R&D",
      achievements: [
        "Multi-input DC-DC converter surrogate and inverse design (physics-informed)",
        "Vibration diagnostics rule engine (ISO 10816)",
        "Reliability Analysis Workbench for underwater vehicle propulsion",
      ],
    },
    {
      id: "apps-platforms",
      title: "Apps & Platforms",
      achievements: [
        "Full-stack web platforms in production (zapstays.in, live)",
        "Architecture: FastAPI, Django, React, WebSockets",
      ],
    },
    {
      id: "backend-cloud",
      title: "Backend & Cloud",
      achievements: [
        "AWS, DigitalOcean, Redis, PostgreSQL",
        "Terraform, Docker, CI/CD",
        "Async and multiprocessing pipelines for high-throughput workloads",
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
      "Evaluated bilingual answering (English and Telugu) for Andhra agriculture use cases",
      "Designed STT fine-tuning pipeline: audio collection, transcription, diarization, dataset prep",
      "Fine-tuned models with agriculture-specific vocabulary for farmer query accuracy",
    ],
  },
];
