import { AnimatedCard } from "@/components/ui-components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { StudentAnswer, Test } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface StudentReportCardProps {
  readonly studentAnswer: StudentAnswer;
  readonly test: Test;
}

export function StudentReportCard({
  studentAnswer,
  test,
}: StudentReportCardProps) {
  return (
    <AnimatedCard className="h-full flex flex-col">
      <div>
        <h3 className="font-semibold text-lg">{studentAnswer.studentName}</h3>
        <p className="text-sm text-muted-foreground">
          {studentAnswer.studentId}
        </p>
      </div>

      <div className="mt-4 space-y-2 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-sm">Test:</span>
          <span className="font-medium">{test.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Date:</span>
          <span>{formatShortDate(studentAnswer.date)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Score:</span>
          <span className="font-medium">
            {studentAnswer.totalMarks}/
            {test.questions.reduce((sum, q) => sum + q.marks, 0)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Percentage:</span>
          <span
            className={`font-medium ${
              studentAnswer.percentage >= 70
                ? "text-green-600"
                : studentAnswer.percentage >= 40
                ? "text-orange-500"
                : "text-red-600"
            }`}
          >
            {studentAnswer.percentage}%
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/reports/${studentAnswer.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/reports/${studentAnswer.id}/download`}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Link>
        </Button>
      </div>
    </AnimatedCard>
  );
}
