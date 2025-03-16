import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { AnswerForm } from "@/components/answer-submission/AnswerForm";
import { StudentAnswer, Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { testsApi, answersApi } from "@/services/api";

const CreateAnswerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [initialTestId, setInitialTestId] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Extract testId from query parameters
    const params = new URLSearchParams(location.search);
    const testId = params.get("testId");
    if (testId) {
      setInitialTestId(testId);
    }
  }, [location]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const data = await testsApi.getAll();
        setTests(data);
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast({
          title: "Error",
          description: "Failed to load tests. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
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
              onSubmit={handleSubmit}
              initialStudentAnswer={
                initialTestId
                  ? {
                      id: "",
                      testId: initialTestId,
                      studentName: "",
                      studentId: "",
                      date: new Date().toISOString().split("T")[0],
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
