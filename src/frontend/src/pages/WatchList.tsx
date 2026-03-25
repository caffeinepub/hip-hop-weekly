import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import type { WatchListEntry } from "../backend";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const SAMPLE: WatchListEntry = {
  id: 1n,
  artistName: "ROME SAVANT",
  bio: "Brooklyn-born lyricist Rome Savant has been quietly building one of the most impressive underground resumes in the game. Known for his razor-sharp wordplay, cinematic storytelling, and an uncanny ability to craft verses that feel like short films, Savant represents the true essence of hip-hop craft.\n\nHis latest project, released independently on Bandcamp, has been passed around in underground circles with the kind of reverence usually reserved for classics. With no major label backing and zero radio play, the buzz is entirely organic — driven by word of mouth from the most discerning heads in the culture.\n\nWatch for a potential mainstream breakthrough within the next 12 months.",
  imageUrl: "",
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "Twitter/X", url: "https://twitter.com" },
    { platform: "Bandcamp", url: "https://bandcamp.com" },
  ],
  isActive: true,
  updatedAt: BigInt(Date.now()),
};

export default function WatchList() {
  const { actor } = useActor();
  const { data: watchList, isLoading } = useQuery({
    queryKey: ["watch-list-active"],
    queryFn: () => actor?.getActiveWatchList(),
    enabled: !!actor,
  });

  const display = watchList?.artistName ? watchList : SAMPLE;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="THE WATCH LIST"
        subtitle="This week's featured artist — chosen by the editors"
      />

      <div className="bg-card border-2 border-gold rounded-sm overflow-hidden shadow-gold">
        {/* Top banner */}
        <div className="bg-gold px-8 py-3">
          <span className="font-display font-black text-[oklch(0.10_0_0)] uppercase tracking-widest text-xs">
            EDITOR'S SPOTLIGHT — ARTIST TO WATCH
          </span>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar / Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-sm bg-secondary flex items-center justify-center text-gold font-display font-black text-8xl border border-border">
                {display.artistName.charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="font-display font-black text-gold uppercase text-4xl md:text-6xl tracking-tighter leading-none mb-4">
                {display.artistName}
              </h1>

              <div className="space-y-3 mb-6">
                {display.bio.split("\n\n").map((para) => (
                  <p
                    key={para.slice(0, 30)}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>

              {display.socialLinks && display.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {display.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 border border-gold text-gold font-display font-bold uppercase tracking-widest text-xs px-4 py-2 rounded hover:bg-gold hover:text-[oklch(0.10_0_0)] transition-colors"
                    >
                      <ExternalLink size={12} />
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
