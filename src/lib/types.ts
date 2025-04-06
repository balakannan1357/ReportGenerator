import { QuestionCategory } from "./enum";

export interface Test {
  _id?: string;
  name: string;
  date: string;
  description: string;
  course: string;
  batch: string;
  exam: string;
  totalMarks: number;
  questions: Question[];
}

export interface Question {
  _id?: string;
  subject: string;
  chapter: string;
  topic: string;
  category?: QuestionCategory;
  maxMarks: number;
}

export interface StudentAnswer {
  _id?: string;
  testId: string;
  studentId: string;
  date: string;
  answers: Answer[];
  totalMarks: number;
  percentage: number;
}

export interface Answer {
  questionId: string;
  marksAwarded: number;
}

export interface Student {
  _id?: string;
  rollNum: string;
  name: string;
  email: string;
  age: number;
}

export interface Report {
  id: string;
  studentAnswerId: string;
  test: Test;
  studentAnswer: StudentAnswer;
  generatedAt: string;
}

export interface ReportCard extends CreatorBase {
  studentName: string;
  course: string;
  batch: string;
  exam: string;
  date: string;
  totalMarks: number;
  obtainedMarks: number;
  items: EvaluationEntry[];
}

export interface EvaluationEntry {
  subject: string;
  chapter: string;
  topic: string;
  category: QuestionCategory;
  maxMarks: number;
  obtainedMarks: number;
}

export interface CreatorBase {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
