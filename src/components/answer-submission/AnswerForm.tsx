import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { obtainedMarksOptions } from "@/lib/constants";
import { Answer, Student, StudentAnswer, Test } from "@/lib/types";
import { calculatePercentage, formatShortDate } from "@/lib/utils";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AnswerFormProps {
  readonly tests: Test[];
  readonly students?: Student[];
  readonly initialStudentAnswer?: StudentAnswer;
  readonly onSubmit: (studentAnswer: StudentAnswer) => void;
  readonly isSubmitting?: boolean;
}

export function AnswerForm({
  tests,
  students,
  initialStudentAnswer,
  onSubmit,
  isSubmitting = false,
}: AnswerFormProps) {
  const navigate = useNavigate();

  const [selectedTestId, setSelectedTestId] = useState<string>(
    initialStudentAnswer?.testId || ""
  );
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const [studentAnswer, setStudentAnswer] = useState<StudentAnswer>(
    initialStudentAnswer || {
      testId: "",
      studentId: "",
      date: new Date().toISOString().split("T")[0],
      answers: [],
      totalMarks: 0,
      percentage: 0,
    }
  );

  useEffect(() => {
    if (selectedTestId) {
      const test = tests.find((t) => t._id === selectedTestId);
      if (test) {
        setSelectedTest(test);

        if (!initialStudentAnswer) {
          const initialAnswers = test.questions.map((question) => ({
            questionId: question._id,
            marksAwarded: 0,
          }));

          setStudentAnswer((prev) => ({
            ...prev,
            testId: selectedTestId,
            answers: initialAnswers,
          }));
        }
      }
    }
  }, [selectedTestId, tests, initialStudentAnswer]);

  const updateAnswer = (questionId: string, marksAwarded: number) => {
    setStudentAnswer((prev) => {
      const updatedAnswers = [...prev.answers];
      const answerIndex = updatedAnswers.findIndex(
        (a) => a.questionId === questionId
      );

      if (answerIndex >= 0) {
        updatedAnswers[answerIndex] = {
          ...updatedAnswers[answerIndex],
          marksAwarded,
        };
      } else {
        updatedAnswers.push({
          questionId,
          marksAwarded,
        } as Answer);
      }

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  const calculateTotals = () => {
    if (!selectedTest) return { totalMarks: 0, percentage: 0 };

    const totalAvailable = selectedTest.questions.reduce(
      (sum, q) => sum + q.maxMarks,
      0
    );

    const totalAwarded = studentAnswer.answers.reduce(
      (sum, a) => sum + a.marksAwarded,
      0
    );

    const percentage = calculatePercentage(totalAvailable, totalAwarded);

    return { totalMarks: totalAwarded, percentage };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { totalMarks, percentage } = calculateTotals();
    const finalStudentAnswer = {
      ...studentAnswer,
      totalMarks,
      percentage,
    };

    onSubmit(finalStudentAnswer);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="test-select">Select Test</Label>
          <Select
            value={selectedTestId}
            onValueChange={setSelectedTestId}
            disabled={!!initialStudentAnswer}
          >
            <SelectTrigger id="test-select">
              <SelectValue placeholder="Select a test" />
            </SelectTrigger>
            <SelectContent>
              {tests.map((test) => (
                <SelectItem key={test._id} value={test._id}>
                  {test.name} ({test.course}, {test.batch}, {test.exam}) -{" "}
                  {formatShortDate(test.date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTestId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div>
                  <Label htmlFor="student-select">Select Student</Label>
                  <Select
                    value={studentAnswer.studentId}
                    onValueChange={(value) =>
                      setStudentAnswer((prev) => ({
                        ...prev,
                        studentId: value,
                      }))
                    }
                  >
                    <SelectTrigger id="student-select">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {selectedTest && (
              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Questions & Marks</h3>
                  <div className="text-sm">
                    <span className="font-medium">
                      Total Marks: {calculateTotals().totalMarks} /{" "}
                      {selectedTest.totalMarks}
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">
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
                        <th className="p-3 text-center text-sm font-medium">
                          Max Marks
                        </th>
                        <th className="p-3 text-left text-sm font-medium">
                          Marks Awarded
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedTest.questions.map((question, questionIndex) => {
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
                            <td className="p-3">
                              <Select
                                value={answer?.marksAwarded?.toString() || "0"}
                                onValueChange={(value) =>
                                  updateAnswer(question._id, parseFloat(value))
                                }
                              >
                                <SelectTrigger className="w-20">
                                  <SelectValue>
                                    {answer?.marksAwarded
                                      ? answer?.marksAwarded?.toString()
                                      : "0"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {obtainedMarksOptions.map((mark) => (
                                    <SelectItem
                                      key={mark}
                                      value={mark.toString()}
                                    >
                                      {mark}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit & View Report
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
