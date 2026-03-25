import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SectionHeader from "../components/SectionHeader";
import { useActor } from "../hooks/useActor";

export default function Subscribe() {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await actor.createSubscriber(email);
      setDone(true);
      toast.success("You're subscribed!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <SectionHeader title="Join the Movement" />

      <div className="bg-card border border-gold rounded-sm p-10 mt-8">
        <div className="w-16 h-16 bg-gold rounded-sm flex items-center justify-center mx-auto mb-6">
          <Mail size={32} className="text-[oklch(0.10_0_0)]" />
        </div>

        {done ? (
          <div>
            <h2 className="font-display font-black text-gold uppercase text-3xl tracking-tight mb-3">
              YOU'RE IN
            </h2>
            <p className="text-muted-foreground">
              Welcome to the Hip-Hop Weekly family. Expect your first issue in
              your inbox every Friday.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display font-black text-foreground uppercase text-3xl tracking-tight mb-3">
              GET THE WEEKLY DROP
            </h2>
            <p className="text-muted-foreground mb-8">
              Every Friday, the most important stories in hip-hop land in your
              inbox — curated, unfiltered, and free.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-black uppercase tracking-widest px-8 h-10"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "SUBSCRIBE"
                )}
              </Button>
            </form>
            <p className="text-muted-foreground text-xs mt-4">
              No spam. Unsubscribe any time. 100% free.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
