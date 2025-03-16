export interface Test {
  id: string;
  name: string;
  date: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: Option[];
  type: "multiple-choice" | "short-answer" | "essay";
  marks: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface StudentAnswer {
  id: string;
  testId: string;
  studentName: string;
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

export interface Report {
  id: string;
  studentAnswerId: string;
  test: Test;
  studentAnswer: StudentAnswer;
  generatedAt: string;
}
