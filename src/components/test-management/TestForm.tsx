import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Option, Question, Test } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TestFormProps {
  readonly initialTest?: Test;
  readonly onSubmit: (test: Test) => void;
  readonly isSubmitting?: boolean;
}

export function TestForm({
  initialTest,
  onSubmit,
  isSubmitting = false,
}: TestFormProps) {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(
    initialTest ? new Date(initialTest.date) : new Date()
  );

  const [test, setTest] = useState<Test>(
    initialTest || {
      name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      questions: [],
    }
  );

  const addQuestion = () => {
    setTest({
      ...test,
      questions: [
        ...test.questions,
        {
          text: "",
          type: "multiple-choice",
          maxMarks: 1,
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    });
  };

  const updateQuestion = (index: number, question: Partial<Question>) => {
    const updatedQuestions = [...test.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...question };
    setTest({ ...test, questions: updatedQuestions });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...test.questions];
    updatedQuestions.splice(index, 1);
    setTest({ ...test, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...test.questions];
    const question = updatedQuestions[questionIndex];

    if (!question.options) {
      question.options = [];
    }

    question.options.push({
      text: "",
      isCorrect: false,
    });

    setTest({ ...test, questions: updatedQuestions });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    option: Partial<Option>
  ) => {
    const updatedQuestions = [...test.questions];
    const question = updatedQuestions[questionIndex];

    if (question.options) {
      question.options[optionIndex] = {
        ...question.options[optionIndex],
        ...option,
      };

      if (option.isCorrect) {
        question.options.forEach((opt, idx) => {
          if (idx !== optionIndex) {
            opt.isCorrect = false;
          }
        });
      }

      setTest({ ...test, questions: updatedQuestions });
    }
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...test.questions];
    const question = updatedQuestions[questionIndex];

    if (question.options) {
      question.options.splice(optionIndex, 1);
      setTest({ ...test, questions: updatedQuestions });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(test);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="space-y-4">
        <div>
          <Label htmlFor="test-name">Test Name</Label>
          <Input
            id="test-name"
            value={test.name}
            onChange={(e) => setTest({ ...test, name: e.target.value })}
            placeholder="Enter test name"
            required
          />
        </div>

        <div>
          <Label>Test Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  if (newDate) {
                    setTest({ ...test, date: format(newDate, "yyyy-MM-dd") });
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="test-description">Description</Label>
          <Textarea
            id="test-description"
            value={test.description}
            onChange={(e) => setTest({ ...test, description: e.target.value })}
            placeholder="Enter test description"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button
            type="button"
            onClick={addQuestion}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </div>

        {test.questions.length === 0 ? (
          <div className="text-center p-12 border rounded-lg">
            <p className="text-muted-foreground">No questions added yet</p>
            <Button className="mt-4" type="button" onClick={addQuestion}>
              Add Your First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {test.questions.map((question, questionIndex) => (
              <div key={question._id} className="p-6 border rounded-lg">
                <div className="flex justify-between mb-4">
                  <h4 className="font-medium">Question {questionIndex + 1}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`question-${questionIndex}`}>
                      Question Text
                    </Label>
                    <Textarea
                      id={`question-${questionIndex}`}
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(questionIndex, { text: e.target.value })
                      }
                      placeholder="Enter question text"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`question-type-${questionIndex}`}>
                        Question Type
                      </Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          updateQuestion(questionIndex, {
                            type: value as
                              | "multiple-choice"
                              | "short-answer"
                              | "essay",
                          })
                        }
                      >
                        <SelectTrigger id={`question-type-${questionIndex}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">
                            Multiple Choice
                          </SelectItem>
                          <SelectItem value="short-answer">
                            Short Answer
                          </SelectItem>
                          <SelectItem value="essay">Essay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`question-marks-${questionIndex}`}>
                        Marks
                      </Label>
                      <Input
                        id={`question-marks-${questionIndex}`}
                        type="number"
                        min="1"
                        value={question.maxMarks}
                        onChange={(e) =>
                          updateQuestion(questionIndex, {
                            maxMarks: parseInt(e.target.value) || 1,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {question.type === "multiple-choice" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Answer Options</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addOption(questionIndex)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Option
                        </Button>
                      </div>

                      {question.options && question.options.length > 0 ? (
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={option._id}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(questionIndex, optionIndex, {
                                    text: e.target.value,
                                  })
                                }
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                                required
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="radio"
                                    checked={option.isCorrect}
                                    onChange={() =>
                                      updateOption(questionIndex, optionIndex, {
                                        isCorrect: true,
                                      })
                                    }
                                    className="h-4 w-4"
                                  />
                                  <span className="text-sm">Correct</span>
                                </label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    removeOption(questionIndex, optionIndex)
                                  }
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No options added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              Save Test
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
