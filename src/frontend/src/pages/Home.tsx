import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Review, RundownStory, WatchListEntry } from "../backend";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const SAMPLE_STORIES: RundownStory[] = [
  {
    id: 1n,
    title: "Kendrick's New Album Drops Surprise Track",
    summary:
      "The Compton rapper surprised fans with an unannounced bonus track, sending the internet into a frenzy.",
    contentBody: "",
    author: "Staff Writer",
    imageUrl: "",
    publishedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 2n,
    title: "NYC Underground Collective Breaks Streaming Records",
    summary:
      "A Brooklyn-based collective hits 10M streams independently, proving the underground still has power.",
    contentBody: "",
    author: "Staff Writer",
    imageUrl: "",
    publishedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 3n,
    title: "Metro Boomin Signs Landmark New Label Deal",
    summary:
      "The super producer inks a multi-album deal that could reshape the Atlanta sound for years to come.",
    contentBody: "",
    author: "Staff Writer",
    imageUrl: "",
    publishedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 4n,
    title: "East Coast vs. West Coast: The Streaming Wars Revisited",
    summary:
      "New data shows regional streaming preferences are shifting dramatically in 2025.",
    contentBody: "",
    author: "Analytics Desk",
    imageUrl: "",
    publishedAt: BigInt(Date.now()),
    isPublished: true,
  },
];

const SAMPLE_WATCH: WatchListEntry = {
  id: 1n,
  artistName: "ROME SAVANT",
  bio: "Brooklyn lyricist known for his razor-sharp wordplay and cinematic storytelling. His latest project has the underground buzzing with talk of a mainstream breakthrough.",
  imageUrl: "",
  socialLinks: [],
  isActive: true,
  updatedAt: BigInt(Date.now()),
};

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1n,
    artistName: "Lil Durk",
    songTitle: "Streets Callin'",
    genre: "Drill",
    rating: 4n,
    commentary: "Raw emotion meets trap precision.",
    reviewerName: "DJ Styles",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 2n,
    artistName: "JID",
    songTitle: "Never Settle",
    genre: "Conscious",
    rating: 5n,
    commentary: "Lyricism at its peak — a timeless record.",
    reviewerName: "Wordsmith",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 3n,
    artistName: "Flo Milli",
    songTitle: "Boss Up",
    genre: "Trap",
    rating: 4n,
    commentary: "High energy, unmatched confidence.",
    reviewerName: "Staff",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= rating ? "fill-gold text-gold" : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

export default function Home() {
  const { actor } = useActor();
  const { data: stories } = useQuery({
    queryKey: ["rundown-stories"],
    queryFn: () => actor?.getPublishedRundownStories(),
    enabled: !!actor,
  });
  const { data: watchList } = useQuery({
    queryKey: ["watch-list-active"],
    queryFn: () => actor?.getActiveWatchList(),
    enabled: !!actor,
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => actor?.getAllPublishedReviews(),
    enabled: !!actor,
  });

  const displayStories =
    stories && stories.length > 0 ? stories : SAMPLE_STORIES;
  const displayWatch = watchList?.artistName ? watchList : SAMPLE_WATCH;
  const displayReviews =
    reviews && reviews.length > 0 ? reviews : SAMPLE_REVIEWS;

  const issueNumber = 47;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-card border border-border rounded-sm p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0_0)] via-[oklch(0.14_0_0)_60%] to-transparent z-0" />
        <div className="relative z-10 max-w-2xl">
          <div className="text-gold font-display font-black text-xs uppercase tracking-widest mb-2">
            Issue #{issueNumber} — Week of{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <h1 className="font-display font-black text-foreground uppercase text-4xl md:text-6xl tracking-tighter leading-none mb-4">
            THE WEEKLY
            <br />
            <span className="text-gold">RUNDOWN</span>
          </h1>
          <p className="text-muted-foreground mb-6 max-w-lg">
            Your definitive guide to what's moving in hip-hop this week. News,
            drops, beefs, and breakouts — all in one place.
          </p>
          <Link
            to="/trending"
            className="inline-block bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-sm px-6 py-3 rounded transition-colors"
          >
            SEE TRENDING CHARTS
          </Link>
        </div>
      </div>

      {/* Weekly Stories */}
      <section className="mb-12">
        <SectionHeader title="This Week's Stories" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayStories.slice(0, 4).map((story) => (
            <div
              key={story.id.toString()}
              className="bg-card border border-border rounded-sm p-5 hover:border-gold-dark transition-colors"
            >
              <div className="text-gold font-display font-bold uppercase text-xs tracking-widest mb-2">
                {story.author}
              </div>
              <h3 className="font-display font-bold text-foreground text-lg leading-tight mb-2">
                {story.title}
              </h3>
              <p className="text-muted-foreground text-sm">{story.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE WATCH LIST PREVIEW */}
      <section className="mb-12">
        <SectionHeader
          title="THE WATCH LIST"
          subtitle="This week's featured artist spotlight"
        />
        <div className="bg-card border-2 border-gold rounded-sm p-8 flex flex-col md:flex-row gap-8 shadow-gold">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0 text-gold-muted font-display font-black text-4xl">
            {displayWatch.artistName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-gold font-display font-black text-3xl uppercase tracking-tight mb-2">
              {displayWatch.artistName}
            </div>
            <p className="text-muted-foreground mb-4 max-w-xl">
              {displayWatch.bio}
            </p>
            <Link
              to="/watch-list"
              className="inline-block bg-gold text-[oklch(0.10_0_0)] font-display font-bold uppercase tracking-widest text-xs px-5 py-2 rounded transition-opacity hover:opacity-90"
            >
              FULL PROFILE →
            </Link>
          </div>
        </div>
      </section>

      {/* Underground preview */}
      <section className="mb-12">
        <SectionHeader
          title="Underground Scene"
          subtitle="Who's hot by region this week"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["EAST COAST", "WEST COAST", "SOUTH", "MIDWEST"].map((region) => (
            <Link
              key={region}
              to="/underground"
              className="bg-card border border-border rounded-sm p-5 text-center hover:border-gold-dark transition-colors group"
            >
              <div className="font-display font-black text-foreground group-hover:text-gold uppercase tracking-tight text-sm md:text-base transition-colors">
                {region}
              </div>
              <div className="text-muted-foreground text-xs mt-1">
                See highlights →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="mb-12">
        <SectionHeader title="Latest Reviews" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayReviews.slice(0, 3).map((review) => (
            <div
              key={review.id.toString()}
              className="bg-card border border-border rounded-sm p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <StarRating rating={Number(review.rating)} />
                <span className="text-muted-foreground text-xs uppercase tracking-widest">
                  {review.genre}
                </span>
              </div>
              <div className="font-display font-bold text-foreground">
                {review.songTitle}
              </div>
              <div className="text-gold text-sm mb-2">{review.artistName}</div>
              <p className="text-muted-foreground text-sm">
                {review.commentary}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/reviews"
            className="text-gold font-display font-bold uppercase tracking-widest text-xs hover:text-foreground transition-colors"
          >
            VIEW ALL REVIEWS →
          </Link>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-card border border-gold rounded-sm p-8 text-center">
        <h3 className="font-display font-black text-foreground uppercase text-2xl tracking-tight mb-2">
          JOIN THE MOVEMENT
        </h3>
        <p className="text-muted-foreground mb-6">
          Get the weekly rundown delivered to your inbox every Friday.
        </p>
        <Link
          to="/subscribe"
          className="inline-block bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-sm px-8 py-3 rounded transition-colors"
        >
          SUBSCRIBE NOW — FREE
        </Link>
      </section>
    </div>
  );
}
