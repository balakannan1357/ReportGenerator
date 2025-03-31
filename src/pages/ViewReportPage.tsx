import { Layout } from "@/components/layout/Layout";
import { ReportChart } from "@/components/reports/ReportChart";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Student, StudentAnswer, Test } from "@/lib/types";
import { answersApi, studentsApi, testsApi } from "@/services/api.service";
import { exportToPdf } from "@/services/export.service";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewReportPage = () => {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [studentAnswer, setStudentAnswer] = useState<StudentAnswer | null>(
    null
  );
  const [test, setTest] = useState<Test | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Add reference to the report element for PDF export
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!answerId) return;

      try {
        setIsLoading(true);
        const answerData = await answersApi.getById(answerId);
        setStudentAnswer(answerData);

        const [testData, studentData] = await Promise.all([
          testsApi.getById(answerData.testId),
          studentsApi.getById(answerData.studentId),
        ]);

        setTest(testData);
        setStudent(studentData);
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast({
          title: "Error",
          description: "Failed to load report data.",
          variant: "destructive",
        });
        navigate("/reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [answerId, navigate, toast]);

  const handleExportPdf = async () => {
    if (!studentAnswer || !test || !reportRef.current) return;

    try {
      setIsExporting(true);
      await exportToPdf(studentAnswer, student, test, reportRef.current);
      toast({
        title: "Success",
        description: "Report exported successfully",
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        title: "Export failed",
        description: "Could not export the report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading report...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!studentAnswer || !test) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Report not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center">
          <PageHeader
            title={`${student.name}'s Report`}
            subtitle={`Test: ${test.name}`}
          />
          <Button
            onClick={handleExportPdf}
            className="flex items-center gap-2"
            disabled={isExporting}
          >
            {isExporting ? (
              <>Exporting...</>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Export PDF
              </>
            )}
          </Button>
        </div>

        <div className="mt-8" ref={reportRef}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Student Roll Number
                </p>
                <p className="font-medium">{student.rollNum}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Date</p>
                <p className="font-medium">{studentAnswer.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="font-medium">
                  {studentAnswer.totalMarks}/
                  {test.questions.reduce((sum, q) => sum + q.maxMarks, 0)}(
                  {studentAnswer.percentage}%)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <ReportChart studentAnswer={studentAnswer} test={test} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>

            <div className="space-y-6">
              {test.questions.map((question, index) => {
                const answer = studentAnswer.answers.find(
                  (a) => a.questionId === question._id
                );
                const correctOption = question.options?.find(
                  (o) => o.isCorrect
                );

                return (
                  <div key={question._id} className="p-4 border rounded-md">
                    <div className="flex justify-between">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <span className="text-sm">
                        {answer?.marksAwarded || 0}/{question.maxMarks} marks
                      </span>
                    </div>

                    <p className="mt-2">{question.text}</p>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">
                        Student's Answer:
                      </p>

                      {question.type === "multiple-choice" && (
                        <div className="mt-1">
                          {question.options?.map((option) => {
                            const isSelected =
                              option._id === answer?.selectedOptionId;
                            const isCorrect = option.isCorrect;

                            return (
                              <div
                                key={option._id}
                                className={`p-2 my-1 rounded-md ${
                                  isSelected
                                    ? isCorrect
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-red-50 border border-red-200"
                                    : isCorrect
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={`w-4 h-4 rounded-full mr-2 ${
                                      isSelected ? "bg-primary" : "bg-gray-200"
                                    }`}
                                  ></div>
                                  <span>{option.text}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {(question.type === "short-answer" ||
                        question.type === "essay") && (
                        <div className="mt-1 p-3 bg-gray-50 border rounded-md">
                          {answer?.textAnswer || (
                            <em className="text-gray-400">
                              No answer provided
                            </em>
                          )}
                        </div>
                      )}
                    </div>

                    {question.type === "multiple-choice" && correctOption && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Correct Answer:
                        </p>
                        <p className="mt-1 font-medium">{correctOption.text}</p>
                      </div>
                    )}

                    {answer?.marksAwarded !== undefined && (
                      <div className="mt-4 flex items-center">
                        <div
                          className={`px-2 py-1 rounded-md text-sm ${
                            answer.marksAwarded === question.maxMarks
                              ? "bg-green-100 text-green-800"
                              : answer.marksAwarded > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {answer.marksAwarded === question.maxMarks
                            ? "Full marks"
                            : answer.marksAwarded > 0
                            ? "Partial marks"
                            : "No marks"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Overall Performance</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      studentAnswer.percentage >= 70
                        ? "bg-green-500"
                        : studentAnswer.percentage >= 40
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${studentAnswer.percentage}%` }}
                  ></div>
                </div>
                <span className="ml-4 font-medium">
                  {studentAnswer.percentage}%
                </span>
              </div>

              <p className="mt-4 text-sm">
                {studentAnswer.percentage >= 70
                  ? "Excellent performance! Keep up the good work."
                  : studentAnswer.percentage >= 40
                  ? "Good effort, but there's room for improvement."
                  : "Needs significant improvement. Consider reviewing the material again."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewReportPage;
