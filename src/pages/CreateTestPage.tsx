import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { TestForm } from "@/components/test-management/TestForm";
import { Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { testsApi } from "@/services/api.service";

const CreateTestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTest = async (test: Test) => {
    setIsSubmitting(true);

    try {
      await testsApi.create(test);

      toast({
        title: "Test created",
        description: "Your test has been successfully created.",
        variant: "default",
      });

      navigate("/tests");
    } catch (error) {
      console.error("Failed to create test:", error);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
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
          title="Create New Test"
          subtitle="Create a new test with questions and answer options"
        />

        <div className="mt-8">
          <TestForm onSubmit={handleCreateTest} isSubmitting={isSubmitting} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateTestPage;
