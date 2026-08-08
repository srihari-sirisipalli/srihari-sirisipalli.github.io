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
      "Embedded product-side, leading product audit, feature strategy, delivery cadence, and technical direction",
      "Complete redesign of openct.co with new design system, information architecture, and content flow",
      "Rebuilding the Openct Flutter mobile app end-to-end with new architecture, state management, and design system",
      "New backend from scratch on DigitalOcean, Redis, and PostgreSQL, with third-party integrations across payments, communication, and analytics",
      "Owning architecture decisions, technical roadmap, hiring input, and product-engineering delivery",
    ],
  },
  {
    id: "pangeon",
    title: "Software Engineer, LLM & Cloud Infrastructure",
    company: "Pangeon",
    period: "Mar 2024 – Present",
    location: "Part-time · Remote",
    achievements: [
      "LLM-based patent similarity and prior-art system at production scale",
      "Embedding retrieval integrated with LLM semantic scoring for automated prior-art ranking",
      "Re-architected compute workloads from EC2 to AWS Lambda for cost and speed",
      "Reproducible AWS provisioning with Terraform across client accounts",
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
      "Led migration of legacy SAS pipelines to PySpark, redesigning batch workflows for distributed execution",
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
      "Converted TensorFlow and PyTorch models to ONNX for cross-platform deployment",
      "Optimised inference with structured pruning and post-training quantisation",
      "Validated numerical consistency across model formats for reliable production deployment",
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
      "Implemented cross-chain communication workflows for transaction routing and state synchronisation",
      "Deployed a Prometheus and Grafana monitoring stack for real-time API observability",
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
      id: "industry-software",
      title: "Industry Software",
      achievements: [
        "PyNAOS, pure-Python FEA engine for offshore structures",
        "NavalArch Studio, ship design and stability suite",
        "Ship Recycling Expert System (Django, HTMX, WeasyPrint)",
        "Vibration Diagnostics Rule Engine (ISO 10816, PyQt5)",
      ],
    },
    {
      id: "ai-genai",
      title: "AI & GenAI",
      achievements: [
        "RAG systems, embeddings, and semantic retrieval",
        "Real-time offline 3D AI avatar (deployed)",
        "DocForge: offline document intelligence with local VLMs",
        "Compliance and regulatory expert systems",
      ],
    },
    {
      id: "automation",
      title: "Automation",
      achievements: [
        "MOSES sea-transport DOE automation platform",
        "CAD and CAE automation across ANSYS APDL, FreeCAD, and MOSES",
        "Data pipelines, ETL, and workflow automation",
        "CI/CD, deployment automation, and observability",
      ],
    },
    {
      id: "apps-platforms",
      title: "Apps & Platforms",
      achievements: [
        "Flutter apps end-to-end (Fractional CTO at Openct)",
        "Full-stack web platforms in production (zapstays.in)",
        "VHop nightlife platform (in build)",
        "Architecture: FastAPI, Django, React, WebSockets",
      ],
    },
    {
      id: "computer-vision",
      title: "Computer Vision",
      achievements: [
        "Multi-view biometric retrieval at scale (100K+ images, FAISS)",
        "Live cattle detection and tracking (YOLO, BoT-SORT)",
        "Computer Vision for SCCL Mining Operations (11 detection features, Dash NOC)",
        "Distributed image-processing pipelines",
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
      ],
    },
    {
      id: "auv-underwater",
      title: "AUV & Underwater",
      achievements: [
        "Currently leading an engineering team on Autonomous Underwater Vehicle design and development",
        "Underwater vehicle propulsion reliability research (AI, DOE, ML surrogates)",
        "Marine, offshore, and subsea engineering deliverables",
      ],
    },
    {
      id: "core-engineering",
      title: "Core Engineering",
      achievements: [
        "CFD (ANSYS Fluent, k-omega SST)",
        "FEA (ANSYS APDL, custom Python engine)",
        "Hydrodynamics (Bentley MOSES, panel methods, wave modelling)",
        "Naval architecture (IMO IS Code, SOLAS, IACS, DNV-GL)",
        "Structural, modal, fatigue, and seakeeping analysis",
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
      "Designed STT fine-tuning pipeline: audio collection, transcription, diarisation, dataset prep",
      "Fine-tuned models with agriculture-specific vocabulary for farmer query accuracy",
    ],
  },
];
