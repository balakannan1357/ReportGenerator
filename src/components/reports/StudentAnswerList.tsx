import { StudentReportCard } from "@/components/reports/StudentReportCard";
import { SectionHeader } from "@/components/ui-components/SectionHeader";
import { Button } from "@/components/ui/button";
import { StudentAnswer, Test } from "@/lib/types";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface StudentAnswerListProps {
  readonly studentAnswers: StudentAnswer[];
  readonly tests: Test[];
}

export function StudentAnswerList({
  studentAnswers,
  tests,
}: StudentAnswerListProps) {
  // Get test by Id
  const getTest = (testId: string): Test | undefined => {
    return tests.find((test) => test.id === testId);
  };

  return (
    <div>
      <SectionHeader
        title="Student Reports"
        actions={
          <Button asChild>
            <Link to="/answers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Answers
            </Link>
          </Button>
        }
      />

      {studentAnswers.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="font-medium text-lg">No student answers available</h3>
          <p className="text-muted-foreground mt-1">
            Submit answers to generate reports
          </p>
          <Button className="mt-4" asChild>
            <Link to="/answers/new">Submit Answers</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {studentAnswers.map((studentAnswer) => {
            const test = getTest(studentAnswer.testId);
            if (!test) return null;

            return (
              <StudentReportCard
                key={studentAnswer.id}
                studentAnswer={studentAnswer}
                test={test}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
