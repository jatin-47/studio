import { PageHeader } from "@/components/page-header";
import { WeatherCard } from "@/components/dashboard/weather-card";
import { SocialCard } from "@/components/dashboard/social-card";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { QueueManagementCard } from "@/components/dashboard/queue-management-card";
import { EntryManagementCard } from "@/components/dashboard/entry-management-card";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-2">
          <WeatherCard />
        </div>
        <div className="lg:col-span-1 xl:col-span-2">
          <SocialCard />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
          <OverviewCards />
        </div>
        
        <div className="md:col-span-1 lg:col-span-2 xl:col-span-2">
          <QueueManagementCard />
        </div>

        <div className="md:col-span-1 lg:col-span-1 xl:col-span-2">
           <EntryManagementCard />
        </div>
      </div>
    </div>
  );
}
