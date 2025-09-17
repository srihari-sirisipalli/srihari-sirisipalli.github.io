import { ArrowRight, Bot, Search, Cog, Wind, Waves, Film } from "lucide-react";

const projects = [
  {
    id: "ai-avatar",
    title: "Real-Time AI Avatar System",
    category: "AI/ML • Real-time Systems",
    description: "Built offline-capable 3D AI avatar with Whisper STT, Ollama LLM, LangChain RAG, and Silero TTS. Reduced STT latency by 75% and TTS latency by 52%.",
    technologies: ["Python", "FastAPI", "React", "Three.js", "Whisper"],
    icon: Bot,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "patent-similarity",
    title: "Patent Similarity System",
    category: "NLP • LLMs",
    description: "Built patent similarity system using LLMs for prior art detection, novelty assessment, and infringement analysis with high accuracy.",
    technologies: ["Python", "LLMs", "NLP", "Vector DB"],
    icon: Search,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
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
    id: "wind-turbine",
    title: "Automated Engineering Simulation",
    category: "Simulation • CAD",
    description: "Automated ANSYS APDL + FreeCAD workflows for wind turbine design-to-analysis. Integrated ML-driven optimization loops.",
    technologies: ["ANSYS APDL", "FreeCAD", "Python", "Optimization"],
    icon: Wind,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "offshore-riser",
    title: "Offshore Riser Behavior Modeling",
    category: "Ocean Engineering • ML",
    description: "Modeled fatigue life prediction for offshore risers under extreme sea states. Integrated wave directionality and environmental modeling.",
    technologies: ["Python", "CFD", "ML", "Matlab"],
    icon: Waves,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  },
  {
    id: "movie-recommender",
    title: "Movie Recommender System",
    category: "Recommendation Systems • Big Data",
    description: "Built movie recommender system using item-based collaborative filtering (IBCF) and MapReduce on Hadoop for scalable recommendations.",
    technologies: ["Python", "Hadoop", "MapReduce", "Collaborative Filtering"],
    icon: Film,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-projects">Featured Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const IconComponent = project.icon;
            return (
              <div key={project.id} className="project-card bg-card border border-border rounded-lg overflow-hidden shadow-lg" data-testid={`project-${project.id}`}>
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  data-testid={`project-image-${project.id}`}
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="w-5 h-5 text-primary" />
                    <span className="text-sm text-primary font-medium" data-testid={`project-category-${project.id}`}>{project.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3" data-testid={`project-title-${project.id}`}>{project.title}</h3>
                  <p className="text-muted-foreground mb-4" data-testid={`project-description-${project.id}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded"
                        data-testid={`project-tech-${project.id}-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button className="text-primary hover:text-accent font-medium flex items-center gap-2" data-testid={`project-link-${project.id}`}>
                    View Project <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
