import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { TestForm } from "@/components/test-management/TestForm";
import { Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { testsApi } from "@/services/api";

const EditTestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;

      try {
        setIsLoading(true);
        const data = await testsApi.getById(testId);
        setTest(data);
      } catch (error) {
        console.error("Error fetching test:", error);
        toast({
          title: "Test not found",
          description: "The requested test could not be found.",
          variant: "destructive",
        });
        navigate("/tests");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [testId, navigate, toast]);

  const handleUpdateTest = async (updatedTest: Test) => {
    if (!testId) return;

    setIsSubmitting(true);

    try {
      await testsApi.update(testId, updatedTest);

      toast({
        title: "Test updated",
        description: "Your test has been successfully updated.",
        variant: "default",
      });

      navigate("/tests");
    } catch (error) {
      console.error("Error updating test:", error);
      toast({
        title: "Error",
        description: "Failed to update test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading test...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!test) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Test not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title={`Edit Test: ${test.name}`}
          subtitle="Update test details, questions, and answer options"
        />

        <div className="mt-8">
          <TestForm
            initialTest={test}
            onSubmit={handleUpdateTest}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditTestPage;
