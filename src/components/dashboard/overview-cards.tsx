import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane, Siren, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const overviewItems = [
  {
    title: "Active Incidents",
    value: "3",
    icon: Siren,
    href: "/incidents",
    color: "text-red-500",
  },
  {
    title: "Drones Deployed",
    value: "12 / 15",
    icon: Plane,
    href: "/drones",
    color: "text-blue-400",
  },
  {
    title: "Garbage Alerts",
    value: "2",
    icon: Trash2,
    href: "/zones",
    color: "text-yellow-500",
  },
];

export function OverviewCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {overviewItems.map((item) => (
        <Card
          key={item.title}
          className="hover:bg-card/80 transition-colors"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <Link href={item.href} className="text-xs text-muted-foreground hover:text-accent transition-colors flex items-center gap-1 mt-1">
              View Details <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
