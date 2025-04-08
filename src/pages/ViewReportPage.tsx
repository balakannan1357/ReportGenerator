import { Layout } from "@/components/layout/Layout";
import ReportChart, { ChildRef } from "@/components/reports/ReportChart";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Student, StudentAnswer, Test } from "@/lib/types";
import { answersApi, studentsApi, testsApi } from "@/services/api.service";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewReportPage = () => {
  const { answerId } = useParams<{ answerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const chartRef = useRef<ChildRef>(null);

  const [studentAnswer, setStudentAnswer] = useState<StudentAnswer | null>(
    null
  );
  const [test, setTest] = useState<Test | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

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
    if (!studentAnswer) return;
    setIsExporting(true);

    try {
      if (chartRef.current) {
        chartRef.current.generatePdf();
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to export report.",
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
            className=" text-indigo-700"
            title={`${test.name} Report for ${student.name}`}
          />
          <Button
            onClick={handleExportPdf}
            className="flex items-center gap-2"
            disabled={isExporting}
          >
            {isExporting ? (
              <>Downloading...</>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>

        <div className="mt-3 rounded-md shadow-md border border-gray-300 bg-white p-4">
          <div className="bg-white p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Course</p>
                <p className="font-medium">{test.course}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batch</p>
                <p className="font-medium">{test.batch}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Exam</p>
                <p className="font-medium">{test.exam}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Date</p>
                <p className="font-medium">{studentAnswer.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marks</p>
                <p
                  className={`font-medium ${
                    studentAnswer.percentage >= 70
                      ? "text-green-600"
                      : studentAnswer.percentage >= 40
                      ? "text-orange-500"
                      : "text-red-600"
                  }`}
                >
                  {studentAnswer.totalMarks}/
                  {test.questions.reduce((sum, q) => sum + q.maxMarks, 0)}(
                  {studentAnswer.percentage}%)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white mb-6">
            <ReportChart
              ref={chartRef}
              studentAnswer={studentAnswer}
              test={test}
              student={student}
            />
          </div>

          <div className="bg-white ">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>

            <div className="space-y-6">
              <div className="p-4 border rounded-md">
                <div className="flex justify-between">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 w-[60px] text-left text-sm font-medium">
                          No.
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          Subject
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          Chapter
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          Topic
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          Category
                        </th>
                        <th className="p-3 w-[100px] text-center text-sm font-medium">
                          Max Marks
                        </th>
                        <th className="p-3 text-center text-sm font-medium">
                          Marks Awarded
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {test.questions.map((question, questionIndex) => {
                        const answer = studentAnswer.answers.find(
                          (a) => a.questionId === question._id
                        );

                        return (
                          <tr
                            key={question._id}
                            className={
                              questionIndex % 2 === 0
                                ? "bg-background"
                                : "bg-muted/30"
                            }
                          >
                            <td className="p-3 text-sm">{questionIndex + 1}</td>
                            <td className="p-3 text-sm">{question.subject}</td>
                            <td className="p-3 text-sm">{question.chapter}</td>
                            <td className="p-3 text-sm">{question.topic}</td>
                            <td className="p-3 text-sm">{question.category}</td>
                            <td className="p-3 text-sm text-center">
                              {question.maxMarks}
                            </td>
                            <td className="p-3 text-sm text-center">
                              {answer?.marksAwarded || 0}/{question.maxMarks}{" "}
                              marks
                            </td>
                            <td>
                              {answer?.marksAwarded !== undefined && (
                                <span
                                  className={`mx-1 px-2 py-1 rounded-md text-sm ${
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
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewReportPage;
