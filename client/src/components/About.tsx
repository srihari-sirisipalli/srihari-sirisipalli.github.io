export default function About() {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-about">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground" data-testid="about-professional-summary">Professional Summary</h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="about-description-1">
              AI/ML Engineer with expertise in Generative AI, Cloud Infrastructure (AWS, Terraform, Kubernetes), 
              and applied R&D. I've delivered production-ready LLM applications, real-time AI avatars, predictive 
              maintenance systems, and simulation-driven ML solutions.
            </p>
            <p className="text-muted-foreground leading-relaxed" data-testid="about-description-2">
              My experience spans across defense, industry, and agritech domains, with a strong track record in 
              cost optimization, infrastructure automation, and AI advisory. I'm passionate about leveraging 
              cutting-edge AI technologies to solve complex real-world problems.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-card p-4 rounded-lg border border-border" data-testid="stat-years">
                <div className="text-2xl font-bold text-primary">2+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border" data-testid="stat-projects">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border" data-testid="stat-technologies">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border" data-testid="stat-domains">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Industry Domains</div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-border" data-testid="career-highlights">
            <h3 className="text-xl font-semibold text-foreground mb-6">Career Highlights</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground" data-testid="highlight-patent">Built patent similarity system using LLMs for prior art detection and novelty assessment</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground" data-testid="highlight-cost-optimization">Reduced infrastructure costs by {'>'}30% through dynamic AWS architecture optimization</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground" data-testid="highlight-avatar">Developed real-time AI avatar system with 75% STT and 52% TTS latency reduction</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground" data-testid="highlight-predictive">Led predictive maintenance solutions for naval systems with early fault detection</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-muted-foreground" data-testid="highlight-migration">Migrated SAS to PySpark pipelines achieving {'>'}99% migration accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
