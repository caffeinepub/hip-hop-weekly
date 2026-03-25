import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Music } from "lucide-react";
import type { BeatChartEntry, ProducerTip } from "../backend";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const SAMPLE_BEATS: BeatChartEntry[] = [
  {
    id: 1n,
    rank: 1n,
    title: "Midnight Cipher",
    producer: "Hit-Boy",
    bpm: 90n,
    genre: "Boom Bap",
    audioLink: "https://soundcloud.com",
    isActive: true,
  },
  {
    id: 2n,
    rank: 2n,
    title: "Street Chronicles",
    producer: "Metro Boomin",
    bpm: 140n,
    genre: "Trap",
    audioLink: "https://soundcloud.com",
    isActive: true,
  },
  {
    id: 3n,
    rank: 3n,
    title: "Soul Sampler",
    producer: "No I.D.",
    bpm: 85n,
    genre: "Soul Trap",
    audioLink: "https://soundcloud.com",
    isActive: true,
  },
  {
    id: 4n,
    rank: 4n,
    title: "Concrete Jungle",
    producer: "The Alchemist",
    bpm: 92n,
    genre: "Grimy",
    audioLink: "https://soundcloud.com",
    isActive: true,
  },
  {
    id: 5n,
    rank: 5n,
    title: "West Wind",
    producer: "DJ Dahi",
    bpm: 88n,
    genre: "G-Funk",
    audioLink: "https://soundcloud.com",
    isActive: true,
  },
];

const SAMPLE_TIPS: ProducerTip[] = [
  {
    id: 1n,
    tipTitle: "Chop Your Samples Differently",
    tipBody:
      "Most producers chop samples the same predictable way. Try starting chops on the offbeat or using the space between notes. The unexpected placement is what makes listeners do a double-take.",
    producerName: "The Alchemist",
    producerImageUrl: "",
    isPublished: true,
  },
  {
    id: 2n,
    tipTitle: "Less Is More in the Mix",
    tipBody:
      "New producers tend to layer too many sounds. Leave space in your frequencies. A beat with room to breathe hits harder than a cluttered one. If you're fighting for space, cut something.",
    producerName: "Madlib",
    producerImageUrl: "",
    isPublished: true,
  },
  {
    id: 3n,
    tipTitle: "Study Your Samples",
    tipBody:
      "Before you flip a record, listen to the whole album. Understand the feel, the key, the energy. The best flips come from producers who truly respect the source material.",
    producerName: "Pete Rock",
    producerImageUrl: "",
    isPublished: true,
  },
];

export default function Beats() {
  const { actor } = useActor();
  const { data: beats } = useQuery({
    queryKey: ["beat-charts"],
    queryFn: () => actor?.getAllActiveBeatChartEntries(),
    enabled: !!actor,
  });
  const { data: tips } = useQuery({
    queryKey: ["producer-tips"],
    queryFn: () => actor?.getAllPublishedProducerTips(),
    enabled: !!actor,
  });

  const displayBeats = beats && beats.length > 0 ? beats : SAMPLE_BEATS;
  const displayTips = tips && tips.length > 0 ? tips : SAMPLE_TIPS;
  const sortedBeats = [...displayBeats].sort(
    (a, b) => Number(a.rank) - Number(b.rank),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Beats to Rap On"
        subtitle="This week's best production, ranked"
      />

      <div className="bg-card border border-border rounded-sm mb-10 overflow-hidden">
        {sortedBeats.map((beat, idx) => (
          <div
            key={beat.id.toString()}
            className={
              "flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
            }
          >
            <div
              className={`font-display font-black text-2xl w-8 text-center flex-shrink-0 ${
                idx === 0
                  ? "text-gold"
                  : idx === 1
                    ? "text-muted-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {Number(beat.rank)}
            </div>
            <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center flex-shrink-0">
              <Music size={18} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground truncate">
                {beat.title}
              </div>
              <div className="text-gold text-sm">{beat.producer}</div>
            </div>
            <div className="hidden md:flex items-center gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="text-muted-foreground text-xs uppercase tracking-wider">
                  BPM
                </div>
                <div className="text-foreground font-display font-bold">
                  {Number(beat.bpm)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-xs uppercase tracking-wider">
                  Genre
                </div>
                <div className="text-foreground font-display font-bold text-sm">
                  {beat.genre}
                </div>
              </div>
            </div>
            {beat.audioLink && (
              <a
                href={beat.audioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-wider text-xs px-3 py-2 rounded transition-colors flex-shrink-0"
              >
                <ExternalLink size={12} /> LISTEN
              </a>
            )}
          </div>
        ))}
      </div>

      <SectionHeader title="Producer Tips" subtitle="Wisdom from the boards" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayTips.map((tip) => (
          <div
            key={tip.id.toString()}
            className="bg-card border border-border rounded-sm p-6 hover:border-gold-dark transition-colors"
          >
            <h3 className="font-display font-bold text-gold text-base mb-3 leading-tight">
              {tip.tipTitle}
            </h3>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              {tip.tipBody}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-gold font-display font-black text-sm">
                {tip.producerName.charAt(0)}
              </div>
              <span className="text-foreground font-display font-semibold text-sm">
                {tip.producerName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
