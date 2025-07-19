import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Card } from "../ui/card";

const drones = [
  { id: 'EID-001', status: 'Deployed', battery: 85, location: 'Zone 1 - Main Stage' },
  { id: 'EID-002', status: 'Deployed', battery: 72, location: 'Zone 3 - Food Court' },
  { id: 'EID-003', status: 'Charging', battery: 100, location: 'Base Station' },
  { id: 'EID-004', status: 'Offline', battery: 0, location: 'Last seen: Zone 5' },
  { id: 'EID-005', status: 'Deployed', battery: 91, location: 'Perimeter Scan' },
  { id: 'EID-006', status: 'Returning', battery: 23, location: 'En route to Base' },
  { id: 'EID-007', status: 'Charging', battery: 68, location: 'Base Station' },
  { id: 'EID-008', status: 'Deployed', battery: 64, location: 'Zone 2 - Backstage' },
];

export function DroneTable() {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Deployed':
        return 'default';
      case 'Charging':
        return 'secondary';
      case 'Returning':
        return 'outline';
      case 'Offline':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBatteryColor = (value: number) => {
    if (value < 25) return "bg-red-500";
    if (value < 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Drone ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Battery</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drones.map((drone) => (
            <TableRow key={drone.id}>
              <TableCell className="font-medium">{drone.id}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(drone.status)}>{drone.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={drone.battery} className="w-24 h-2" indicatorClassName={getBatteryColor(drone.battery)} />
                  <span>{drone.battery}%</span>
                </div>
              </TableCell>
              <TableCell>{drone.location}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Telemetry</DropdownMenuItem>
                    <DropdownMenuItem>Recall Drone</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Report Issue</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
