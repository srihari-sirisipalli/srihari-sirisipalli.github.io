import { useEffect, useRef, useState } from "react";
import { Code, Brain, Cloud, Database } from "lucide-react";

const skillCategories = [
  {
    id: "programming",
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "Python", level: 95 },
      { name: "JavaScript", level: 85 },
      { name: "Java", level: 80 },
      { name: "Go", level: 75 },
      { name: "SQL", level: 90 },
    ]
  },
  {
    id: "aiml",
    title: "AI/ML & Frameworks",
    icon: Brain,
    skills: [
      { name: "PyTorch", level: 95 },
      { name: "TensorFlow", level: 90 },
      { name: "LLMs & RAG", level: 92 },
      { name: "FastAPI", level: 88 },
      { name: "NLP", level: 90 },
    ]
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    icon: Cloud,
    skills: [
      { name: "AWS", level: 92 },
      { name: "Terraform", level: 85 },
      { name: "Docker", level: 88 },
      { name: "Kubernetes", level: 80 },
      { name: "CI/CD", level: 85 },
    ]
  },
  {
    id: "data",
    title: "Data Engineering & Tools",
    icon: Database,
    skills: [
      { name: "PySpark", level: 88 },
      { name: "Hadoop", level: 82 },
      { name: "ETL Pipelines", level: 90 },
      { name: "ANSYS APDL", level: 85 },
      { name: "Prometheus & Grafana", level: 80 },
    ]
  }
];

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <section ref={sectionRef} id="skills" className="py-20">
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
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} data-testid={`skill-${category.id}-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground" data-testid={`skill-name-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{skill.name}</span>
                        <span className="text-muted-foreground" data-testid={`skill-level-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>{skill.level}%</span>
                      </div>
                      <div className="bg-secondary rounded-full h-2">
                        <div 
                          className="skill-bar bg-primary h-2 rounded-full" 
                          style={{ 
                            width: isVisible ? `${skill.level}%` : '0%',
                            transition: 'width 2s ease-in-out'
                          }}
                          data-testid={`skill-bar-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
