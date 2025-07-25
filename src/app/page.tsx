
"use client";

import * as React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  BotMessageSquare,
  ChevronDown,
  Clock,
  Cpu,
  Info,
  LayoutDashboard,
  Siren,
  Users,
  Video,
  Wind,
  Map,
  Thermometer,
  Settings,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  type Zone,
  type Incident,
  type IncidentSeverity,
  type IncidentType,
  zones as initialZones,
  incidents as initialIncidents,
  waitTimeData,
  crowdDensityData,
} from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { WaitTimeChart } from "@/components/drishti/wait-time-chart";
import { CrowdDensityChart } from "@/components/drishti/crowd-density-chart";
import { IncidentsTable } from "@/components/drishti/incidents-table";
import { ZoneMap } from "@/components/drishti/zone-map";
import { IncidentRoutingTool } from "@/components/drishti/incident-routing-tool";
import { SmartLocationTool } from "@/components/drishti/smart-location-tool";
import { ReportIncidentForm } from "@/components/drishti/report-incident-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/actions/auth";

const DrishtiLogo = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M12 2.25C6.072 2.25 2.25 4.095 2.25 8.625V15.375C2.25 19.905 6.072 21.75 12 21.75C17.928 21.75 21.75 19.905 21.75 15.375V8.625C21.75 4.095 17.928 2.25 12 2.25Z"
      stroke="hsl(var(--accent))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z"
      stroke="hsl(var(--accent))"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type User = {
  uid: string;
  email?: string;
  name?: string;
  role?: string;
};


