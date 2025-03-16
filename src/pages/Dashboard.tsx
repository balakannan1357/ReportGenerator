import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { TestList } from "@/components/dashboard/TestList";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { mockTests, mockStudentAnswers } from "@/lib/utils";
import { Check, FileText, GraduationCap } from "lucide-react";
import { Test } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";

const Dashboard = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>(mockTests);

  const deleteTest = (id: string) => {
    setTests(tests.filter((test) => test.id !== id));
    toast({
      title: "Test deleted",
      description: "The test has been successfully deleted.",
      variant: "default",
    });
  };

  // Calculate stats
  const totalTests = tests.length;
  const totalQuestions = tests.reduce(
    (sum, test) => sum + test.questions.length,
    0
  );
  const totalStudents = mockStudentAnswers.length;

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
