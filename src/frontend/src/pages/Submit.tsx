import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Loader2, Music } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

const GENRES = [
  "Boom Bap",
  "Trap",
  "Drill",
  "Conscious",
  "Cloud Rap",
  "G-Funk",
  "UK Rap",
  "Afrobeats",
  "Other",
];

export default function Submit() {
  const { actor } = useActor();
  const [form, setForm] = useState({
    artistName: "",
    songTitle: "",
    genre: "",
    songLink: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    if (
      !form.artistName ||
      !form.songTitle ||
      !form.genre ||
      !form.songLink ||
      !form.contactEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    try {
      // Initiate Stripe checkout for $5 review fee
      const successUrl = `${window.location.origin}/submit?success=1`;
      const cancelUrl = `${window.location.origin}/submit?cancel=1`;
      const sessionUrl = await actor.createCheckoutSession(
        [
          {
            productName: "Song Review Fee",
            productDescription: "$5 fee for hip-hop track review",
            priceInCents: 500n,
            quantity: 1n,
            currency: "usd",
          },
        ],
        successUrl,
        cancelUrl,
      );
      if (sessionUrl?.startsWith("http")) {
        // Store form data in session storage so we can submit after payment
        sessionStorage.setItem("pendingSubmission", JSON.stringify(form));
        window.location.href = sessionUrl;
      } else {
        // Stripe not configured, submit directly
        await actor.createSongSubmission({
          id: 0n,
          ...form,
          submittedAt: BigInt(Date.now()),
          status: "pending",
          paymentStatus: "pending",
        });
        toast.success("Submission received! We'll be in touch.");
        setForm({
          artistName: "",
          songTitle: "",
          genre: "",
          songLink: "",
          contactEmail: "",
          contactPhone: "",
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SectionHeader
        title="Submit Your Track"
        subtitle="Get your music reviewed by our editorial team"
      />

      {/* Fee notice */}
      <div className="bg-card border-2 border-gold rounded-sm p-6 mb-8 flex items-center gap-5">
        <div className="w-14 h-14 bg-gold rounded-sm flex items-center justify-center flex-shrink-0">
          <DollarSign size={28} className="text-[oklch(0.10_0_0)]" />
        </div>
        <div>
          <div className="font-display font-black text-gold text-2xl">
            $5 REVIEW FEE
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            A $5 fee is required to have your track reviewed. Payment is
            processed securely via Stripe. Your submission will be queued
            immediately after checkout.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-sm p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
              Artist Name *
            </Label>
            <Input
              value={form.artistName}
              onChange={(e) => handleChange("artistName", e.target.value)}
              placeholder="Your artist name"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
              Song Title *
            </Label>
            <Input
              value={form.songTitle}
              onChange={(e) => handleChange("songTitle", e.target.value)}
              placeholder="Track name"
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
            Genre *
          </Label>
          <Select
            value={form.genre}
            onValueChange={(v) => handleChange("genre", v)}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
            Link to Song *
          </Label>
          <div className="relative">
            <Music
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={form.songLink}
              onChange={(e) => handleChange("songLink", e.target.value)}
              placeholder="SoundCloud, YouTube, Spotify..."
              className="bg-secondary border-border pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
              Contact Email *
            </Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="your@email.com"
              className="bg-secondary border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-display font-bold uppercase tracking-wider text-xs text-muted-foreground">
              Phone (Optional)
            </Label>
            <Input
              value={form.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-crimson hover:bg-crimson-hover text-foreground font-display font-black uppercase tracking-widest py-3 h-auto"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "PROCESSING..." : "SUBMIT & PAY $5"}
        </Button>
      </form>
    </div>
  );
}
