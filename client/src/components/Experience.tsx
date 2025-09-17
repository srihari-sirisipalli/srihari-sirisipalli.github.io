import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const workExperience = [
  {
    id: "pangeon",
    title: "Software Engineer – GenAI & Cloud Infra",
    company: "Pangeon",
    period: "03/2024 – Present",
    location: "Remote",
    achievements: [
      "Designed dynamic AWS architecture with EC2 autoscaling, reducing infrastructure costs by {'>'}30%",
      "Migrated workloads to GPU-enabled Lambda, reducing EC2 dependency",
      "Automated Lambda health checks & audits, improving resource utilization",
      "Delivered end-to-end AWS infrastructure with Terraform (Amplify, IAM, monitoring, security)",
      "Built custom Terraform GUI for simplified AWS resource management"
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
      "Built automated validation scripts with HTML reports, ensuring {'>'}99% migration accuracy",
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
  },
  {
    id: "dojima",
    title: "Software Engineer Intern",
    company: "Dojima Networks",
    period: "06/2022 – 12/2022",
    location: "Remote",
    achievements: [
      "Integrated Polkadot ecosystem with Dojima blockchain for cross-chain interoperability",
      "Built Prometheus–Grafana dashboards for real-time API monitoring"
    ]
  }
];

const rndExperience = [
  {
    id: "patent-similarity",
    title: "Patent Similarity System",
    company: "Pangeon",
    period: "03/2024 – Present",
    location: "Remote",
    achievements: [
      "Built patent similarity system using LLMs for prior art detection, novelty assessment, and infringement analysis",
      "Implemented advanced NLP techniques for patent document processing",
      "Developed similarity scoring algorithms for patent comparison",
      "Integrated vector databases for efficient patent search and retrieval"
    ]
  },
  {
    id: "ai-avatar",
    title: "Real-Time AI Avatar System",
    company: "Defense & Industry Clients",
    period: "05/2024 – Present",
    location: "Remote",
    achievements: [
      "Built offline-capable 3D AI avatar with Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS lip-sync",
      "Reduced STT latency by 75% and TTS latency by 52%; deployed low-latency stack (FastAPI + React + Three.js)",
      "Designed RAG Control Gate ensuring accurate knowledge base use",
      "Developed real-time lip-sync capabilities for natural conversation experience"
    ]
  },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance System",
    company: "Defense & Industry Clients",
    period: "05/2024 – Present",
    location: "Remote",
    achievements: [
      "Built anomaly detection pipelines from accelerometer data with features (RMS, FFT, kurtosis)",
      "Trained Random Forest, SVM, k-NN, DL models with cross-validation + expert-in-the-loop validation",
      "Enabled early fault detection, reducing downtime; findings shared in defense R&D conference",
      "Implemented real-time monitoring system for naval equipment health assessment"
    ]
  },
  {
    id: "offshore-riser",
    title: "Offshore Riser Behavior Modeling",
    company: "Industry R&D Projects",
    period: "05/2024 – Present",
    location: "Remote",
    achievements: [
      "Modeled fatigue life prediction for offshore risers under extreme sea states",
      "Integrated wave directionality, quadrant classification, and Hs into ML models",
      "Processed gyro data for wave direction estimation, improving environmental modeling and risk assessment",
      "Developed predictive models for structural integrity assessment"
    ]
  }
];

const advisoryExperience = [
  {
    id: "agritech-advisor",
    title: "AI/ML Advisor – Agritech Startup",
    company: "Agritech Startup",
    period: "03/2025 – 08/2025",
    location: "Remote",
    achievements: [
      "LLM Benchmarking & Evaluation:",
      "• Conducted benchmarking of commercial (OpenAI, Anthropic) and open-source LLMs (LLaMA, Mistral, etc.) for domain-specific QA on agriculture datasets",
      "• Evaluated answering capabilities in English and Telugu, with emphasis on Andhra agriculture use cases",
      "• Identified strengths and limitations of each model for bilingual agricultural contexts",
      "Speech-to-Text Pipeline Development:",
      "• Designed speech-to-text fine-tuning pipeline, automating audio collection, transcription, diarization, and dataset preparation",
      "• Fine-tuned STT and LLM models with agriculture-specific vocabulary, improving accuracy for farmer queries",
      "• Enhanced bilingual contexts (English & Telugu) for better farmer accessibility"
    ]
  }
];

interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  location: string;
  achievements: string[];
}

function ExperienceCard({ exp, sectionPrefix }: { exp: Experience; sectionPrefix: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCard = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden" data-testid={`experience-${exp.id}`}>
      <button
        onClick={toggleCard}
        className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-200"
        data-testid={`exp-toggle-${exp.id}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-foreground" data-testid={`exp-title-${exp.id}`}>{exp.title}</h3>
                <p className="text-primary font-medium" data-testid={`exp-company-${exp.id}`}>{exp.company}</p>
              </div>
              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full mt-2 sm:mt-0" data-testid={`exp-period-${exp.id}`}>
                {exp.period}
              </span>
            </div>
          </div>
          <div className="ml-4">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 space-y-3 text-muted-foreground border-t border-border pt-4" data-testid={`exp-details-${exp.id}`}>
          {exp.achievements.map((achievement, achievementIndex) => (
            <div key={achievementIndex} className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p data-testid={`exp-achievement-${exp.id}-${achievementIndex}`}>{achievement}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-experience">Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        {/* Work Experience */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8" data-testid="section-title-work-experience">Work Experience</h3>
          <div className="space-y-6">
            {workExperience.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} sectionPrefix="work" />
            ))}
          </div>
        </div>
        
        {/* R&D Experience */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8" data-testid="section-title-rnd-experience">R&D Experience</h3>
          <div className="space-y-6">
            {rndExperience.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} sectionPrefix="rnd" />
            ))}
          </div>
        </div>
        
        {/* Advisory Experience */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-8" data-testid="section-title-advisory-experience">Advisory Experience</h3>
          <div className="space-y-6">
            {advisoryExperience.map((exp) => (
              <ExperienceCard key={exp.id} exp={exp} sectionPrefix="advisory" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
