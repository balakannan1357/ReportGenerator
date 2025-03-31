import { QuestionType } from "./enum";

export interface Test {
  _id?: string;
  name: string;
  date: string;
  description: string;
  questions: Question[];
}

export interface Question {
  _id?: string;
  text: string;
  options?: Option[];
  type: QuestionType;
  maxMarks: number;
}

export interface Option {
  _id?: string;
  text: string;
  isCorrect: boolean;
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
  selectedOptionId?: string;
  textAnswer?: string;
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
