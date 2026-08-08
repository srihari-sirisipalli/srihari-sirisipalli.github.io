export interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "ai-genai",
    title: "AI & GenAI",
    skills: ["LLMs & RAG", "FAISS & Vector Search", "LangChain", "Whisper & Ollama", "Computer Vision"],
  },
  {
    id: "digital-twins",
    title: "Digital Twins & Simulation",
    skills: ["Bentley MOSES", "ANSYS Fluent", "ANSYS APDL", "Custom Python FEA", "DOE & Surrogates"],
  },
  {
    id: "apps-backend",
    title: "Apps & Backend",
    skills: ["Flutter", "React", "FastAPI", "Django", "WebSockets"],
  },
  {
    id: "cloud-automation",
    title: "Cloud & Automation",
    skills: ["AWS", "DigitalOcean", "Terraform", "Docker", "CI/CD"],
  },
  {
    id: "core-engineering",
    title: "Core Engineering",
    skills: ["Hydrodynamics", "Naval Architecture", "Structural & Fatigue", "AUV Systems", "Signal Processing"],
  },
];
