export const education = {
  degree: "Bachelor of Technology",
  specialization: "Mechanical Engineering",
  university: "Mahindra University",
  location: "Hyderabad",
  period: "2018 – 2022",
};

export interface Certification {
  name: string;
  issuer: string;
  url: string;
}

export const certifications: Certification[] = [
  { name: "Stanford Machine Learning", issuer: "Andrew Ng", url: "https://www.coursera.org/learn/machine-learning" },
  { name: "Deep Learning Specialization", issuer: "deeplearning.ai", url: "https://www.coursera.org/specializations/deep-learning" },
  { name: "IBM Machine Learning", issuer: "IBM", url: "https://www.coursera.org/professional-certificates/ibm-machine-learning" },
  { name: "Applied ML", issuer: "University of Michigan", url: "https://www.coursera.org/learn/applied-machine-learning-in-python" },
  { name: "Deep Learning with TensorFlow", issuer: "TensorFlow", url: "https://www.coursera.org/professional-certificates/tensorflow-in-practice" },
];

export const courses = [
  "Intro to Computer Science",
  "Linear Algebra & Matrices",
  "Probability & Statistics",
  "Data Structures",
  "Big Data Computing",
  "Advanced Data Analytics",
  "Time Series Forecasting",
  "GPU Programming",
  "Computer Aided Engineering Design",
];
