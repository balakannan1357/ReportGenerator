import { StatsCard } from "@/components/dashboard/StatsCard";
import { TestList } from "@/components/dashboard/TestList";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { StudentAnswer, Test } from "@/lib/types";
import { answersApi, testsApi } from "@/services/api.service";
import { Check, FileText, GraduationCap, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
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

  const deleteTest = async (id: string) => {
    try {
      await testsApi.delete(id);
      setTests(tests.filter((test) => test._id !== id));
      toast({
        title: "Test deleted",
        description: "The test has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to delete test:", error);
      toast({
        title: "Error",
        description: "Failed to delete test. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalTests = tests?.length;
  const totalQuestions = tests?.reduce(
    (sum, test) => sum + test.questions.length,
    0
  );
  const totalStudents = studentAnswers.length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Dashboard"
          subtitle="Manage tests and student reports"
          actions={
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/reports">View Reports</Link>
              </Button>
              <Button asChild>
                <Link to="/tests/new">Create Test</Link>
              </Button>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <StatsCard
            title="Total Tests"
            value={totalTests}
            icon={<FileText className="h-5 w-5" />}
            trend={{ value: 10, label: "from last month" }}
          />
          <StatsCard
            title="Total Questions"
            value={totalQuestions}
            icon={<Check className="h-5 w-5" />}
          />
          <StatsCard
            title="Students Evaluated"
            value={totalStudents}
            icon={<GraduationCap className="h-5 w-5" />}
            trend={{ value: 5, label: "from last month" }}
          />
        </div>

        <div className="mt-12">
          <TestList tests={tests} onDeleteTest={deleteTest} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
