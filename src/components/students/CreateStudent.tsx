import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/types";
import { studentsApi } from "@/services/api.service";
import { Loader2, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateStudent() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [student, setStudent] = useState<Student>({
    rollNum: "",
    name: "",
    email: "",
    age: 10,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await studentsApi.create(student);
      toast({
        title: "Success",
        description: "Student created successfully.",
        variant: "default",
      });
      navigate("/students");
    } catch (error) {
      console.error("Error creating student:", error);
      toast({
        title: "Error",
        description: "Failed to create student.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="page-container">
        <PageHeader title="Create Student" />
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="form-container">
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
}
