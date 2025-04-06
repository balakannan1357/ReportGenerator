export const courses = [
  "NEET",
  "IIT JEE",
  "Foundation",
  "G6",
  "G7",
  "G8",
  "G9",
  "G10",
  "G11",
  "G12",
];
export const batches = ["Nurture", "Elite", "CBSE/Tution"];
export const exams = [
  "Atomic",
  "Molecular",
  "Compound",
  "Mock Test",
  "Pre NEET",
  "Pre IIT",
];
export const subjects = [
  "Physics",
  "Chemistry",
  "Biology",
  "Maths",
  "English",
  "Tamil",
];
export const chapters: Record<string, string[]> = {
  Physics: ["Kinematics", "Dynamics", "Waves"],
  Chemistry: ["Organic", "Inorganic", "Physical"],
  Biology: ["Genetics", "Ecology", "Human Physiology"],
  Maths: ["Algebra", "Calculus", "Geometry"],
  English: ["Grammar", "Comprehension"],
  Tamil: ["இலக்கம்", "கவிதைகள்"],
};
export const topics: Record<string, string[]> = {
  Kinematics: ["Motion in 1D", "Motion in 2D"],
  Dynamics: ["Force", "Newton's Laws"],
  Waves: ["Sound", "Light"],
  Organic: ["Hydrocarbons"],
  Inorganic: ["Periodic Table"],
  Physical: ["Mole Concept"],
  Genetics: ["DNA Structure"],
  Ecology: ["Ecosystems"],
  "Human Physiology": ["Digestion"],
  Algebra: ["Quadratic"],
  Calculus: ["Limits"],
  Geometry: ["Triangles"],
  Grammar: ["Tenses"],
  Comprehension: ["Passage Analysis"],
  இலக்கம்: ["எண்ணோடு"],
  கவிதைகள்: ["பா"],
};
export const maxMarksOptions = [1, 2, 3, 4, 5, 6];
export const obtainedMarksOptions = Array.from(
  { length: 11 },
  (_, i) => -1 + i * 0.5
);
