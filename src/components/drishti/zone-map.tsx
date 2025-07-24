
"use client";

import { cn } from "@/lib/utils";
import { type Zone, type CrowdDensity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ZoneMapProps {
  zones: Zone[];
  selectedZoneId: string | null | undefined;
  onSelectZone: (zoneId: string) => void;
  viewMode?: 'normal' | 'heatmap';
}

const getDensityColor = (density: CrowdDensity): string => {
  switch (density) {
    case "Low":
      return "bg-green-200/50 border-green-400 text-green-800";
    case "Medium":
      return "bg-yellow-200/50 border-yellow-400 text-yellow-800";
    case "High":
      return "bg-orange-200/50 border-orange-400 text-orange-800";
    case "Critical":
      return "bg-red-200/50 border-red-400 text-red-800";
    default:
      return "bg-gray-200/50 border-gray-400 text-gray-800";
  }
};

const getNormalColor = (): string => {
    return "bg-background border-border text-foreground";
}

export function ZoneMap({ zones, selectedZoneId, onSelectZone, viewMode = 'heatmap' }: ZoneMapProps) {
  return (
    <div className="relative aspect-[16/9] w-full">
      <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-2">
        {zones.map((zone) => (
          <button
            key={zone.id}
            onClick={() => onSelectZone(zone.id)}
            style={{
              gridColumn: zone.position.gridColumn,
              gridRow: zone.position.gridRow,
            }}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 p-2 text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              viewMode === 'heatmap' ? getDensityColor(zone.crowdDensity) : getNormalColor(),
              selectedZoneId === zone.id
                ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-lg"
                : "hover:shadow-md"
            )}
          >
            <p className="font-bold text-sm md:text-base">{zone.name.split(':')[0]}</p>
            <p className="text-xs md:text-sm">{zone.name.split(':')[1]}</p>
            <Badge className="mt-2" variant={viewMode === 'heatmap' ? 'default' : 'secondary' } style={{
                backgroundColor: viewMode === 'heatmap' ? '' : 'hsl(var(--secondary))',
                color: viewMode === 'heatmap' ? '' : 'hsl(var(--secondary-foreground))',
             }}>
                {zone.crowdDensity}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
