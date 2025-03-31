import { Layout } from "@/components/layout/Layout";
import { StudentAnswerList } from "@/components/reports/StudentAnswerList";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Student, StudentAnswer, Test } from "@/lib/types";
import { answersApi, studentsApi, testsApi } from "@/services/api.service";
import { useEffect, useState } from "react";

const ReportsPage = () => {
  const { toast } = useToast();
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [testsData, answersData, studentsData] = await Promise.all([
          testsApi.getAll(),
          answersApi.getAll(),
          studentsApi.getAll(),
        ]);

        setTests(testsData);
        setStudentAnswers(answersData);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Student Reports"
          subtitle="View and generate student test reports"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading reports...</p>
          </div>
        ) : (
          <div className="mt-8">
            <StudentAnswerList
              studentAnswers={studentAnswers}
              tests={tests}
              students={students}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
