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
    category: "Apps & Platforms",
    type: "work",
    tags: ["Flutter", "DigitalOcean", "Redis", "Fractional CTO"],
    description:
      "Full rebuild of Openct as Fractional CTO. New Flutter app, new backend on DigitalOcean and Redis, complete openct.co redesign, and a steady stream of new features shipping to web and mobile.",
    image: "/work/openct.png",
    links: [
      { label: "Website", url: "https://openct.co" },
      { label: "Play Store", url: "https://play.google.com/store/apps/details?id=com.open.ct.openct&hl=en_IN" },
    ],
  },
  {
    id: "vhop",
    title: "VHop: Nightlife & Clubbing Platform",
    category: "Apps & Platforms",
    type: "work",
    tags: ["In Development", "Mobile", "Events", "Community", "India"],
    description:
      "Mobile-first nightlife platform for India. Club discovery, event booking, table reservations, community squads, paid host events, verified chat, and a platform-token rewards economy. Currently building.",
    image: "/work/vhop.svg",
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
    title: "Cattle Biometric Identification System",
    category: "Computer Vision",
    type: "work",
    tags: ["SimCLR", "FAISS", "Multi-view", "Distributed", "Agritech"],
    description:
      "Multi-view biometric retrieval for individual cattle identification. Contrastive embeddings, FAISS multi-index at 100K+ image scale, distributed feature extraction across worker pools.",
    image: "/work/cattle.svg",
  },
  {
    id: "cattle-ai-tracking",
    title: "Cattle Detection & Tracking (Cattle AI)",
    category: "Computer Vision",
    type: "work",
    tags: ["YOLO", "BoT-SORT", "OpenCV", "Streamlit", "Docker"],
    description:
      "Live cattle detection and tracking app. YOLO for detection, BoT-SORT for stable per-animal IDs, Streamlit UI, containerised for Hugging Face Spaces.",
    image: "/work/cattle-ai.svg",
  },
  {
    id: "sccl-mining-cv",
    title: "Computer Vision for SCCL Mining Operations",
    category: "Computer Vision",
    type: "work",
    tags: ["Video Analytics", "PPE", "ANPR", "Dash", "Mining"],
    description:
      "End-to-end computer vision system for SCCL mining operations. Strategy documents, technical architecture, a Python analytics backend across 11 detection features, and a Dash NOC dashboard for live operators.",
    image: "/work/sccl-mining.png",
  },
  {
    id: "zapstays-platform",
    title: "zapstays.in: Hostel & Co-Living Platform",
    category: "Apps & Platforms",
    type: "work",
    tags: ["PHP 8", "MySQL", "Full-Stack", "Live"],
    description:
      "Full-stack hostel and co-living platform for verified travelers and owners across India. Quote-based booking flow, real-time chat, three-role codebase, admin power-tools. Live in production.",
    image: "/work/zapstays.png",
    links: [{ label: "Live", url: "https://zapstays.in" }],
  },
  {
    id: "vibration-diagnostics",
    title: "Vibration Diagnostics Rule Engine",
    category: "Machine Health",
    type: "work",
    tags: ["Python", "Signal Processing", "PyQt5", "ISO 10816"],
    description:
      "Rule-based fault diagnostics for rotating machinery. Ranks probable mechanical, bearing, and electrical faults with traceable evidence, not opaque ML predictions.",
    image: "/work/vibration.png",
  },
  {
    id: "machine-fault-detection-ml",
    title: "Machine Fault Detection ML (MFDMS)",
    category: "Machine Health",
    type: "research",
    tags: ["Python", "PCA", "Clustering", "Anomaly Detection", "PyQt5"],
    description:
      "Vibration-based ML fault detection library and desktop app. Around 45 time and frequency features per sample, standardised, PCA-reduced, clustered, and anomaly-scored against a learned healthy baseline.",
    image: "/work/mfdms.png",
  },
  {
    id: "admos-swarm",
    title: "ADMOS: Adaptive Dual-Mode Operational Swarm",
    category: "Autonomous Systems Research",
    type: "research",
    tags: ["UAV Swarms", "Control", "Springer Preprint", "Co-author"],
    description:
      "Co-authored paper on a resilient multi-UAV swarm that adaptively switches between cooperative and autonomous modes to defend an asset under communication jamming. Preprint on Research Square, under review at Discover Vehicles (Springer).",
    image: "/work/admos.svg",
    links: [{ label: "Preprint", url: "https://gist.science/paper/rs/rs-9957095" }],
  },
  {
    id: "docforge",
    title: "DocForge: Offline Document Intelligence",
    category: "AI & GenAI",
    type: "work",
    tags: ["Python", "Ollama", "VLM", "Tesseract", "PDF"],
    description:
      "Offline PDF organiser that reads each page with a local vision-language model and generates clean descriptive filenames and folder structures. Zero cloud calls. Nothing leaves the machine.",
    image: "/work/docforge.svg",
  },
  {
    id: "patent-similarity",
    title: "Patent Similarity & Prior Art LLM",
    category: "AI & GenAI",
    type: "work",
    tags: ["LLMs", "FAISS", "AWS Lambda", "Terraform"],
    description:
      "LLM-based patent similarity and prior-art system for Pangeon. Embedding retrieval, semantic scoring, and reproducible AWS provisioning across client accounts.",
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
    category: "Industry Software",
    type: "work",
    tags: ["Python", "PyQt5", "NumPy", "SciPy"],
    description:
      "Self-contained Python FEA engine for offshore platforms and jack-up rigs. Six analysis drivers, custom Skyline LDLT solver, PyQt5 and OpenGL desktop workstation.",
    image: "/work/pynaos.png",
  },
  {
    id: "naval-arch-studio",
    title: "NavalArch Studio: Ship Design Suite",
    category: "Industry Software",
    type: "work",
    tags: ["Python", "PyQt5", "PyOpenGL", "ReportLab"],
    description:
      "Naval architecture suite covering hydrostatics, stability, seakeeping, damage, structural strength, and classification rules. Validated against Maxsurf.",
    image: "/work/navalarch.png",
  },
  {
    id: "moses-doe-pipeline",
    title: "MOSES Sea-Transport DOE Automation",
    category: "Automation",
    type: "work",
    tags: ["Python", "MOSES", "XGBoost", "Optuna"],
    description:
      "Parametric sea-transport platform driving Bentley MOSES through stratified DOE cases. ML surrogates, sensitivity analysis, and multi-objective optimisation on top of the generated data.",
    image: "/work/moses-doe.png",
  },
  {
    id: "ship-recycling-expert-system",
    title: "Ship Recycling Expert System",
    category: "Industry Software",
    type: "work",
    tags: ["Django", "HTMX", "Tailwind", "WeasyPrint"],
    description:
      "Expert system that turns ship intake data into compliant, safe, economically viable recycling plans. Hazmat tracking, cutting sequences, workflow DAG, seven report types.",
    image: "/work/ship-recycling.png",
  },
  {
    id: "dcdc-surrogate-pipeline",
    title: "DC-DC Converter Surrogate & Inverse Design",
    category: "ML for Engineering R&D",
    type: "research",
    tags: ["Python", "XGBoost", "PyTorch", "PINN"],
    description:
      "End-to-end ML surrogate pipeline for a dual-input DC-DC converter. Physics-informed network with a five-layer OOD detector and differential-evolution inverse design.",
    image: "/work/dcdc.png",
  },
  {
    id: "auv-programme",
    title: "Autonomous Underwater Vehicle Design & Development",
    category: "Underwater Systems",
    type: "work",
    tags: ["Autonomous Underwater Vehicle", "Product Development", "Marine", "Team Lead"],
    description:
      "Currently leading an engineering team on Autonomous Underwater Vehicle design and development. Mechanical, structural, and systems work, from concept through vehicle delivery.",
    image: "/work/auv.png",
  },
  {
    id: "underwater-reliability",
    title: "Underwater Vehicle Propulsion Reliability",
    category: "Structural Reliability",
    type: "research",
    tags: ["Reliability", "ML Surrogates", "DOE", "AI", "Structural Analysis"],
    description:
      "Research on structural reliability of underwater vehicle propulsion. Failure-mode analysis, fatigue prediction, and design margins. Sped up with AI, Design of Experiments, and ML surrogates over expensive physics simulations.",
    image: "/work/reliability.png",
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
