import { AnimatedCard } from "@/components/ui-components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/lib/utils";
import { Download, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/ui-components/SectionHeader";
import { ReportCard } from "@/lib/types";

interface ReportListProps {
  readonly reportCards: ReportCard[];
}
export function ReportList({ reportCards }: ReportListProps) {
  const getReports = (reportId: string): ReportCard | undefined => {
    return reportCards.find((report) => report._id === reportId);
  };

  return (
    <div>
      <SectionHeader
        title="Student Reports"
        actions={
          <Button asChild>
            <Link to="/answers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Reports
            </Link>
          </Button>
        }
      />

      {reportCards.length === 0 ? (
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
          {reportCards.map((reportCard) => {
            const test = getReports(reportCard._id);
            if (!test) return null;

            return (
              <AnimatedCard
                key={reportCard._id}
                className="h-full flex flex-col"
              >
                <div>
                  <h3 className="font-semibold text-lg">
                    {reportCard.studentName}
                  </h3>
                  {/* <p className="text-sm text-muted-foreground">{student.rollNum}</p> */}
                </div>

                <div className="mt-4 space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Course:</span>
                    <span className="font-medium">{reportCard.course}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date:</span>
                    <span>{formatShortDate(reportCard.date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Score:</span>
                    <span className="font-medium">
                      {reportCard.obtainedMarks}/{reportCard.totalMarks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Percentage:</span>
                    <span
                      className={`font-medium ${
                        reportCard.obtainedMarks / reportCard.totalMarks >= 0.7
                          ? "text-green-600"
                          : reportCard.obtainedMarks / reportCard.totalMarks >=
                            40
                          ? "text-orange-500"
                          : "text-red-600"
                      }`}
                    >
                      {(
                        (reportCard.obtainedMarks / reportCard.totalMarks) *
                        100
                      ).toFixed(2)}
                      %
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={`/reports/${reportCard._id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={`/reports/${reportCard._id}/download`}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Link>
                  </Button>
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
