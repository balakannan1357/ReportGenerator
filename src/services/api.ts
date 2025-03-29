import { environment } from "@/environments/environment";
import { Student, StudentAnswer, Test } from "@/lib/types";

const API_URL = environment.apiUrl;

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

function createCrudApi<T>(
  resource: string,
  customMethods: {
    getAll?: () => Promise<T[]>;
    getById?: (id: string) => Promise<T>;
    create?: (data: T) => Promise<T>;
    update?: (id: string, data: T) => Promise<T>;
    delete?: (id: string) => Promise<void>;
  } = {}
) {
  return {
    getAll: customMethods.getAll
      ? customMethods.getAll
      : async (): Promise<T[]> => {
          try {
            return await fetchApi<T[]>(`${resource}/getAll`);
          } catch (error) {
            console.error(`Failed to fetch ${resource}:`, error);
            throw error;
          }
        },

    getById: customMethods.getById
      ? customMethods.getById
      : async (id: string): Promise<T> => {
          try {
            return await fetchApi<T>(`${resource}/getById/${id}`);
          } catch (error) {
            console.error(`Failed to fetch ${resource} with id ${id}:`, error);
            throw error;
          }
        },

    create: customMethods.create
      ? customMethods.create
      : async (data: T): Promise<T> => {
          try {
            return await fetchApi<T>(`${resource}`, {
              method: "POST",
              body: JSON.stringify(data),
            });
          } catch (error) {
            console.error(`Failed to create ${resource}:`, error);
            throw error;
          }
        },

    update: customMethods.update
      ? customMethods.update
      : async (id: string, data: T): Promise<T> => {
          try {
            return await fetchApi<T>(`${resource}/${id}`, {
              method: "PUT",
              body: JSON.stringify(data),
            });
          } catch (error) {
            console.error(`Failed to update ${resource} with id ${id}:`, error);
            throw error;
          }
        },

    delete: customMethods.delete
      ? customMethods.delete
      : async (id: string): Promise<void> => {
          try {
            await fetchApi(`${resource}/${id}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error(`Failed to delete ${resource} with id ${id}:`, error);
            throw error;
          }
        },
  };
}

export const testsApi = createCrudApi<Test>("/tests");
export const answersApi = createCrudApi<StudentAnswer>("/studentAnswers");
export const studentsApi = createCrudApi<Student>("/students");
