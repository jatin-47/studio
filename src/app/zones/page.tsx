import { PageHeader } from "@/components/page-header";
import { ZoneCard } from "@/components/zones/zone-card";

const zones = [
  { id: 'zone-01', name: 'Main Stage Right', imageSrc: 'https://placehold.co/600x400', hint: 'concert crowd' },
  { id: 'zone-02', name: 'Main Stage Left', imageSrc: 'https://placehold.co/600x400', hint: 'concert stage' },
  { id: 'zone-03', name: 'Food Court Area', imageSrc: 'https://placehold.co/600x400', hint: 'food stalls' },
  { id: 'zone-04', name: 'Merchandise Tent', imageSrc: 'https://placehold.co/600x400', hint: 'event merchandise' },
  { id: 'zone-05', name: 'North Entrance', imageSrc: 'https://placehold.co/600x400', hint: 'event entrance' },
  { id: 'zone-06', name: 'VIP Lounge', imageSrc: 'https://placehold.co/600x400', hint: 'lounge area' },
];

export default function ZonesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Zone Monitoring" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {zones.map(zone => (
          <ZoneCard key={zone.id} zoneId={zone.id} zoneName={zone.name} imageSrc={zone.imageSrc} imageHint={zone.hint} />
        ))}
      </div>
    </div>
  );
}
