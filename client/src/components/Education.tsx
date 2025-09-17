import { GraduationCap, Award, Book, ExternalLink } from "lucide-react";

const certifications = [
  { 
    name: "Stanford Machine Learning", 
    issuer: "Andrew Ng",
    url: "https://www.coursera.org/learn/machine-learning"
  },
  { 
    name: "Deep Learning Specialization", 
    issuer: "deeplearning.ai",
    url: "https://www.coursera.org/specializations/deep-learning"
  },
  { 
    name: "IBM Machine Learning", 
    issuer: "IBM",
    url: "https://www.coursera.org/professional-certificates/ibm-machine-learning"
  },
  { 
    name: "Applied ML", 
    issuer: "University of Michigan",
    url: "https://www.coursera.org/learn/applied-machine-learning-in-python"
  },
  { 
    name: "Deep Learning with TensorFlow", 
    issuer: "TensorFlow",
    url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice"
  }
];

const courses = [
  { name: "Introduction to Computer Science", icon: "code" },
  { name: "Linear Algebra and Matrices", icon: "calculator" },
  { name: "Probability and Statistics", icon: "chart-line" },
  { name: "Data Structures", icon: "sitemap" },
  { name: "Big Data Computing", icon: "database" },
  { name: "Advanced Data Analytics", icon: "chart-bar" },
  { name: "Time Series Forecasting", icon: "clock" },
  { name: "GPU Programming", icon: "microchip" },
  { name: "Computer Aided Engineering Design", icon: "cube" }
];

export default function Education() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-education">Education & Certifications</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Education */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border h-full" data-testid="education-degree">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Education</h3>
              </div>
              <div>
                <h4 className="text-lg font-medium text-foreground" data-testid="education-degree-title">Bachelor of Technology</h4>
                <p className="text-primary font-medium" data-testid="education-specialization">Mechanical Engineering</p>
                <p className="text-muted-foreground" data-testid="education-university">Mahindra University, Hyderabad</p>
                <p className="text-muted-foreground" data-testid="education-period-gpa">2018 - 2022 • CGPA: 7.5</p>
              </div>
            </div>
          </div>
          
          {/* Certifications */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border h-full" data-testid="education-certifications">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Certifications</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-3 group" data-testid={`certification-${index}`}>
                    <Award className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <a 
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary transition-colors group-hover:underline"
                          data-testid={`cert-link-${index}`}
                        >
                          {cert.name}
                        </a>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid={`cert-issuer-${index}`}>{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Relevant Courses */}
        <div className="mt-8">
          <div className="bg-card p-6 rounded-lg border border-border" data-testid="education-courses">
            <div className="flex items-center gap-3 mb-6">
              <Book className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Relevant Coursework</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course, index) => (
                <div key={index} className="flex items-center gap-2" data-testid={`course-${index}`}>
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-muted-foreground" data-testid={`course-name-${index}`}>{course.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
