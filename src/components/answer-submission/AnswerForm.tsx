import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { QuestionType } from "@/lib/enum";
import { Answer, Question, Student, StudentAnswer, Test } from "@/lib/types";
import { calculatePercentage, formatShortDate } from "@/lib/utils";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AnswerFormProps {
  readonly tests: Test[];
  readonly students: Student[];
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
            selectedOptionId: "",
            textAnswer: "",
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

  const updateAnswer = (question: Question, answerData: Partial<Answer>) => {
    setStudentAnswer((prev) => {
      const updatedAnswers = [...prev.answers];
      const answerIndex = updatedAnswers.findIndex(
        (a) => a.questionId === question._id
      );
      const isCorrect =
        question.options?.find((o) => o._id === answerData.selectedOptionId)
          ?.isCorrect ?? false;
      const marksAwarded =
        question.type === QuestionType.MULTIPLE_CHOICE
          ? isCorrect
            ? question.maxMarks
            : 0
          : updatedAnswers[answerIndex]?.marksAwarded;

      if (answerIndex >= 0) {
        updatedAnswers[answerIndex] = {
          ...updatedAnswers[answerIndex],
          ...answerData,
          marksAwarded: answerData.marksAwarded || marksAwarded,
        };
      } else {
        updatedAnswers.push({
          questionId: question._id,
          marksAwarded,
          ...answerData,
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
    <form onSubmit={handleSubmit} className="form-container">
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
                  {test.name} ({formatShortDate(test.date)})
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
              <div className="mt-8 space-y-8">
                <h3 className="text-lg font-medium">Questions & Answers</h3>

                {selectedTest.questions.map((question, questionIndex) => {
                  const answer = studentAnswer.answers.find(
                    (a) => a.questionId === question._id
                  );

                  return (
                    <div key={question._id} className="p-6 border rounded-lg">
                      <div className="mb-4">
                        <h4 className="font-medium mb-1">
                          Question {questionIndex + 1}
                        </h4>
                        <p>{question.text}</p>
                      </div>

                      <div className="mt-4">
                        <Label>Student Answer</Label>

                        {question.type === "multiple-choice" &&
                          question.options && (
                            <RadioGroup
                              value={answer?.selectedOptionId || ""}
                              onValueChange={(value) =>
                                updateAnswer(question, {
                                  selectedOptionId: value,
                                })
                              }
                              className="mt-2 space-y-2"
                            >
                              {question.options.map((option) => (
                                <div
                                  key={option._id}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={option._id}
                                    id={option._id}
                                  />
                                  <Label
                                    htmlFor={option._id}
                                    className="font-normal"
                                  >
                                    {option.text}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}

                        {(question.type === "short-answer" ||
                          question.type === "essay") && (
                          <Textarea
                            value={answer?.textAnswer || ""}
                            onChange={(e) =>
                              updateAnswer(question, {
                                textAnswer: e.target.value,
                              })
                            }
                            className="mt-2"
                            placeholder="Enter student's answer"
                          />
                        )}

                        <div className="mt-4">
                          <Label htmlFor={`marks-${question._id}`}>
                            Marks Awarded (max: {question.maxMarks})
                          </Label>
                          <Input
                            id={`marks-${question._id}`}
                            type="number"
                            min="0"
                            max={question.maxMarks}
                            value={answer?.marksAwarded || 0}
                            onChange={(e) =>
                              updateAnswer(question, {
                                marksAwarded: Math.min(
                                  parseInt(e.target.value) || 0,
                                  question.maxMarks
                                ),
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                    Save Answers
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
