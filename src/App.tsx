import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateStudent } from "./components/students/CreateStudent";
import { EditStudent } from "./components/students/EditStudent";
import { StudentList } from "./components/students/StudentList";
import AnswersPage from "./pages/AnswersPage";
import CreateAnswerPage from "./pages/CreateAnswerPage";
import CreateTestPage from "./pages/CreateTestPage";
import Dashboard from "./pages/Dashboard";
import EditTestPage from "./pages/EditTestPage";
import NotFound from "./pages/NotFound";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import TestsPage from "./pages/TestsPage";
import ViewReportPage from "./pages/ViewReportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/tests/new" element={<CreateTestPage />} />
          <Route path="/tests/:testId" element={<EditTestPage />} />
          <Route path="/answers" element={<AnswersPage />} />
          <Route path="/answers/new" element={<CreateAnswerPage />} />
          <Route path="/students" element={<StudentList />}></Route>
          <Route path="/students/new" element={<CreateStudent />} />
          <Route path="/students/:studentId" element={<EditStudent />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:answerId" element={<ViewReportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
