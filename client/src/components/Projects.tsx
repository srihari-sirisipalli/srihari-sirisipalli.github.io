import { Bot, Search, Cog, Waves, Film, Atom, TrendingUp, BarChart3, Cog as Gear, Zap } from "lucide-react";

const rndProjects = [
  {
    id: "ai-avatar",
    title: "Real-Time AI Avatar System",
    category: "AI/ML • Real-time Systems",
    description: "Built offline-capable 3D AI avatar with Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS. Reduced STT latency by 75% and TTS latency by 52%.",
    technologies: ["Python", "FastAPI", "React", "Three.js", "Whisper"],
    icon: Bot,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  // {
  //   id: "patent-similarity",
  //   title: "Patent Similarity System",
  //   category: "NLP • LLMs",
  //   description: "Built patent similarity system using LLMs for prior art detection, novelty assessment, and infringement analysis with high accuracy.",
  //   technologies: ["Python", "LLMs", "NLP", "Vector DB"],
  //   icon: Search,
  //   image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  // },
  {
    id: "predictive-maintenance",
    title: "Predictive Maintenance System",
    category: "Predictive Analytics • IoT",
    description: "Built anomaly detection pipelines from accelerometer data with features extraction. Enabled early fault detection for naval systems.",
    technologies: ["Python", "Random Forest", "SVM", "Signal Processing"],
    icon: Cog,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "offshore-riser",
    title: "Offshore Riser Behavior Modeling",
    category: "Ocean Engineering • ML",
    description: "Modeled fatigue life prediction for offshore risers under extreme sea states. Integrated wave directionality and environmental modeling.",
    technologies: ["Python", "CFD", "ML", "Matlab"],
    icon: Waves,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  }
];

const academicProjects = [
  {
    id: "quantum-neutrino",
    title: "Quantum Neutrino Oscillation Study",
    category: "Quantum Physics • Mathematical Modeling",
    description: "Developed mathematical models for long baseline neutrino oscillation experiment. Derived oscillation parameters and established correlations between LG inequalities and neutrino oscillations.",
    technologies: ["C", "Scientific Computing", "Globes Library", "Mathematical Modeling"],
    icon: Atom,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "stock-price-numerical",
    title: "Stock-Price Modeling with Numerical Methods",
    category: "Financial Modeling • Numerical Analysis",
    description: "Led team to simulate stock and option prices using Euler-Maruyama and Black Scholes methods. Conducted comparative analyses against GBM and FGBM-based models.",
    technologies: ["Python", "Numerical Methods", "Financial Modeling", "Statistical Analysis"],
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "fgbm-stock-modeling",
    title: "Geometric Fractional Brownian Motion in Stock-Price Modeling",
    category: "Financial Mathematics • Stochastic Processes",
    description: "Guided team of 4 in developing models to simulate stock pricing using FGBM. Assessed error minimization between Geometric Brownian and FGBM models using RMSE.",
    technologies: ["Python", "Jupyter Notebook", "FGBM", "Statistical Modeling"],
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "movie-recommender",
    title: "Movie Recommender System Implementation",
    category: "Recommendation Systems • Big Data",
    description: "Led team of 5 to build movie recommender system using item-based collaborative filtering (IBCF) and MapReduce on Hadoop for scalable recommendations.",
    technologies: ["Python", "Hadoop", "MapReduce", "Collaborative Filtering"],
    icon: Film,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "crank-slider",
    title: "Crank Slider Mechanism IC Visualization",
    category: "Mechanical Engineering • Visualization",
    description: "Developed Python code to visualize Instantaneous Centers (ICs) of crank slider mechanisms. Generated videos illustrating complete locus of ICs for diverse mechanism inputs.",
    technologies: ["Python", "Visualization", "Mechanical Engineering", "Animation"],
    icon: Gear,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "wind-turbine-prediction",
    title: "Wind Turbine Power and Energy Prediction Web App",
    category: "Machine Learning • Web Development",
    description: "Collaborated in 2-member team to create web application predicting wind turbine output power and energy. Achieved over 92% R Square accuracy using Random Forest Regressor.",
    technologies: ["Python", "Flask", "Random Forest", "Machine Learning", "Web Development"],
    icon: Zap,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  }
];

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  icon: any;
  image: string;
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const IconComponent = project.icon;
  
  return (
    <div className="project-card bg-card border border-border rounded-lg overflow-hidden shadow-lg" data-testid={`project-${project.id}`}>
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-48 object-cover"
        data-testid={`project-image-${project.id}`}
      />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <IconComponent className="w-5 h-5 text-primary" />
          <span className="text-sm text-primary font-medium" data-testid={`project-category-${project.id}`}>
            {project.category}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`project-title-${project.id}`}>
          {project.title}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid={`project-description-${project.id}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech: string) => (
            <span 
              key={tech} 
              className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded"
              data-testid={`project-tech-${project.id}-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-projects">
            Projects
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        {/* R&D Projects */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center" data-testid="section-title-rnd-projects">
            R&D Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rndProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        
        {/* Academic Projects */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-8 text-center" data-testid="section-title-academic-projects">
            Academic Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {academicProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}