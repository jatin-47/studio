"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";

const queueData = [
  { name: "Main Entrance", length: 78 },
  { name: "VIP Gate", length: 34 },
  { name: "North Gate", length: 92 },
  { name: "West Gate", length: 55 },
];

export function QueueManagementCard() {
  const getProgressColor = (value: number) => {
    if (value > 85) return "bg-red-500";
    if (value > 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Queue Management</CardTitle>
            <CardDescription>Live crowd levels at entry points</CardDescription>
          </div>
          <Users className="h-6 w-6 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queueData.map((queue) => (
            <div key={queue.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-foreground">
                  {queue.name}
                </span>
                <span className="text-sm text-muted-foreground">{queue.length}% Full</span>
              </div>
              <Progress
                value={queue.length}
                className="h-2 [&>div]:bg-primary"
                indicatorClassName={getProgressColor(queue.length)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
