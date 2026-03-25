import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionHeader from "../components/SectionHeader";

const trendingSongs = [
  { name: "Not Like Us", streams: 8.4 },
  { name: "HUMBLE.", streams: 7.1 },
  { name: "Big Steppa", streams: 6.8 },
  { name: "Gods Plan", streams: 6.2 },
  { name: "Rich Flex", streams: 5.9 },
  { name: "SICKO MODE", streams: 5.4 },
  { name: "Money Trees", streams: 5.1 },
];

const trendingArtists = [
  { day: "Mon", Kendrick: 82, Drake: 75, Travis: 60 },
  { day: "Tue", Kendrick: 88, Drake: 70, Travis: 65 },
  { day: "Wed", Kendrick: 91, Drake: 68, Travis: 72 },
  { day: "Thu", Kendrick: 85, Drake: 74, Travis: 69 },
  { day: "Fri", Kendrick: 95, Drake: 72, Travis: 78 },
  { day: "Sat", Kendrick: 100, Drake: 65, Travis: 85 },
  { day: "Sun", Kendrick: 93, Drake: 69, Travis: 80 },
];

const trendingTopics = [
  { topic: "West Coast Revival", score: 94 },
  { topic: "Drill Evolution", score: 87 },
  { topic: "Lyrical Renaissance", score: 82 },
  { topic: "Producer Collabs", score: 78 },
  { topic: "Label Deals", score: 71 },
  { topic: "Mixtape Season", score: 66 },
  { topic: "Battle Rap", score: 63 },
];

const GOLD = "oklch(0.75 0.12 85)";
const RED = "oklch(0.43 0.19 25)";
const TEAL = "oklch(0.60 0.10 200)";

export default function Trending() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Trending & Analytics"
        subtitle="Real-time pulse on what's moving in hip-hop this week"
      />

      {/* Trending Songs */}
      <div className="bg-card border border-border rounded-sm p-6 mb-8">
        <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg mb-4">
          Top Trending Songs This Week
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={trendingSongs}
            layout="vertical"
            margin={{ left: 20, right: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="oklch(0.20 0 0)"
              horizontal={false}
            />
            <XAxis
              type="number"
              unit="M"
              tick={{ fill: "oklch(0.70 0 0)", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "oklch(0.70 0 0)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(0.14 0 0)",
                border: "1px solid oklch(0.30 0.05 85)",
                borderRadius: 4,
              }}
              labelStyle={{ color: "oklch(0.96 0 0)", fontWeight: 700 }}
              itemStyle={{ color: GOLD }}
            />
            <Bar dataKey="streams" fill={GOLD} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trending Artists Over the Week */}
      <div className="bg-card border border-border rounded-sm p-6 mb-8">
        <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg mb-4">
          Artist Buzz Score — Week Over Week
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendingArtists} margin={{ right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.20 0 0)" />
            <XAxis
              dataKey="day"
              tick={{ fill: "oklch(0.70 0 0)", fontSize: 11 }}
            />
            <YAxis tick={{ fill: "oklch(0.70 0 0)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "oklch(0.14 0 0)",
                border: "1px solid oklch(0.30 0.05 85)",
                borderRadius: 4,
              }}
              labelStyle={{ color: "oklch(0.96 0 0)", fontWeight: 700 }}
            />
            <Legend wrapperStyle={{ color: "oklch(0.70 0 0)", fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="Kendrick"
              stroke={GOLD}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Drake"
              stroke={RED}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Travis"
              stroke={TEAL}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Trending Topics */}
      <div className="bg-card border border-border rounded-sm p-6">
        <h3 className="font-display font-bold text-foreground uppercase tracking-wide text-lg mb-6">
          Trending Topics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {trendingTopics.map((t, i) => (
            <div key={t.topic} className="flex items-center gap-4">
              <span className="text-gold font-display font-black text-2xl w-8 text-right">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-foreground font-display font-semibold text-sm">
                    {t.topic}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {t.score}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${t.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
