import { Code, Brain, Cloud, Database, Lightbulb, Target } from "lucide-react";

const skillCategories = [
  {
    id: "programming",
    title: "Programming Languages",
    icon: Code,
    skills: [
      "Python",
      "JavaScript",
      "Java",
      "Go",
      "SQL"
    ]
  },
  {
    id: "aiml",
    title: "AI/ML & Frameworks",
    icon: Brain,
    skills: [
      "PyTorch",
      "TensorFlow",
      "LLMs & RAG",
      "FastAPI",
      "NLP"
    ]
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    icon: Cloud,
    skills: [
      "AWS",
      "Terraform",
      "Docker",
      "Kubernetes",
      "CI/CD"
    ]
  },
  {
    id: "data",
    title: "Data Engineering & Tools",
    icon: Database,
    skills: [
      "PySpark",
      "Hadoop",
      "ETL Pipelines",
      "ANSYS APDL",
      "Prometheus & Grafana"
    ]
  }
];

const expertiseAreas = [
  "Generative AI & LLMs",
  "Cloud Infrastructure & DevOps",
  "Predictive Analytics",
  "Computer Vision",
  "Natural Language Processing",
  "MLOps & Model Deployment",
  "System Architecture",
  "Data Engineering"
];

export default function Skills() {

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-skills">Technical Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="bg-card p-6 rounded-lg border border-border" data-testid={`skills-category-${category.id}`}>
                <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <IconComponent className="w-6 h-6 text-primary" />
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {category.skills.map((skill) => (
                    <div 
                      key={skill} 
                      className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg border border-border/50 hover:bg-secondary/70 transition-colors"
                      data-testid={`skill-${category.id}-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-foreground font-medium" data-testid={`skill-name-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Areas of Expertise */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4" data-testid="section-title-expertise">Areas of Expertise</h3>
            <div className="w-16 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-border" data-testid="expertise-areas">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-primary" />
              <h4 className="text-xl font-semibold text-foreground">Core Specializations</h4>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {expertiseAreas.map((area, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
                  data-testid={`expertise-area-${index}`}
                >
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium text-sm" data-testid={`expertise-name-${index}`}>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
