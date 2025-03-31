import { AnswerForm } from "@/components/answer-submission/AnswerForm";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Student, StudentAnswer, Test } from "@/lib/types";
import { answersApi, studentsApi, testsApi } from "@/services/api.service";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CreateAnswerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [initialTestId, setInitialTestId] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const testId = params.get("testId");
    if (testId) {
      setInitialTestId(testId);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [testsData, studentsData] = await Promise.all([
          testsApi.getAll(),
          studentsApi.getAll(),
        ]);
        setTests(testsData);
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

  const handleSubmit = async (studentAnswer: StudentAnswer) => {
    setIsSubmitting(true);

    try {
      await answersApi.create(studentAnswer);

      toast({
        title: "Answers recorded",
        description: "Student answers have been successfully recorded.",
        variant: "default",
      });

      navigate("/answers");
    } catch (error) {
      console.error("Error submitting answers:", error);
      toast({
        title: "Error",
        description: "Failed to submit answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Record Student Answers"
          subtitle="Select a test and enter student answers for evaluation"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading tests...</p>
          </div>
        ) : (
          <div className="mt-8">
            <AnswerForm
              tests={tests}
              students={students}
              onSubmit={handleSubmit}
              initialStudentAnswer={
                initialTestId
                  ? {
                      testId: initialTestId,
                      studentId: "",
                      date: new Date().toISOString(),
                      answers: [],
                      totalMarks: 0,
                      percentage: 0,
                    }
                  : undefined
              }
              isSubmitting={isSubmitting}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateAnswerPage;
