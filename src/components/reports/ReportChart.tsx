import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentAnswer, Test } from "@/lib/types";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ReportChartProps {
  readonly studentAnswer: StudentAnswer;
  readonly test: Test;
}

export function ReportChart({ studentAnswer, test }: ReportChartProps) {
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");

  // Prepare data for the charts
  const data = test.questions.map((question, index) => {
    const answer = studentAnswer.answers.find(
      (a) => a.questionId === question._id
    );
    return {
      name: `Q${index + 1}`,
      totalMarks: question.maxMarks,
      marksAwarded: answer?.marksAwarded || 0,
      percentage: answer
        ? Math.round((answer.marksAwarded / question.maxMarks) * 100)
        : 0,
    };
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DF0"];

  // Pie chart data
  const pieData = [
    { name: "Correct", value: studentAnswer.totalMarks },
    {
      name: "Incorrect",
      value:
        test.questions.reduce((sum, q) => sum + q.maxMarks, 0) -
        studentAnswer.totalMarks,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Performance Analysis</h3>
        <Select
          value={chartType}
          onValueChange={(value) => setChartType(value as any)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Bar Chart</SelectItem>
            <SelectItem value="line">Line Chart</SelectItem>
            <SelectItem value="pie">Pie Chart</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px] w-full p-4 border rounded-lg bg-white/60 backdrop-blur-sm">
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalMarks" name="Total Marks" fill="#8884d8" />
              <Bar dataKey="marksAwarded" name="Marks Awarded" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === "line" && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                name="Percentage"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
