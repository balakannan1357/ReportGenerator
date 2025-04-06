import { Student, StudentAnswer, Test } from "@/lib/types";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import jsPDF from "jspdf";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ReportChartProps {
  readonly test: Test;
  readonly studentAnswer: StudentAnswer;
  readonly student: Student;
}

export type ChildRef = {
  generatePdf: () => void;
};

const ReportChart = forwardRef<ChildRef, ReportChartProps>(
  ({ studentAnswer, test, student }: ReportChartProps, ref) => {
    const categoryRef = useRef(null);
    const subjectRef = useRef(null);
    const topicRef = useRef(null);

    const categoryCanvasRef = useRef(null);
    const subjectCanvasRef = useRef(null);
    const topicCanvasRef = useRef(null);

    const [isExporting, setIsExporting] = useState(false);
    useEffect(() => {
      console.log("Exporting state changed:", isExporting);
    }, [isExporting]);

    useImperativeHandle(ref, () => ({
      generatePdf: generatePdf,
    }));

    const groupedData = useMemo(() => {
      const categoryMap = {};
      const subjectMap = {};
      const topicData = [];

      studentAnswer.answers.forEach(({ questionId, marksAwarded }) => {
        const { category, subject, topic, maxMarks } = test.questions.find(
          (question) => question._id === questionId
        );
        categoryMap[category] = categoryMap[category] || {
          max: 0,
          obtained: 0,
        };
        categoryMap[category].max += maxMarks;
        categoryMap[category].obtained += marksAwarded;

        subjectMap[subject] = subjectMap[subject] || 0;
        subjectMap[subject] += marksAwarded;

        topicData.push({ topic, max: maxMarks, obtained: marksAwarded });
      });

      return { categoryMap, subjectMap, topicData };
    }, [studentAnswer, test]);

    const categoryChartData = {
      labels: Object.keys(groupedData.categoryMap),
      datasets: [
        {
          label: "Max Marks",
          data: Object.values(groupedData.categoryMap).map((d: any) => d.max),
          backgroundColor: "#e2e8f0",
        },
        {
          label: "Obtained Marks",
          data: Object.values(groupedData.categoryMap).map(
            (d: any) => d.obtained
          ),
          backgroundColor: "#6366f1",
        },
      ],
    };

    const subjectPieData = {
      labels: Object.keys(groupedData.subjectMap),
      datasets: [
        {
          data: Object.values(groupedData.subjectMap),
          backgroundColor: ["#0ea5e9", "#10b981", "#f59e0b", "#ef4444"],
        },
      ],
    };

    const topicBarData = {
      labels: groupedData.topicData.map((d) => d.topic),
      datasets: [
        {
          label: "Max",
          data: groupedData.topicData.map((d) => d.max),
          backgroundColor: "#cbd5e1",
        },
        {
          label: "Obtained",
          data: groupedData.topicData.map((d) => d.obtained),
          backgroundColor: "#8b5cf6",
        },
      ],
    };

    const generateInsights = () => {
      const { totalMarks: obtainedMarks, answers } = studentAnswer;
      const { totalMarks } = test;
      const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(1);

      const subjectScores = answers.reduce(
        (acc, { questionId, marksAwarded }) => {
          const { subject } = test.questions.find(
            (question) => question._id === questionId
          );
          acc[subject] = (acc[subject] || 0) + marksAwarded;
          return acc;
        },
        {} as Record<string, number>
      );

      const weakest = Object.entries(subjectScores).sort(
        (a: any, b: any) => a[1] - b[1]
      )[0];
      const strongest = Object.entries(subjectScores).sort(
        (a: any, b: any) => b[1] - a[1]
      )[0];

      const categoryPerformance = answers.reduce(
        (acc, { questionId, marksAwarded }) => {
          const { category, maxMarks } = test.questions.find(
            (question) => question._id === questionId
          );
          if (!acc[category]) acc[category] = { obtained: 0, total: 0 };
          acc[category].obtained += marksAwarded;
          acc[category].total += maxMarks;
          return acc;
        },
        {} as Record<string, { obtained: number; total: number }>
      );

      const categoryInsights = Object.entries(categoryPerformance)
        .map(([category, { obtained, total }]: any) => {
          const perc = ((obtained / total) * 100).toFixed(1);
          return `  • ${category}: ${obtained} / ${total} (${perc}%)`;
        })
        .join("\n");

      const weakTopics =
        answers
          .filter(
            (answer) =>
              answer.marksAwarded <
              test.questions.find(
                (question) => question._id === answer.questionId
              ).maxMarks /
                2
          )
          .map(
            (answer) =>
              `  • ${
                test.questions.find(
                  (question) => question._id === answer.questionId
                ).topic
              }`
          )
          .join("\n") || "  • Good consistency across topics. Move on to next.";

      let motivation: string;
      if (+percentage >= 75) {
        motivation = "Excellent performance! Keep up the good work.";
      } else if (+percentage >= 50) {
        motivation = "Good effort, but there's room for improvement.";
      } else {
        motivation =
          "Needs significant improvement. Consider reviewing the material again.";
      }

      return {
        performanceSummary:
          `  • Total Score: ${obtainedMarks} / ${totalMarks} (${percentage}%)\n` +
          `  • Best Subject: ${strongest[0]} (${strongest[1]} marks)\n` +
          `  • Needs Improvement: ${weakest[0]} (${weakest[1]} marks)`,

        categoryPerformance: categoryInsights,

        focusTopics: weakTopics,

        suggestion: `  ${motivation}`,
      };
    };

    const generatePdf = async () => {
      setIsExporting(true);
      try {
        const pdf = new jsPDF("p", "mm", "a4", true);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        let yPosition = margin;

        // === Header Background ===
        pdf.setFillColor(0, 0, 0); // Black
        pdf.rect(0, 0, pageWidth, 30, "F");

        // === Header Title ===
        pdf.setFontSize(20);
        pdf.setTextColor(153, 27, 27); // Dark Red
        pdf.setFont("helvetica", "bold");
        pdf.text(student.name || "Student Report", pageWidth / 2, 20, {
          align: "center",
        });

        yPosition = 40;

        // === Info Section with Rounded Light Background ===
        const infoBoxHeight = 42;
        const borderRadius = 4;
        const boxX = margin - 2;
        const boxY = yPosition - 5;
        const boxWidth = pageWidth - 2 * boxX;

        pdf.setFillColor(243, 244, 246); // Gray-100
        pdf.roundedRect(
          boxX,
          boxY,
          boxWidth,
          infoBoxHeight,
          borderRadius,
          borderRadius,
          "F"
        );

        const drawStyledInfo = (label, value, x, y) => {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0); // Black text
          pdf.setFont("helvetica", "bold");
          pdf.text(`${label}:`, x, y);
          const labelWidth = pdf.getTextWidth(`${label}: `);
          pdf.setFont("helvetica", "normal");
          pdf.text(`${value}`, x + labelWidth + 1, y);
        };

        const sectionPaddingX = margin + 5;
        const sectionPaddingY = yPosition + 5;

        drawStyledInfo("Course", test.course, sectionPaddingX, sectionPaddingY);
        drawStyledInfo("Batch", test.batch, pageWidth / 2, sectionPaddingY);
        drawStyledInfo("Exam", test.exam, sectionPaddingX, sectionPaddingY + 8);
        drawStyledInfo("Date", test.date, pageWidth / 2, sectionPaddingY + 8);
        drawStyledInfo(
          "Total Marks",
          test.totalMarks,
          sectionPaddingX,
          sectionPaddingY + 16
        );
        drawStyledInfo(
          "Obtained Marks",
          studentAnswer.totalMarks,
          pageWidth / 2,
          sectionPaddingY + 16
        );
        drawStyledInfo(
          "Percentage",
          `${((studentAnswer.totalMarks / test.totalMarks) * 100).toFixed(2)}%`,
          sectionPaddingX,
          sectionPaddingY + 24
        );

        yPosition += infoBoxHeight + 10;

        const getChartImage = (chartRef) => {
          const chartInstance = chartRef.current;
          if (!chartInstance) return null;

          const canvas = chartInstance.canvas;

          return canvas ? canvas.toDataURL("image/png", 1.0) : null;
        };

        const addChartToPDF = (imageData, sectionTitle) => {
          if (!imageData) return;

          const imgProps = pdf.getImageProperties(imageData);
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          if (yPosition + imgHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.setTextColor(153, 27, 27);
          pdf.text(sectionTitle, margin, yPosition);
          yPosition += 6;
          pdf.setDrawColor(153, 27, 27);
          pdf.setLineWidth(0.5);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 6;

          pdf.addImage(
            imageData,
            "PNG",
            margin,
            yPosition,
            imgWidth,
            imgHeight
          );
          yPosition += imgHeight + 10;
        };

        addChartToPDF(getChartImage(categoryCanvasRef), "Category-wise Marks");
        addChartToPDF(
          getChartImage(subjectCanvasRef),
          "Subject-wise Marks Distribution"
        );
        addChartToPDF(getChartImage(topicCanvasRef), "Topic-wise Performance");

        // === Insights Section ===
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.setTextColor(153, 27, 27); // Dark red
        pdf.text("Performance Insights", margin, yPosition);
        yPosition += 6;

        pdf.setDrawColor(153, 27, 27);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Section titles in serif font, bold
        const sectionTitle = (title) => {
          pdf.setFont("times", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(title, margin, yPosition);
          yPosition += 6;
        };

        // Regular content in serif normal
        const sectionContent = (text) => {
          pdf.setFont("times", "normal");
          pdf.setFontSize(11);
          pdf.setTextColor(60, 60, 60);
          const lines = pdf.splitTextToSize(
            text.trim(),
            pageWidth - 2 * margin
          );
          pdf.text(lines, margin + 4, yPosition); // Indent content
          yPosition += lines.length * 5.5 + 4;
        };

        // === Inject insights ===
        const {
          performanceSummary,
          categoryPerformance,
          focusTopics,
          suggestion,
        } = generateInsights(); // already structured

        sectionTitle("Performance Summary:");
        sectionContent(performanceSummary);

        sectionTitle("Category-wise Performance:");
        sectionContent(categoryPerformance);

        sectionTitle("Topics to Focus On:");
        sectionContent(focusTopics);

        sectionTitle("Suggestion:");
        sectionContent(suggestion);

        // === Footer ===
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(100, 100, 100);
        pdf.text("Generated by Ascend Tech", pageWidth / 2, pageHeight - 10, {
          align: "center",
        });

        pdf.save(`${student.name}_ReportCard.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      } finally {
        setIsExporting(false);
      }
    };

    return (
      <div className="space-y-8 bg-white max-w-4xl mx-auto">
        <div ref={categoryRef} className=" bg-white p-4 ">
          <h3 className="text-lg font-semibold mb-2">Category-wise Marks</h3>
          <Bar
            ref={categoryCanvasRef}
            data={categoryChartData}
            options={{ responsive: true }}
          />
        </div>

        <div ref={subjectRef} className=" bg-white p-4 ">
          <h3 className="text-lg font-semibold mb-2">
            Subject-wise Marks Distribution
          </h3>
          <Pie
            ref={subjectCanvasRef}
            data={subjectPieData}
            options={{ responsive: true }}
          />
        </div>

        <div ref={topicRef} className=" bg-white p-4 ">
          <h3 className="text-lg font-semibold mb-2">Topic-wise Performance</h3>
          <Bar
            ref={topicCanvasRef}
            data={topicBarData}
            options={{ responsive: true }}
          />
        </div>
      </div>
    );
  }
);
export default ReportChart;
