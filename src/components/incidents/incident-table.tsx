import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { Card } from "@/components/ui/card";
  
  const incidents = [
    { id: 'INC-001', type: 'Medical', status: 'Active', reportedAt: '2024-07-21 14:30', assignedTo: 'Med-Team 1' },
    { id: 'INC-002', type: 'Security', status: 'Resolved', reportedAt: '2024-07-21 14:15', assignedTo: 'Sec-Team 3' },
    { id: 'INC-003', type: 'Lost Item', status: 'Pending', reportedAt: '2024-07-21 14:45', assignedTo: 'Info Desk' },
    { id: 'INC-004', type: 'Technical', status: 'Active', reportedAt: '2024-07-21 14:50', assignedTo: 'Tech-Support' },
    { id: 'INC-005', type: 'Security', status: 'Active', reportedAt: '2024-07-21 15:02', assignedTo: 'Sec-Team 1' },
  ];
  
  export function IncidentTable() {
    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
          case 'Active':
            return 'destructive';
          case 'Resolved':
            return 'default';
          case 'Pending':
            return 'secondary';
          default:
            return 'outline';
        }
      };
  
    return (
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported At</TableHead>
              <TableHead>Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.id}</TableCell>
                <TableCell>{incident.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(incident.status)}>{incident.status}</Badge>
                </TableCell>
                <TableCell>{incident.reportedAt}</TableCell>
                <TableCell>{incident.assignedTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
  }
  