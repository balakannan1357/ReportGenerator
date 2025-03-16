import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TestsPage from "./pages/TestsPage";
import CreateTestPage from "./pages/CreateTestPage";
import EditTestPage from "./pages/EditTestPage";
import AnswersPage from "./pages/AnswersPage";
import CreateAnswerPage from "./pages/CreateAnswerPage";
import ReportsPage from "./pages/ReportsPage";
import ViewReportPage from "./pages/ViewReportPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

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
