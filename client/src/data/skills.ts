export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "industry-software",
    title: "Industry Software",
    skills: ["PyQt5 Desktop Apps", "Domain Modelling", "PDF & Reporting", "Regulatory & Compliance", "Rule Engines"],
  },
  {
    id: "ai-genai",
    title: "AI & GenAI",
    skills: ["LLMs & RAG", "FAISS & Vector Search", "LangChain", "Whisper & Ollama", "Vision-Language Models"],
  },
  {
    id: "automation",
    title: "Automation",
    skills: ["CAD & CAE Automation", "DOE & Surrogates", "Bentley MOSES", "Data Pipelines", "CI/CD"],
  },
  {
    id: "apps-backend",
    title: "Apps & Backend",
    skills: ["Flutter", "React", "FastAPI", "Django", "WebSockets"],
  },
  {
    id: "cloud",
    title: "Cloud",
    skills: ["AWS", "DigitalOcean", "Terraform", "Docker", "Redis & PostgreSQL"],
  },
  {
    id: "computer-vision",
    title: "Computer Vision",
    skills: ["YOLO & BoT-SORT", "SimCLR Embeddings", "FAISS Retrieval", "OpenCV", "Video Analytics"],
  },
  {
    id: "core-engineering",
    title: "Core Engineering",
    skills: ["Hydrodynamics", "Naval Architecture", "Structural & Fatigue", "AUV Systems", "Signal Processing"],
  },
];
