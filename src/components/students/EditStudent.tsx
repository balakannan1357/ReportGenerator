import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/types";
import { studentsApi } from "@/services/api.service";
import { Loader2, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const EditStudent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;

      try {
        setIsLoading(true);
        const data = await studentsApi.getById(studentId);
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student's data:", error);
        toast({
          title: "Student not found",
          description: "The requested student could not be found.",
          variant: "destructive",
        });
        navigate("/students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId, navigate, toast]);

  const handleUpdateStudent = async (e: FormEvent) => {
    e.preventDefault();
    if (!studentId) return;

    setIsSubmitting(true);

    try {
      await studentsApi.update(studentId, student);

      toast({
        title: "Student data updated",
        description: "Your student data has been successfully updated.",
        variant: "default",
      });

      navigate("/students");
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading student...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Student not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title={`Edit Student: ${student.name}`}
          subtitle="Update student details, questions, and answer options"
        />

        <div className="mt-8">
          <form onSubmit={handleUpdateStudent} className="form-container">
            <div className="space-y-4">
              <div>
                <Label htmlFor="student-name">Name</Label>
                <Input
                  id="student-name"
                  value={student.name}
                  placeholder="Enter student name"
                  onChange={(e) =>
                    setStudent({ ...student, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  value={student.email}
                  placeholder="Enter student email"
                  onChange={(e) =>
                    setStudent({ ...student, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="student-rollNum">Roll Number</Label>
                <Input
                  id="student-rollNum"
                  value={student.rollNum}
                  placeholder="Enter student roll number"
                  onChange={(e) =>
                    setStudent({ ...student, rollNum: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="student-email">Age</Label>
                <Input
                  id="student-age"
                  type="number"
                  value={student.age}
                  placeholder="Enter student age"
                  onChange={(e) =>
                    setStudent({ ...student, age: +e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end">
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
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
