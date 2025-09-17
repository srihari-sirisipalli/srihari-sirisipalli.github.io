import { Users, Trophy, Shield, FlaskConical } from "lucide-react";

const activities = [
  {
    id: "codeiam",
    title: "CODEIAM Mentor",
    period: "07/2024",
    location: "Visakhapatnam",
    description: "Mentored 3 teams at a university-level coding hackathon, guiding them through problem-solving, debugging, and presentation skills.",
    achievement: "2 teams ranked in top 5 out of 40",
    icon: Users
  },
  {
    id: "aero-sports",
    title: "AERO Sports Meet",
    period: "01/2019 – 05/2022",
    location: "Hyderabad",
    description: "Volunteer & Security Team member for annual AERO sports events, managing logistics, scheduling, and participant coordination.",
    achievement: "Event security & operations management",
    icon: Shield
  },
  {
    id: "zenith-science",
    title: "Zenith Science Club",
    period: "08/2019 – 05/2022",
    location: "Hyderabad",
    description: "Core team member organizing MU Research Symposium 2020, facilitating presentations of innovative student projects and faculty research.",
    achievement: "Innovation & scientific curiosity promotion",
    icon: FlaskConical
  }
];

export default function Leadership() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-leadership">Leadership & Activities</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div key={activity.id} className="bg-card p-6 rounded-lg border border-border" data-testid={`activity-${activity.id}`}>
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground" data-testid={`activity-title-${activity.id}`}>{activity.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4" data-testid={`activity-period-${activity.id}`}>
                  {activity.period} | {activity.location}
                </p>
                <p className="text-muted-foreground mb-4" data-testid={`activity-description-${activity.id}`}>
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Trophy className="w-4 h-4" />
                  <span data-testid={`activity-achievement-${activity.id}`}>{activity.achievement}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
