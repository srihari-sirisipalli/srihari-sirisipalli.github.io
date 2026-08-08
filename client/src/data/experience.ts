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
    company: "Pangeon (startup studio)",
    period: "Mar 2024 – Present",
    location: "Part-time · Remote",
    achievements: [
      "LLM-based patent similarity and prior-art system at production scale for Intellipat, one of Pangeon's portfolio startups",
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
  title: "Lead Engineer & AI Systems Engineer",
  company: "Independent Systems Engineering",
  period: "Jun 2023 – Present",
  location: "Freelance · Remote",
  projects: [
    {
      id: "marine-offshore-naval",
      title: "Marine, Offshore & Naval Engineering",
      achievements: [
        "Leading engineering teams on ship, offshore, and naval design projects",
        "Ship and boat design across hydrostatics, stability, seakeeping, and damage",
        "Offshore structures: platforms, jack-ups, risers, mooring, and gangways",
        "Planning craft, service boats, and small-craft hull and structural design",
        "Class and regulatory work against IMO IS Code, SOLAS, IACS, and DNV-GL",
        "Structural, modal, fatigue, and vibration analysis on primary structure",
      ],
    },
    {
      id: "auv-underwater",
      title: "AUV & Underwater Systems",
      achievements: [
        "Currently leading an engineering team on Autonomous Underwater Vehicle design and development",
        "Underwater vehicle propulsion reliability research (AI, DOE, ML surrogates)",
        "Marine, offshore, and subsea engineering deliverables end-to-end",
      ],
    },
    {
      id: "simulations",
      title: "Simulations",
      achievements: [
        "CFD (ANSYS Fluent, k-omega SST)",
        "FEA (ANSYS APDL, custom Python engine)",
        "Hydrodynamics (Bentley MOSES, panel methods, wave modelling)",
        "Physics-informed and ML surrogates over expensive physics runs",
      ],
    },
    {
      id: "digital-twins",
      title: "Digital Twins",
      achievements: [
        "Offshore riser fatigue and motion digital twin",
        "Mooring digital twin",
        "Battery digital twin",
        "Ship emergency-response digital twin",
      ],
    },
    {
      id: "ai-genai",
      title: "AI, ML & GenAI",
      achievements: [
        "RAG systems, embeddings, and semantic retrieval",
        "Real-time offline 3D AI avatar (deployed)",
        "DocForge: offline document intelligence with local VLMs",
        "Deep learning across sequence, vision, and structured problems",
        "Compliance and regulatory expert systems",
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
      id: "apps-platforms",
      title: "Apps, Websites & Platforms",
      achievements: [
        "Flutter apps end-to-end (Fractional CTO at Openct)",
        "Full-stack web platforms in production (zapstays.in)",
        "VHop nightlife platform (in build)",
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
      "Designed STT fine-tuning pipeline: audio collection, transcription, diarisation, dataset prep",
      "Fine-tuned models with agriculture-specific vocabulary for farmer query accuracy",
    ],
  },
];
