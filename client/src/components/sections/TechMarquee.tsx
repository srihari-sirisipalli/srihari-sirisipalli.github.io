import { motion } from "framer-motion";

const items = [
  // AI / ML / DL — first
  "AI", "Machine Learning", "Deep Learning",
  "PyTorch", "TensorFlow", "Keras", "Scikit-learn", "XGBoost", "LightGBM", "Optuna",
  "Hugging Face", "Transformers", "ONNX",
  // GenAI / LLMs
  "GenAI", "LLMs", "RAG", "Embeddings",
  "OpenAI", "Anthropic", "LangChain", "LlamaIndex", "Ollama", "vLLM", "Whisper",
  // Computer vision
  "Computer Vision", "OpenCV", "YOLO", "BoT-SORT", "SimCLR", "Tesseract", "MediaPipe",
  // Digital Twins, Simulation, Reliability
  "Digital Twins", "Simulations", "CFD", "FEA", "Reliability Analysis",
  "Physics-Informed ML", "ML Surrogates", "DOE", "Optimisation",
  // Engineering CAD/CAE tools
  "ANSYS Fluent", "ANSYS APDL", "ANSYS Mechanical",
  "OpenFOAM", "Bentley MOSES", "Autodesk Inventor", "SolidWorks",
  "FreeCAD", "Fusion 360", "AutoCAD", "Maxsurf", "Rhino",
  // App / product / frontend
  "App Development", "Flutter", "React Native",
  "React", "Next.js", "Vite", "Tailwind",
  "PyQt5", "PyQt6", "Streamlit",
  // Backend / API
  "FastAPI", "Django", "Flask", "Node.js", "Express", "WebSockets", "REST", "GraphQL",
  // DevOps / Cloud
  "DevOps", "AWS", "AWS Lambda", "AWS EC2", "AWS S3", "DigitalOcean", "GCP",
  "Docker", "Terraform", "GitHub Actions", "CI/CD", "Nginx",
  // Databases / storage / vector
  "PostgreSQL", "MySQL", "Redis", "SQLite", "FAISS", "ChromaDB",
  // Data / pipelines
  "NumPy", "SciPy", "Pandas", "Polars", "Dask", "PySpark", "Airflow",
  // 3D / graphics
  "Three.js", "PyOpenGL", "WebGL",
  // Ops / observability
  "Prometheus", "Grafana", "Weights & Biases", "MLflow",
  // Languages
  "Python", "TypeScript", "JavaScript", "Dart", "C++", "MATLAB", "SQL", "HTML", "CSS",
  // Marine / naval domain — last
  "Naval Architecture", "Ship Design", "Offshore Structures", "AUV",
  "Hydrodynamics", "Seakeeping", "Mooring", "Stability",
];

export default function TechMarquee() {
  const doubled = [...items, ...items];

  return (
    <section className="py-16 sm:py-20 border-y border-rule bg-bg-sunk overflow-hidden">
      <p className="text-center text-xs uppercase tracking-wide text-ink-faint mb-8 font-medium">
        Selected stack
      </p>
      <div className="relative">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 180,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-2xl sm:text-3xl text-ink-soft flex-shrink-0"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
