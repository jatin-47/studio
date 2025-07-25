
export interface CameraFeed {
  id: string;
  name: string;
  url: string;
}

export type ZoneStatus = "Normal" | "Busy" | "Alert" | "Closed";
export type CrowdDensity = "Low" | "Medium" | "High" | "Critical";

export interface Zone {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  waitTime: number;
  status: ZoneStatus;
  crowdDensity: CrowdDensity;
  cameraFeeds: CameraFeed[];
  position: {
    gridColumn: string;
    gridRow: string;
  };
}

export type IncidentStatus = "New" | "Investigating" | "Resolved" | "Closed";
export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";
export type IncidentType = "Medical" | "Security" | "Lost Item" | "Technical" | "Other";

export interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: string;
  timestamp: string;
  assignedAgent: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff';
}
