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
import {
  batches,
  chapters,
  courses,
  exams,
  maxMarksOptions,
  subjects,
  topics,
} from "@/lib/constants";
import { QuestionCategory } from "@/lib/enum";
import { Question, Test } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
      course: "",
      batch: "",
      exam: "",
      totalMarks: 0,
    }
  );

  const [errors, setErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const totalMarks = test.questions.reduce((sum, q) => sum + q.maxMarks, 0);
    setTest((prev) => ({ ...prev, totalMarks }));
  }, [test.questions]);

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...test.questions];
    updated[index] = { ...updated[index], ...updates };
    setTest({ ...test, questions: updated });
  };

  const handleAddQuestion = () => {
    setTest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          subject: "",
          chapter: "",
          topic: "",
          category: "" as QuestionCategory,
          maxMarks: 4,
        },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = test.questions.filter((_, i) => i !== index);
    setTest((prev) => ({ ...prev, items: updated }));
  };

  const validate = () => {
    const newErrors: { [key: number]: string } = {};
    const seen = new Set<string>();

    test.questions.forEach((entry, idx) => {
      if (!entry.subject || !entry.chapter || !entry.topic || !entry.category) {
        newErrors[idx] = "All fields are required";
      } else {
        const key = `${entry.subject}-${entry.chapter}-${entry.topic}-${entry.category}`;
        if (seen.has(key)) {
          newErrors[idx] = "Duplicate question entry";
        } else {
          seen.add(key);
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(test);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="test-name">Test Name</Label>
            <Input
              id="test-name"
              value={test.name}
              onChange={(e) => setTest({ ...test, name: e.target.value })}
              placeholder="e.g. Math Midterm Practice"
              required
            />
          </div>

          <div>
            <Label htmlFor="exam">Exam</Label>
            <Select
              value={test.exam}
              onValueChange={(value) => setTest({ ...test, exam: value })}
            >
              <SelectTrigger id="exam">
                <SelectValue placeholder="Select exam" />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam} value={exam}>
                    {exam}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="course">Course</Label>
            <Select
              value={test.course}
              onValueChange={(value) => setTest({ ...test, course: value })}
            >
              <SelectTrigger id="course">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="batch">Batch</Label>
            <Select
              value={test.batch}
              onValueChange={(value) => setTest({ ...test, batch: value })}
            >
              <SelectTrigger id="batch">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </div>

        <div className="text-right">
          <span className="font-medium">Total Marks: {test.totalMarks}</span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Questions</h3>
          <Button
            type="button"
            onClick={handleAddQuestion}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Question
          </Button>
        </div>

        <div>
          <div className="w-full overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead className="w-6 text-center">#</TableHead>
                  <TableHead className="w-[150px]">Subject</TableHead>
                  <TableHead className="min-w-[150px]">Chapter</TableHead>
                  <TableHead className="min-w-[150px]">Topic</TableHead>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="w-[80px] text-center">Max</TableHead>
                  <TableHead className="w-[100px] text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {test.questions.map((item, index) => (
                  <TableRow
                    key={`${item.topic}-${index}`}
                    className="odd:bg-white even:bg-gray-100 border-0"
                  >
                    <TableCell className="w-6 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Select
                        value={item.subject}
                        onValueChange={(v) =>
                          updateQuestion(index, {
                            subject: v,
                            chapter: "",
                            topic: "",
                          })
                        }
                      >
                        <SelectTrigger
                          className="truncate"
                          title={item.subject}
                        >
                          <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <Select
                        value={item.chapter}
                        onValueChange={(v) =>
                          updateQuestion(index, { chapter: v, topic: "" })
                        }
                      >
                        <SelectTrigger
                          className="truncate"
                          title={item.chapter}
                        >
                          <SelectValue placeholder="Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {(chapters[item.subject] || []).map((ch) => (
                            <SelectItem key={ch} value={ch}>
                              {ch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <Select
                        value={item.topic}
                        onValueChange={(v) =>
                          updateQuestion(index, { topic: v })
                        }
                      >
                        <SelectTrigger className="truncate" title={item.topic}>
                          <SelectValue placeholder="Topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {(topics[item.chapter] || []).map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Select
                        value={item.category}
                        onValueChange={(v) =>
                          updateQuestion(index, {
                            category: v as QuestionCategory,
                          })
                        }
                      >
                        <SelectTrigger
                          className="truncate"
                          title={item.category}
                        >
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(QuestionCategory).map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="w-[80px] text-center">
                      <Select
                        value={item.maxMarks.toString()}
                        onValueChange={(v) =>
                          updateQuestion(index, { maxMarks: +v })
                        }
                      >
                        <SelectTrigger
                          className="truncate"
                          title={item.maxMarks.toString()}
                        >
                          <SelectValue placeholder="Max" />
                        </SelectTrigger>
                        <SelectContent>
                          {maxMarksOptions.map((m) => (
                            <SelectItem key={m} value={m.toString()}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="w-[60px] text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveQuestion(index)}
                      >
                        <Trash2 className="text-red-500 w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {test.questions.length === 0 && (
              <div className="text-center p-3">
                <p className="text-muted-foreground">No questions added yet</p>
                <Button
                  className="mt-4"
                  type="button"
                  onClick={handleAddQuestion}
                >
                  Add Your First Question
                </Button>
              </div>
            )}
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm mt-2">
              {Object.entries(errors).map(([idx, msg]) => (
                <div key={idx}>
                  Row {+idx + 1}: {msg}
                </div>
              ))}
            </div>
          )}
        </div>
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
