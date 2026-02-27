export interface Activity {
  id: string;
  title: string;
  period: string;
  location: string;
  description: string;
  highlight: string;
  icon: string;
}

export const activities: Activity[] = [
  {
    id: "codeiam",
    title: "CODEIAM Mentor",
    period: "Jul 2024",
    location: "Visakhapatnam",
    description:
      "Mentored 3 teams at a university-level coding hackathon, guiding them through problem-solving, debugging, and presentation skills.",
    highlight: "2 teams ranked in top 5 out of 40",
    icon: "Users",
  },
  {
    id: "aero-sports",
    title: "AERO Sports Meet",
    period: "Jan 2019 – May 2022",
    location: "Hyderabad",
    description:
      "Volunteer & Security Team member for annual AERO sports events, managing logistics, scheduling, and participant coordination.",
    highlight: "Event security & operations management",
    icon: "Shield",
  },
  {
    id: "zenith-science",
    title: "Zenith Science Club",
    period: "Aug 2019 – May 2022",
    location: "Hyderabad",
    description:
      "Core team member organizing MU Research Symposium 2020, facilitating presentations of innovative student projects and faculty research.",
    highlight: "Innovation & scientific curiosity promotion",
    icon: "FlaskConical",
  },
];
