export interface ProjectLink {
  label: string;
  url: string;
}

export type ProjectType = "work" | "research";

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  type: ProjectType;
  tags: string[];
  description: string;
  image: string;
  href?: string;
  links?: ProjectLink[];
}

export const portfolio: PortfolioProject[] = [
  {
    id: "openct-rebuild",
    title: "Openct Product & Platform Rebuild",
    category: "Fractional CTO",
    type: "work",
    tags: ["Flutter", "DigitalOcean", "Redis", "Product"],
    description:
      "End-to-end technical rebuild of Openct: complete website redesign, Flutter mobile rebuild, new backend on DigitalOcean and Redis, and shipped features across web and mobile.",
    image: "/work/openct.svg",
    links: [
      { label: "Website", url: "https://openct.co" },
      { label: "Play Store", url: "https://play.google.com/store/apps/details?id=com.open.ct.openct&hl=en_IN" },
    ],
  },
  {
    id: "real-time-ai-avatar",
    title: "Real-Time Offline 3D AI Avatar",
    category: "AI & GenAI",
    type: "work",
    tags: ["Whisper", "Ollama", "RAG", "Three.js", "WebSockets"],
    description:
      "Fully offline 3D AI avatar. You give it your documents, it answers from them using local RAG. Real-time speech in and out, browser-rendered 3D presenter, no cloud calls.",
    image: "/work/ai-avatar.svg",
  },
  {
    id: "cattle-biometric",
    title: "Cattle Biometric Identification at Scale",
    category: "Computer Vision",
    type: "research",
    tags: ["SimCLR", "FAISS", "Multi-view", "Distributed", "Agritech"],
    description:
      "Multi-view biometric retrieval pipeline for cattle identification. 100,000+ images indexed with contrastive embeddings, FAISS multi-index search, and distributed image processing across worker pools.",
    image: "/work/cattle.svg",
  },
  {
    id: "zapstays-platform",
    title: "zapstays.in: Hostel & Co-Living Platform",
    category: "Apps & Platforms",
    type: "work",
    tags: ["PHP 8", "MySQL", "Full-Stack", "Live"],
    description:
      "Full-stack hostel and co-living platform for verified travelers and owners across India. Quote-based flow, real-time chat, three-role codebase, and admin power-tools. Live production.",
    image: "/work/zapstays.svg",
    links: [{ label: "Live", url: "https://zapstays.in" }],
  },
  {
    id: "vibration-diagnostics",
    title: "Vibration Diagnostics Rule Engine",
    category: "ML for Engineering R&D",
    type: "research",
    tags: ["Python", "Signal Processing", "PyQt5", "ISO 10816"],
    description:
      "Transparent rule-based fault diagnostics for rotating machinery. Ranks probable mechanical, bearing, and electrical faults with traceable evidence rather than opaque ML predictions.",
    image: "/work/vibration.svg",
  },
  {
    id: "docforge",
    title: "DocForge: Offline Document Intelligence",
    category: "AI & GenAI",
    type: "work",
    tags: ["Python", "Ollama", "VLM", "Tesseract", "PDF"],
    description:
      "Offline PDF organiser that reads each page with a local vision-language model and generates clean descriptive filenames and folder structures. Zero cloud calls, zero data leaves the machine.",
    image: "/work/docforge.svg",
  },
  {
    id: "patent-similarity",
    title: "Patent Similarity & Prior Art LLM",
    category: "AI & GenAI",
    type: "work",
    tags: ["LLMs", "FAISS", "AWS Lambda", "Terraform"],
    description:
      "LLM-based patent similarity and prior-art evaluation for Pangeon. Embedding retrieval, semantic scoring, and reproducible AWS provisioning across accounts.",
    image: "/work/patent-similarity.svg",
  },
  {
    id: "offshore-digital-twin",
    title: "Offshore Digital Twin ML Infrastructure",
    category: "Digital Twins",
    type: "work",
    tags: ["Python", "MOSES", "Scikit-learn", "Signal Processing"],
    description:
      "End-to-end ML infrastructure for offshore riser fatigue, vessel motion, wave height, and heading. Retrain-to-predict pipeline over automated Bentley MOSES studies.",
    image: "/work/offshore-dt.svg",
  },
  {
    id: "pynaos-fea",
    title: "PyNAOS: Pure-Python FEA Engine",
    category: "Engineering Software",
    type: "work",
    tags: ["Python", "PyQt5", "NumPy", "SciPy"],
    description:
      "Self-contained Python FEA engine for offshore platforms and jack-up rigs. Six analysis drivers, custom Skyline LDLT solver, PyQt5 and OpenGL desktop workstation.",
    image: "/work/pynaos.svg",
  },
  {
    id: "naval-arch-studio",
    title: "NavalArch Studio: Ship Design Suite",
    category: "Naval Architecture",
    type: "work",
    tags: ["Python", "PyQt5", "PyOpenGL", "ReportLab"],
    description:
      "Naval architecture suite covering hydrostatics, stability, seakeeping, damage, structural strength, and classification rules, validated against Maxsurf.",
    image: "/work/navalarch.svg",
  },
  {
    id: "moses-doe-pipeline",
    title: "MOSES Sea-Transport DOE Automation",
    category: "Simulation Automation",
    type: "work",
    tags: ["Python", "MOSES", "XGBoost", "Optuna"],
    description:
      "Parametric sea-transport platform driving Bentley MOSES through stratified DOE cases, feeding ML surrogates, sensitivity analysis, and multi-objective optimisation.",
    image: "/work/moses-doe.svg",
  },
  {
    id: "ship-recycling-expert-system",
    title: "Ship Recycling Expert System",
    category: "Compliance & Automation",
    type: "work",
    tags: ["Django", "HTMX", "Tailwind", "WeasyPrint"],
    description:
      "Multi-domain expert system turning ship intake data into compliant, safe, economically viable recycling plans. Hazmat tracking, cutting sequences, workflow DAG.",
    image: "/work/ship-recycling.svg",
  },
  {
    id: "dcdc-surrogate-pipeline",
    title: "DC-DC Converter Surrogate & Inverse Design",
    category: "ML for Engineering R&D",
    type: "research",
    tags: ["Python", "XGBoost", "PyTorch", "PINN"],
    description:
      "End-to-end ML surrogate pipeline for a dual-input DC-DC converter. Physics-informed network with a five-layer OOD detector and differential-evolution inverse design.",
    image: "/work/dcdc.svg",
  },
  {
    id: "auv-programme",
    title: "Autonomous Underwater Vehicle Programme",
    category: "Research & Product Development",
    type: "research",
    tags: ["AUV", "Reliability", "Structural Analysis", "Marine"],
    description:
      "Ongoing research and product development on autonomous underwater vehicles and underwater vehicle propulsion reliability. Led an engineering team across design, structural analysis, and marine deliverables.",
    image: "/work/auv.svg",
  },
  {
    id: "decision-support-framework",
    title: "Decision-Support Framework for Digital Technology Adoption",
    category: "Applied Research",
    type: "research",
    tags: ["Research", "Decision Systems", "Digital Transformation"],
    description:
      "Multi-aspect research framework for evaluating and prioritising digital technology adoption in industrial settings. Weighs technical fit, operational readiness, risk, and long-term impact.",
    image: "/work/decision-support.svg",
  },
];

export const workProjects = portfolio.filter((p) => p.type === "work");
export const researchProjects = portfolio.filter((p) => p.type === "research");