export default function Home() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [activeView, setActiveView] = React.useState("dashboard");
  const [zones, setZones] = React.useState<Zone[]>(initialZones);
  const [incidents, setIncidents] =
    React.useState<Incident[]>(initialIncidents);
  const [selectedZone, setSelectedZone] = React.useState<Zone | null>(zones[0]);
  const [isReportSheetOpen, setIsReportSheetOpen] = React.useState(false);
  const [mapView, setMapView] = React.useState<'normal' | 'heatmap'>('heatmap');
  
  React.useEffect(() => {
    getSession().then(({ user }) => {
        if (user) {
            setUser(user);
            if(user.role !== 'admin'){
                setActiveView('event-info');
            }
        } else {
            router.push('/login');
        }
    });
  }, [router]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/login');
  };

  const handleSelectZone = (zoneId: string) => {
    const zone = zones.find((z) => z.id === zoneId) || null;
    setSelectedZone(zone);
  };
  
  const addIncident = (newIncident: Omit<Incident, 'id' | 'timestamp'>) => {
    const incident: Incident = {
      ...newIncident,
      id: `INC${(incidents.length + 1).toString().padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
    }
    setIncidents(prev => [incident, ...prev]);
  }

  const handleReportIncident = (data: { type: IncidentType; severity: IncidentSeverity; location: string; }) => {
    addIncident({ ...data, status: 'New', assignedAgent: 'N/A'});
    setIsReportSheetOpen(false);
  }

  const PageHeader = () => (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold font-headline capitalize">
        {activeView.replace('-', ' ')}
      </h1>
      <div className="flex items-center gap-4">
        <Sheet open={isReportSheetOpen} onOpenChange={setIsReportSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Siren className="mr-2 h-4 w-4" /> Report Incident
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Report New Incident</SheetTitle>
              <SheetDescription>
                Fill in the details below to report a new incident. This will be added to the incident tracker.
              </SheetDescription>
            </SheetHeader>
            <div className="py-4">
                <ReportIncidentForm 
                    zones={zones} 
                    onSubmit={handleReportIncident} 
                    onClose={() => setIsReportSheetOpen(false)}
                />
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${user?.uid}`}
                  alt="User avatar"
                />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveView('settings')}>
                <Settings className="mr-2"/>
                Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2" />
                Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
  
  const NavButton = ({ view, icon, label }: { view: string, icon: React.ReactNode, label: string }) => (
    <Button
        variant={activeView === view ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveView(view)}
    >
        {icon}
        {label}
    </Button>
  )

  if (!user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
          <a href="#" className="flex items-center gap-2 font-semibold font-headline">
            <DrishtiLogo />
            <span>Drishti</span>
          </a>
        </div>
        <nav className="flex-1 space-y-1 p-4">
            {user.role === 'admin' ? (
                <>
                    <NavButton view="dashboard" icon={<LayoutDashboard className="mr-2 h-4 w-4" />} label="Dashboard" />
                    <NavButton view="zones" icon={<Users className="mr-2 h-4 w-4" />} label="Zones" />
                    <NavButton view="drones" icon={<Wind className="mr-2 h-4 w-4" />} label="Drones" />
                    <NavButton view="incident-reports" icon={<Siren className="mr-2 h-4 w-4" />} label="Incident Reports" />
                    <NavButton view="queue-management" icon={<Clock className="mr-2 h-4 w-4" />} label="Queue Management" />
                    <NavButton view="ai-insights" icon={<BotMessageSquare className="mr-2 h-4 w-4" />} label="AI Insights" />
                    <NavButton view="mock-drills" icon={<Cpu className="mr-2 h-4 w-4" />} label="Mock Drills" />
                </>
            ) : (
                <>
                    <NavButton view="incident-reports" icon={<Siren className="mr-2 h-4 w-4" />} label="Incident Reports" />
                </>
            )}
            <NavButton view="event-info" icon={<Info className="mr-2 h-4 w-4" />} label="Event Info" />
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <PageHeader />

            {activeView === 'dashboard' && user.role === 'admin' && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                     <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="font-headline">Venue Map</CardTitle>
                                <CardDescription>Real-time overview of crowd density and zone status.</CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="map-view-toggle" 
                                    checked={mapView === 'heatmap'}
                                    onCheckedChange={(checked) => setMapView(checked ? 'heatmap' : 'normal')}
                                />
                                <Label htmlFor="map-view-toggle">
                                    <span className="flex items-center">
                                    {mapView === 'heatmap' ? <Thermometer className="mr-2 h-4 w-4 text-red-500" /> : <Map className="mr-2 h-4 w-4" />}
                                    {mapView === 'heatmap' ? 'Heatmap View' : 'Normal View'}
                                    </span>
                                </Label>
                            </div>
                        </CardHeader>
                        <CardContent>
                           <ZoneMap zones={zones} onSelectZone={() => setActiveView('zones')} selectedZoneId={null} viewMode={mapView}/>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-headline">Incident Reports</CardTitle>
                             <Button variant="ghost" size="sm" onClick={() => setActiveView('incident-reports')}>More <ArrowRight className="ml-2 h-4 w-4"/></Button>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground mb-4">A brief overview of the latest incidents.</p>
                           <IncidentsTable data={incidents.slice(0,3)} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="font-headline">Drones</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setActiveView('drones')}>More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Live status of the drone fleet.</p>
                            <p>Drone summary coming soon.</p>
                        </CardContent>
                    </Card>
                    
                </div>
            )}
            
            {activeView === 'zones' && user.role === 'admin' && (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="font-headline">Zone Map</CardTitle>
                            <CardDescription>Live view of all operational zones.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                             <ZoneMap zones={zones} onSelectZone={handleSelectZone} selectedZoneId={selectedZone?.id} viewMode="heatmap" />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline">{selectedZone?.name || "Select a Zone"}</CardTitle>
                            <CardDescription>Details for the selected zone.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedZone ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>Occupancy</span>
                                        </div>
                                        <span className="font-medium">{selectedZone.occupancy} / {selectedZone.capacity}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>Avg. Wait Time</span>
                                        </div>
                                        <span className="font-medium">{selectedZone.waitTime} min</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <AlertTriangle className="h-4 w-4" />
                                            <span>Status</span>
                                        </div>
                                        <Badge variant={selectedZone.status === "Alert" ? "destructive" : "secondary"}>{selectedZone.status}</Badge>
                                    </div>
                                    <div>
                                        <h4 className="mb-2 mt-4 font-medium flex items-center gap-2 text-sm text-muted-foreground">
                                            <Video className="h-4 w-4" />
                                            <span>Camera Feeds</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedZone.cameraFeeds.map(feed => (
                                                <Image key={feed.id} src={feed.url} alt={feed.name} width={200} height={120} className="rounded-md object-cover" data-ai-hint="security camera" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <p>Select a zone on the map to see details.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="font-headline">Wait Times</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WaitTimeChart data={waitTimeData} />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle className="font-headline">Crowd Density</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <CrowdDensityChart data={crowdDensityData} />
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeView === 'drones' && user.role === 'admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Drones</CardTitle>
                        <CardDescription>Manage drone deployment and view live feeds.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Drone management interface coming soon.</p>
                    </CardContent>
                </Card>
            )}

            {activeView === 'incident-reports' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Incident Tracker</CardTitle>
                        <CardDescription>Real-time log of all reported incidents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IncidentsTable data={incidents} />
                    </CardContent>
                </Card>
            )}

            {activeView === 'queue-management' && user.role === 'admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Queue Management</CardTitle>
                        <CardDescription>Monitor queue lengths and get AI suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Queue management interface coming soon.</p>
                    </CardContent>
                </Card>
            )}

            {activeView === 'ai-insights' && user.role === 'admin' && (
                 <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Incident Routing Tool</CardTitle>
                            <CardDescription>AI-powered routing suggestions for incidents.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <IncidentRoutingTool />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Smart Location Suggestions</CardTitle>
                            <CardDescription>Generate alternative location suggestions for attendees.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <SmartLocationTool />
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeView === 'mock-drills' && user.role === 'admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Mock Drills</CardTitle>
                        <CardDescription>Simulate incidents and test response protocols.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Mock drill simulation interface coming soon.</p>
                    </CardContent>
                </Card>
            )}

            {activeView === 'event-info' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Event Information</CardTitle>
                        <CardDescription>General information about the event.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Event information page coming soon.</p>
                    </CardContent>
                </Card>
            )}
            
            {activeView === 'settings' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Settings</CardTitle>
                        <CardDescription>View your account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <p className="text-lg">{user.name}</p>
                        </div>
                        <div>
                            <Label>Email</Label>
                            <p className="text-lg">{user.email}</p>
                        </div>
                         <div>
                            <Label>Role</Label>
                            <p className="text-lg capitalize">{user.role}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

        </main>
      </div>
    </div>
  );
}
