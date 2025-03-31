import { TestList } from "@/components/dashboard/TestList";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { Test } from "@/lib/types";
import { testsApi } from "@/services/api.service";
import { useEffect, useState } from "react";

const TestsPage = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const handleDeleteTest = async (id: string) => {
    try {
      await testsApi.delete(id);
      setTests(tests.filter((test) => test._id !== id));

      toast({
        title: "Test deleted",
        description: "The test has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting test:", error);
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Test Management"
          subtitle="Create, edit and manage your tests"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading tests...</p>
          </div>
        ) : (
          <div className="mt-8">
            <TestList tests={tests} onDeleteTest={handleDeleteTest} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestsPage;
