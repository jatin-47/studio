import { Zone, Incident, CrowdDensity } from "./types";

export const zones: Zone[] = [
  {
    id: "zone-a",
    name: "Zone A: Main Entrance",
    occupancy: 250,
    capacity: 500,
    waitTime: 15,
    status: "Busy",
    crowdDensity: "High",
    cameraFeeds: [
      { id: "cam-a1", name: "Gate 1", url: "https://placehold.co/400x250" },
      { id: "cam-a2", name: "Corridor A", url: "https://placehold.co/400x250" },
    ],
    position: { gridColumn: "1 / 3", gridRow: "1 / 2" },
  },
  {
    id: "zone-b",
    name: "Zone B: Stage Area",
    occupancy: 850,
    capacity: 1000,
    waitTime: 5,
    status: "Normal",
    crowdDensity: "High",
    cameraFeeds: [
      { id: "cam-b1", name: "Stage Left", url: "https://placehold.co/400x250" },
      { id: "cam-b2", name: "Stage Right", url: "https://placehold.co/400x250" },
    ],
     position: { gridColumn: "3 / 5", gridRow: "1 / 3" },
  },
  {
    id: "zone-c",
    name: "Zone C: Food Court",
    occupancy: 450,
    capacity: 600,
    waitTime: 25,
    status: "Alert",
    crowdDensity: "Critical",
    cameraFeeds: [
      { id: "cam-c1", name: "Vendor Alley", url: "https://placehold.co/400x250" },
      { id: "cam-c2", name: "Seating Area", url: "https://placehold.co/400x250" },
    ],
     position: { gridColumn: "1 / 3", gridRow: "2 / 4" },
  },
  {
    id: "zone-d",
    name: "Zone D: Exhibition Hall",
    occupancy: 120,
    capacity: 800,
    waitTime: 2,
    status: "Normal",
    crowdDensity: "Low",
    cameraFeeds: [
      { id: "cam-d1", name: "Hall Entrance", url: "https://placehold.co/400x250" },
      { id: "cam-d2", name: "Exhibit 4", url: "https://placehold.co/400x250" },
    ],
    position: { gridColumn: "3 / 5", gridRow: "3 / 4" },
  },
];

export const incidents: Incident[] = [
  {
    id: "INC001",
    type: "Medical",
    severity: "High",
    status: "Investigating",
    location: "Zone C",
    timestamp: "2023-10-27T10:00:00Z",
    assignedAgent: "Agent 03",
  },
  {
    id: "INC002",
    type: "Lost Item",
    severity: "Low",
    status: "Resolved",
    location: "Zone A",
    timestamp: "2023-10-27T10:05:00Z",
    assignedAgent: "Agent 01",
  },
  {
    id: "INC003",
    type: "Security",
    severity: "Critical",
    status: "New",
    location: "Zone B",
    timestamp: "2023-10-27T10:15:00Z",
    assignedAgent: "N/A",
  },
  {
    id: "INC004",
    type: "Technical",
    severity: "Medium",
    status: "Resolved",
    location: "Zone D",
    timestamp: "2023-10-27T09:30:00Z",
    assignedAgent: "Tech-02",
  },
];

export const waitTimeData = [
    { name: 'Zone A', waitTime: 15 },
    { name: 'Zone B', waitTime: 5 },
    { name: 'Zone C', waitTime: 25 },
    { name: 'Zone D', waitTime: 2 },
];

export const crowdDensityData = [
    { name: 'Low', value: 1, fill: 'hsl(var(--chart-3))' },
    { name: 'Medium', value: 0, fill: 'hsl(var(--chart-4))' },
    { name: 'High', value: 2, fill: 'hsl(var(--chart-2))' },
    { name: 'Critical', value: 1, fill: 'hsl(var(--destructive))' },
];
