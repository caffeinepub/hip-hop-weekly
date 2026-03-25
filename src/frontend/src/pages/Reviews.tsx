import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import type { Review } from "../backend";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 1n,
    artistName: "Kendrick Lamar",
    songTitle: "euphoria",
    genre: "West Coast",
    rating: 5n,
    commentary:
      "A career-defining diss record that will be studied for decades. Kendrick flexes every weapon in his arsenal — storytelling, metaphor, cadence — and delivers something that transcends the beef.",
    reviewerName: "DJ Styles",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 2n,
    artistName: "JID",
    songTitle: "Never Settle",
    genre: "Conscious Rap",
    rating: 5n,
    commentary:
      "JID at his most introspective. The production floats beneath bars so dense they reward repeated listens. A future classic for the culture.",
    reviewerName: "Wordsmith",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 3n,
    artistName: "Flo Milli",
    songTitle: "Never Losing",
    genre: "Pop Rap",
    rating: 4n,
    commentary:
      "Infectious confidence from start to finish. Flo Milli doesn't miss — the hook is stuck in your head for days.",
    reviewerName: "Staff Critic",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 4n,
    artistName: "Lil Durk",
    songTitle: "All My Life",
    genre: "Drill",
    rating: 4n,
    commentary:
      "Raw emotion and grit. Durk proves his longevity with a record that resonates far beyond the streets.",
    reviewerName: "Block Report",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 5n,
    artistName: "Billy Woods",
    songTitle: "Soft Landing",
    genre: "Underground",
    rating: 5n,
    commentary:
      "Woods continues to operate on a different plane. Abstract, dense, haunting — this is the kind of rap that makes you stop what you're doing.",
    reviewerName: "The Cipher",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
  {
    id: 6n,
    artistName: "Ice Spice",
    songTitle: "Deli",
    genre: "NY Drill",
    rating: 3n,
    commentary:
      "Short, snappy, and dripping in NY energy. Not the deepest lyricism but the vibe is undeniable.",
    reviewerName: "Street Report",
    reviewedAt: BigInt(Date.now()),
    isPublished: true,
  },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= rating
              ? "fill-gold text-gold"
              : "fill-none text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const { actor } = useActor();
  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => actor?.getAllPublishedReviews(),
    enabled: !!actor,
  });
  const displayReviews =
    reviews && reviews.length > 0 ? reviews : SAMPLE_REVIEWS;

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHeader
        title="Song Reviews"
        subtitle="Honest takes on the latest releases — reviewed by our team"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayReviews.map((review) => (
          <div
            key={review.id.toString()}
            className="bg-card border border-border rounded-sm p-6 hover:border-gold-dark transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-black text-foreground text-xl leading-tight">
                  {review.songTitle}
                </div>
                <div className="text-gold font-display font-semibold text-base">
                  {review.artistName}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarRating rating={Number(review.rating)} />
                <span className="text-muted-foreground text-xs uppercase tracking-wider">
                  {Number(review.rating)}/5
                </span>
              </div>
            </div>
            <div className="mb-4">
              <span className="bg-secondary text-muted-foreground font-display font-semibold uppercase tracking-widest text-xs px-2 py-1 rounded">
                {review.genre}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {review.commentary}
            </p>
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-gold font-display font-black text-xs">
                {review.reviewerName.charAt(0)}
              </div>
              <span className="text-muted-foreground text-xs">
                Reviewed by{" "}
                <span className="text-foreground">{review.reviewerName}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
