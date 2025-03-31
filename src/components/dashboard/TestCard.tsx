import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Test } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, Edit, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface TestCardProps {
  test: Test;
  onDelete: (id: string) => void;
}

export const TestCard = ({ test, onDelete }: TestCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/tests/${test._id}`);
  };

  const confirmDelete = () => {
    onDelete(test._id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="exam-card-gradient p-6 text-white">
          <h3 className="font-bold text-xl mb-1">{test.name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formatDate(test.date)}</span>
          </div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-muted-foreground mb-4 flex-1">
            {test.description || "No description provided"}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {test.questions.length} Questions
            </span>
            <span>
              Total: {test.questions.reduce((sum, q) => sum + q.maxMarks, 0)}{" "}
              marks
            </span>
          </div>
          <div className="flex gap-2 mt-auto">
            <Button variant="outline" className="flex-1" asChild>
              <Link to={`/answers/new?testId=${test._id}`}>
                <FileText className="mr-2 h-4 w-4" />
                Record Answers
              </Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/40"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the test "{test.name}" and all
              associated answers and reports. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
