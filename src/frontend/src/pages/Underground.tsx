import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { RegionEntry } from "../backend";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const SAMPLE_ENTRIES: RegionEntry[] = [
  {
    id: 1n,
    artistName: "Ransom",
    region: "US",
    subregion: "East Coast",
    country: "USA",
    description:
      "NJ battle rap legend with razor-sharp pen game. Latest tape is his best yet.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 2n,
    artistName: "Roc Marciano",
    region: "US",
    subregion: "East Coast",
    country: "USA",
    description:
      "Long Island's finest continues to push cinematic boom-bap to the underground faithful.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 3n,
    artistName: "Boldy James",
    region: "US",
    subregion: "Midwest",
    country: "USA",
    description:
      "Detroit's most consistent underground artist. His chemistry with producers is unmatched.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 4n,
    artistName: "Fly Anakin",
    region: "US",
    subregion: "South",
    country: "USA",
    description:
      "Richmond VA's finest putting the South on the underground map with raw lyricism.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 5n,
    artistName: "Gifted Gab",
    region: "US",
    subregion: "West Coast",
    country: "USA",
    description:
      "Seattle's underground queen with versatile flows and sharp social commentary.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 6n,
    artistName: "Ghetts",
    region: "International",
    subregion: "UK Grime/Rap",
    country: "UK",
    description:
      "London's most decorated MC continues to evolve the UK rap sound.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 7n,
    artistName: "Headie One",
    region: "International",
    subregion: "UK Drill",
    country: "UK",
    description: "North London drill pioneer bridging UK and US sounds.",
    imageUrl: "",
    isActive: true,
  },
  {
    id: 8n,
    artistName: "Koba LaD",
    region: "International",
    subregion: "French Rap",
    country: "France",
    description:
      "Paris drill trailblazer with massive influence across Europe.",
    imageUrl: "",
    isActive: true,
  },
];

const regions = [
  { label: "East Coast", value: "East Coast" },
  { label: "West Coast", value: "West Coast" },
  { label: "South", value: "South" },
  { label: "Midwest", value: "Midwest" },
  { label: "International", value: "International" },
];

function RegionGrid({ entries }: { entries: RegionEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-8 text-center">
        No artists featured for this region yet.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <div
          key={entry.id.toString()}
          className="bg-card border border-border rounded-sm p-5 hover:border-gold-dark transition-colors"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center text-gold font-display font-black text-xl flex-shrink-0">
              {entry.artistName.charAt(0)}
            </div>
            <div>
              <div className="font-display font-bold text-foreground text-base">
                {entry.artistName}
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">
                {entry.country}
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{entry.description}</p>
        </div>
      ))}
    </div>
  );
}

export default function Underground() {
  const { actor } = useActor();
  const { data: entries } = useQuery({
    queryKey: ["region-entries"],
    queryFn: () => actor?.getAllActiveRegionEntries(),
    enabled: !!actor,
  });
  const allEntries = entries && entries.length > 0 ? entries : SAMPLE_ENTRIES;

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Underground Scene by Region"
        subtitle="Who's hot in the underground this week, worldwide"
      />
      <Tabs defaultValue="East Coast">
        <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto">
          {regions.map((r) => (
            <TabsTrigger
              key={r.value}
              value={r.value}
              className="font-display font-bold uppercase tracking-wide text-xs data-[state=active]:bg-gold data-[state=active]:text-[oklch(0.10_0_0)]"
            >
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {regions.map((r) => (
          <TabsContent key={r.value} value={r.value}>
            <RegionGrid
              entries={allEntries.filter((e) =>
                r.value === "International"
                  ? e.region === "International"
                  : e.subregion === r.value,
              )}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
