import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { StudentAnswerList } from "@/components/reports/StudentAnswerList";
import { StudentAnswer, Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { testsApi, answersApi } from "@/services/api";

const AnswersPage = () => {
  const { toast } = useToast();
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [testsData, answersData] = await Promise.all([
          testsApi.getAll(),
          answersApi.getAll(),
        ]);

        setTests(testsData);
        setStudentAnswers(answersData);
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
          title="Student Answers"
          subtitle="View and manage student test answers"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading answers...</p>
          </div>
        ) : (
          <div className="mt-8">
            <StudentAnswerList studentAnswers={studentAnswers} tests={tests} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AnswersPage;
