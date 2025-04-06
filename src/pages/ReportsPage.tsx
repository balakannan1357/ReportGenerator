import { Layout } from "@/components/layout/Layout";
import { ReportList } from "@/components/reports/ReportList";
import { PageHeader } from "@/components/ui-components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { ReportCard } from "@/lib/types";
import { reportCardsApi } from "@/services/api.service";
import { useEffect, useState } from "react";

const ReportsPage = () => {
  const { toast } = useToast();
  const [reportCards, setReportCards] = useState<ReportCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const reportData = await reportCardsApi.getAll();
        setReportCards(reportData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <Layout>
      <div className="page-container">
        <PageHeader
          title="Student Reports"
          subtitle="View and generate student test reports"
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading reports...</p>
          </div>
        ) : (
          <div className="mt-8">
            <ReportList reportCards={reportCards} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
