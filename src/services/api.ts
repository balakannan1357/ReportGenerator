import { Test, StudentAnswer } from "@/lib/types";

// Base API URL - replace with your actual API endpoint in production
const API_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

// Helper function for API requests
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Tests API
export const testsApi = {
  getAll: async (): Promise<Test[]> => {
    try {
      return await fetchApi<Test[]>("/tests");
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      // Fallback to mock data during development
      return mockTests;
    }
  },

  getById: async (id: string): Promise<Test> => {
    try {
      return await fetchApi<Test>(`/tests/${id}`);
    } catch (error) {
      console.error(`Failed to fetch test ${id}:`, error);
      const test = mockTests.find((t) => t.id === id);
      if (!test) throw new Error(`Test not found: ${id}`);
      return test;
    }
  },

  create: async (test: Test): Promise<Test> => {
    try {
      return await fetchApi<Test>("/tests", {
        method: "POST",
        body: JSON.stringify(test),
      });
    } catch (error) {
      console.error("Failed to create test:", error);
      // In development, return the test as if it was created
      return test;
    }
  },

  update: async (id: string, test: Test): Promise<Test> => {
    try {
      return await fetchApi<Test>(`/tests/${id}`, {
        method: "PUT",
        body: JSON.stringify(test),
      });
    } catch (error) {
      console.error(`Failed to update test ${id}:`, error);
      // In development, return the test as if it was updated
      return test;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await fetchApi(`/tests/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(`Failed to delete test ${id}:`, error);
    }
  },
};

// Student Answers API
export const answersApi = {
  getAll: async (): Promise<StudentAnswer[]> => {
    try {
      return await fetchApi<StudentAnswer[]>("/answers");
    } catch (error) {
      console.error("Failed to fetch student answers:", error);
      // Fallback to mock data
      return mockStudentAnswers;
    }
  },

  getById: async (id: string): Promise<StudentAnswer> => {
    try {
      return await fetchApi<StudentAnswer>(`/answers/${id}`);
    } catch (error) {
      console.error(`Failed to fetch answer ${id}:`, error);
      const answer = mockStudentAnswers.find((a) => a.id === id);
      if (!answer) throw new Error(`Answer not found: ${id}`);
      return answer;
    }
  },

  create: async (answer: StudentAnswer): Promise<StudentAnswer> => {
    try {
      return await fetchApi<StudentAnswer>("/answers", {
        method: "POST",
        body: JSON.stringify(answer),
      });
    } catch (error) {
      console.error("Failed to create answer:", error);
      // In development, return the answer as if it was created
      return answer;
    }
  },

  update: async (id: string, answer: StudentAnswer): Promise<StudentAnswer> => {
    try {
      return await fetchApi<StudentAnswer>(`/answers/${id}`, {
        method: "PUT",
        body: JSON.stringify(answer),
      });
    } catch (error) {
      console.error(`Failed to update answer ${id}:`, error);
      // In development, return the answer as if it was updated
      return answer;
    }
  },
};

// Mock data for fallback during development
// This will be used when API calls fail
import { mockTests } from "@/lib/utils";

const mockStudentAnswers: StudentAnswer[] = mockTests.flatMap((test) =>
  Array(3)
    .fill(0)
    .map((_, idx) => ({
      id: `answer-${test.id}-${idx}`,
      testId: test.id,
      studentName: `Student ${idx + 1}`,
      studentId: `STU${100 + idx}`,
      date: new Date().toISOString().split("T")[0],
      answers: test.questions.map((question) => ({
        questionId: question.id,
        selectedOptionId: question.options?.[0]?.id || "",
        textAnswer:
          question.type !== "multiple-choice" ? "Sample answer text" : "",
        marksAwarded: Math.floor(Math.random() * (question.marks + 1)),
      })),
      totalMarks: Math.floor(Math.random() * 85) + 15,
      percentage: Math.floor(Math.random() * 85) + 15,
    }))
);
