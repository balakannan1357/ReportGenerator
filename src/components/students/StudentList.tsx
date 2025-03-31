import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { Student } from "@/lib/types";
import { studentsApi } from "@/services/api.service";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../ui-components/PageHeader";
import { SectionHeader } from "../ui-components/SectionHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { StudentCard } from "./StudentCard";

export function StudentList() {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = students?.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const studentsData = await studentsApi.getAll();
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to load students.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await studentsApi.delete(id);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );
      toast({
        title: "Success",
        description: "Student deleted successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting student:", error);
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="page-container">
          <div className="flex items-center justify-center min-h-[400px]">
            <p>Loading Students data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Students"
          subtitle="Add, edit and manage your students data"
        />
        <SectionHeader
          title="Students"
          actions={
            <Button asChild>
              <Link to="/students/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Link>
            </Button>
          }
        />
        <div className="my-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student: Student) => (
              <StudentCard
                key={student._id}
                student={student}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No students found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? "Try a different search term or" : "Get started by"}{" "}
              <Link to="/students/new" className="text-primary hover:underline">
                creating a new student
              </Link>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
