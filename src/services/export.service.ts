import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Student, StudentAnswer, Test } from "@/lib/types";

export const exportToPdf = async (
  studentAnswer: StudentAnswer,
  student: Student,
  test: Test,
  reportElement: HTMLElement
): Promise<void> => {
  try {
    // Create a new PDF document
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Add title
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${student.name}'s Test Report`, pageWidth / 2, 20, {
      align: "center",
    });

    // Add test information
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Test: ${test.name}`, 20, 30);
    pdf.text(`Date: ${studentAnswer.date}`, 20, 37);
    pdf.text(`Student ID: ${studentAnswer.studentId}`, 20, 44);

    // Add score information
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `Score: ${studentAnswer.totalMarks}/${test.questions.reduce(
        (sum, q) => sum + q.maxMarks,
        0
      )} (${studentAnswer.percentage}%)`,
      20,
      55
    );

    // Capture and add charts
    const canvas = await html2canvas(reportElement, {
      scale: 1,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pageWidth - 40; // 20mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the charts image
    pdf.addImage(imgData, "PNG", 20, 65, imgWidth, imgHeight);

    // Add a disclaimer at the bottom
    const bottomPosition = pdf.internal.pageSize.getHeight() - 10;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "Generated by Test Management System",
      pageWidth / 2,
      bottomPosition,
      { align: "center" }
    );

    // Save the PDF
    pdf.save(`${student.name.replace(/\s+/g, "_")}_Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
