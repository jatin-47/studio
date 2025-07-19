import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function EntryManagementCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Entry Management</CardTitle>
            <CardDescription>Attendee flow and insights</CardDescription>
          </div>
          <BarChart3 className="h-6 w-6 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-3xl font-bold">14,289</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Entries/Hour</p>
                <p className="text-3xl font-bold">873</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
