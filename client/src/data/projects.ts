export interface ProjectLink {
  label: string;
  url: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
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
    tags: ["Flutter", "DigitalOcean", "Redis", "Product"],
    description:
      "End-to-end technical rebuild of Openct: complete website redesign, Flutter mobile rebuild, new backend on DigitalOcean and Redis, and shipped features across web and mobile.",
    image: "/work/openct.svg",
    links: [
      { label: "Website", url: "https://openct.co" },
      { label: "Play Store", url: "https://play.google.com/store/apps/details?id=co.openct" },
    ],
  },
  {
    id: "real-time-ai-avatar",
    title: "Real-Time Offline 3D AI Avatar",
    category: "AI & GenAI",
    tags: ["Whisper", "Ollama", "RAG", "Three.js", "WebSockets"],
    description:
      "Fully offline 3D AI avatar. You give it your documents, it answers from them using local RAG. Real-time speech in and out, browser-rendered 3D presenter, no cloud calls.",
    image: "/work/ai-avatar.svg",
  },
  {
    id: "auv-programme",
    title: "Autonomous Underwater Vehicle Programme",
    category: "Research & Product Development",
    tags: ["AUV", "Reliability", "Structural Analysis", "Marine"],
    description:
      "Ongoing research and product development on autonomous underwater vehicles and underwater vehicle propulsion reliability. Led an engineering team across design, structural analysis, and marine deliverables.",
    image: "/work/auv.svg",
  },
  {
    id: "docforge",
    title: "DocForge: Offline Document Intelligence",
    category: "AI & GenAI",
    tags: ["Python", "Ollama", "VLM", "Tesseract", "PDF"],
    description:
      "Offline PDF organiser that reads each page with a local vision-language model and generates clean descriptive filenames and folder structures. Zero cloud calls, zero data leaves the machine.",
    image: "/work/docforge.svg",
  },
  {
    id: "decision-support-framework",
    title: "Decision-Support Framework for Digital Technology Adoption",
    category: "Applied Research",
    tags: ["Research", "Decision Systems", "Digital Transformation"],
    description:
      "Multi-aspect research framework for evaluating and prioritising digital technology adoption in industrial settings. Weighs technical fit, operational readiness, risk, and long-term impact.",
    image: "/work/decision-support.svg",
  },
  {
    id: "patent-similarity",
    title: "Patent Similarity & Prior Art LLM",
    category: "AI & GenAI",
    tags: ["LLMs", "FAISS", "AWS Lambda", "Terraform"],
    description:
      "LLM-based patent similarity and prior-art evaluation for Pangeon. Embedding retrieval, semantic scoring, and reproducible AWS provisioning across accounts.",
    image: "/work/patent-similarity.svg",
  },
  {
    id: "offshore-digital-twin",
    title: "Offshore Digital Twin ML Infrastructure",
    category: "Digital Twins",
    tags: ["Python", "MOSES", "Scikit-learn", "Signal Processing"],
    description:
      "End-to-end ML infrastructure for offshore riser fatigue, vessel motion, wave height, and heading. Retrain-to-predict pipeline over automated Bentley MOSES studies.",
    image: "/work/offshore-dt.svg",
  },
  {
    id: "pynaos-fea",
    title: "PyNAOS: Pure-Python FEA Engine",
    category: "Engineering Software",
    tags: ["Python", "PyQt5", "NumPy", "SciPy"],
    description:
      "Self-contained Python FEA engine for offshore platforms and jack-up rigs. Six analysis drivers, custom Skyline LDLT solver, PyQt5 and OpenGL desktop workstation.",
    image: "/work/pynaos.svg",
  },
  {
    id: "naval-arch-studio",
    title: "NavalArch Studio: Ship Design Suite",
    category: "Naval Architecture",
    tags: ["Python", "PyQt5", "PyOpenGL", "ReportLab"],
    description:
      "Naval architecture suite covering hydrostatics, stability, seakeeping, damage, structural strength, and classification rules, validated against Maxsurf.",
    image: "/work/navalarch.svg",
  },
  {
    id: "moses-doe-pipeline",
    title: "MOSES Sea-Transport DOE Automation",
    category: "Simulation Automation",
    tags: ["Python", "MOSES", "XGBoost", "Optuna"],
    description:
      "Parametric sea-transport platform driving Bentley MOSES through stratified DOE cases, feeding ML surrogates, sensitivity analysis, and multi-objective optimisation.",
    image: "/work/moses-doe.svg",
  },
  {
    id: "ship-recycling-expert-system",
    title: "Ship Recycling Expert System",
    category: "Compliance & Automation",
    tags: ["Django", "HTMX", "Tailwind", "WeasyPrint"],
    description:
      "Multi-domain expert system turning ship intake data into compliant, safe, economically viable recycling plans. Hazmat tracking, cutting sequences, workflow DAG.",
    image: "/work/ship-recycling.svg",
  },
  {
    id: "dcdc-surrogate-pipeline",
    title: "DC-DC Converter Surrogate & Inverse Design",
    category: "ML for Engineering R&D",
    tags: ["Python", "XGBoost", "PyTorch", "PINN"],
    description:
      "End-to-end ML surrogate pipeline for a dual-input DC-DC converter. Physics-informed network with a five-layer OOD detector and differential-evolution inverse design.",
    image: "/work/dcdc.svg",
  },
];
