import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "PPP");
}

export function formatShortDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function calculatePercentage(total: number, obtained: number): number {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Mock data for initial development
export const mockTests: Test[] = [
  {
    id: "test1",
    name: "Mathematics Midterm",
    date: "2023-05-15",
    questions: [
      {
        id: "q1",
        text: "What is 2 + 2?",
        type: "multiple-choice",
        marks: 1,
        options: [
          { id: "o1", text: "3", isCorrect: false },
          { id: "o2", text: "4", isCorrect: true },
          { id: "o3", text: "5", isCorrect: false },
        ],
      },
      {
        id: "q2",
        text: "Solve for x: 2x + 5 = 13",
        type: "multiple-choice",
        marks: 2,
        options: [
          { id: "o4", text: "x = 3", isCorrect: false },
          { id: "o5", text: "x = 4", isCorrect: true },
          { id: "o6", text: "x = 5", isCorrect: false },
        ],
      },
      {
        id: "q3",
        text: "Explain the Pythagorean theorem.",
        type: "essay",
        marks: 5,
      },
    ],
  },
  {
    id: "test2",
    name: "English Literature Quiz",
    date: "2023-06-10",
    questions: [
      {
        id: "q4",
        text: "Who wrote 'Romeo and Juliet'?",
        type: "multiple-choice",
        marks: 1,
        options: [
          { id: "o7", text: "Charles Dickens", isCorrect: false },
          { id: "o8", text: "William Shakespeare", isCorrect: true },
          { id: "o9", text: "Jane Austen", isCorrect: false },
        ],
      },
      {
        id: "q5",
        text: "Analyze the theme of love in 'Pride and Prejudice'.",
        type: "essay",
        marks: 10,
      },
    ],
  },
];

export const mockStudentAnswers: StudentAnswer[] = [
  {
    id: "sa1",
    testId: "test1",
    studentName: "John Doe",
    studentId: "S12345",
    date: "2023-05-15",
    answers: [
      { questionId: "q1", selectedOptionId: "o2", marksAwarded: 1 },
      { questionId: "q2", selectedOptionId: "o5", marksAwarded: 2 },
      {
        questionId: "q3",
        textAnswer:
          "The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
        marksAwarded: 4,
      },
    ],
    totalMarks: 7,
    percentage: 87.5,
  },
];

// Import types
import { Test, Question, Option, StudentAnswer, Answer, Report } from "./types";
