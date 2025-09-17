import { ChevronRight } from "lucide-react";

const experiences = [
  {
    id: "pangeon",
    title: "Software Engineer – GenAI & Cloud Infra",
    company: "Pangeon",
    period: "03/2024 – Present",
    location: "Remote",
    achievements: [
      "Built patent similarity system using LLMs for prior art detection, novelty assessment, and infringement analysis",
      "Designed dynamic AWS architecture with EC2 autoscaling, reducing infrastructure costs by >30%",
      "Migrated workloads to GPU-enabled Lambda, reducing EC2 dependency",
      "Delivered end-to-end AWS infrastructure with Terraform (Amplify, IAM, monitoring, security)"
    ]
  },
  {
    id: "defense-rnd",
    title: "Machine Learning Engineer – Naval & Industry R&D",
    company: "Defense & Industry Clients",
    period: "05/2024 – Present",
    location: "Remote",
    achievements: [
      "Built offline-capable 3D AI avatar with Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS lip-sync",
      "Reduced STT latency by 75% and TTS latency by 52%; deployed low-latency stack (FastAPI + React + Three.js)",
      "Built anomaly detection pipelines for naval systems with early fault detection capabilities"
    ]
  },
  {
    id: "sas2py",
    title: "Data Engineer",
    company: "Sas2Py",
    period: "03/2023 – 06/2023",
    location: "Hyderabad",
    achievements: [
      "Migrated SAS → PySpark, improving scalability & performance of large data pipelines",
      "Built automated validation scripts with HTML reports, ensuring >99% migration accuracy",
      "Applied graph theory to map dependencies, uncovering pipeline bottlenecks"
    ]
  },
  {
    id: "corteva",
    title: "Machine Learning Intern",
    company: "Corteva Agriscience",
    period: "07/2022 – 12/2022",
    location: "Hyderabad",
    achievements: [
      "Converted models across TensorFlow/PyTorch → ONNX/other formats for cross-platform deployment",
      "Optimized computer vision models via compression, quantization, and pruning"
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-experience">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 timeline-line"></div>
          
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-20" data-testid={`experience-${exp.id}`}>
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground" data-testid={`exp-title-${exp.id}`}>{exp.title}</h3>
                      <p className="text-primary font-medium" data-testid={`exp-company-${exp.id}`}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full" data-testid={`exp-period-${exp.id}`}>
                      {exp.period}
                    </span>
                  </div>
                  <div className="space-y-3 text-muted-foreground">
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p data-testid={`exp-achievement-${exp.id}-${achievementIndex}`}>{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
