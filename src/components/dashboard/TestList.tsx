import { Test } from "@/lib/types";
import { SectionHeader } from "@/components/ui-components/SectionHeader";
import { TestCard } from "@/components/dashboard/TestCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface TestListProps {
  readonly tests: Test[];
  readonly onDeleteTest: (id: string) => void;
}

export function TestList({ tests, onDeleteTest }: TestListProps) {
  return (
    <div>
      <SectionHeader
        title="Available Tests"
        actions={
          <Button asChild>
            <Link to="/tests/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Test
            </Link>
          </Button>
        }
      />

      {tests.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="font-medium text-lg">No tests available</h3>
          <p className="text-muted-foreground mt-1">
            Create your first test to get started
          </p>
          <Button className="mt-4" asChild>
            <Link to="/tests/new">Create Test</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tests.map((test) => (
            <TestCard key={test.id} test={test} onDelete={onDeleteTest} />
          ))}
        </div>
      )}
    </div>
  );
}
