import { Test } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";
import { AnimatedCard } from "@/components/ui-components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface TestCardProps {
  readonly test: Test;
  readonly onDelete: (id: string) => void;
}

export function TestCard({ test, onDelete }: TestCardProps) {
  return (
    <AnimatedCard className="h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{test.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatShortDate(test.date)}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/tests/${test.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(test.id)}>
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-2 flex-grow">
        <div className="flex items-center justify-between">
          <span className="text-sm">Questions:</span>
          <span className="font-medium">{test.questions.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Total Marks:</span>
          <span className="font-medium">
            {test.questions.reduce((total, q) => total + q.marks, 0)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link to={`/answers/new?testId=${test.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            Record Answers
          </Link>
        </Button>
      </div>
    </AnimatedCard>
  );
}
