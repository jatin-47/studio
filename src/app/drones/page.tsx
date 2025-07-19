import { PageHeader } from "@/components/page-header";
import { DroneTable } from "@/components/drones/drone-table";

export default function DronesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Drone Management" />
      <DroneTable />
    </div>
  );
}
