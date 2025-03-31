import { TestCard } from "@/components/dashboard/TestCard";
import { SectionHeader } from "@/components/ui-components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Test } from "@/lib/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface TestListProps {
  readonly tests: Test[];
  readonly onDeleteTest: (id: string) => void;
}

export function TestList({ tests, onDeleteTest }: TestListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredTests = tests?.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="my-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredTests && filteredTests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test: Test) => (
            <TestCard key={test._id} test={test} onDelete={onDeleteTest} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No tests found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? "Try a different search term or" : "Get started by"}{" "}
            <Link to="/tests/new" className="text-primary hover:underline">
              creating a new test
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
