import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ReportIncidentDialog } from "@/components/incidents/report-incident-dialog";
import { IncidentTable } from "@/components/incidents/incident-table";
import { PlusCircle } from "lucide-react";

export default function IncidentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Incident Reporting"
        actions={
          <ReportIncidentDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Report New Incident
            </Button>
          </ReportIncidentDialog>
        }
      />
      <IncidentTable />
    </div>
  );
}
