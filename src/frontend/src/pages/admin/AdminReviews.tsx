import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Review } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY: Omit<Review, "id"> = {
  artistName: "",
  songTitle: "",
  genre: "",
  rating: 3n,
  commentary: "",
  reviewerName: "",
  reviewedAt: BigInt(Date.now()),
  isPublished: false,
};
const GENRES = [
  "Boom Bap",
  "Trap",
  "Drill",
  "Conscious",
  "Cloud Rap",
  "G-Funk",
  "UK Rap",
  "Pop Rap",
  "Underground",
  "Other",
];

export default function AdminReviews() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState<Omit<Review, "id">>(EMPTY);

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => actor!.getAllPublishedReviews(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing)
        await actor.updateReview(editing.id, { ...form, id: editing.id });
      else await actor.createReview({ ...form, id: 0n });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Deleted");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, reviewedAt: BigInt(Date.now()) });
    setOpen(true);
  };
  const openEdit = (r: Review) => {
    setEditing(r);
    setForm({
      artistName: r.artistName,
      songTitle: r.songTitle,
      genre: r.genre,
      rating: r.rating,
      commentary: r.commentary,
      reviewerName: r.reviewerName,
      reviewedAt: r.reviewedAt,
      isPublished: r.isPublished,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Reviews
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD REVIEW
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-foreground">
                {editing ? "Edit Review" : "New Review"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Artist
                  </Label>
                  <Input
                    value={form.artistName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, artistName: e.target.value }))
                    }
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Song Title
                  </Label>
                  <Input
                    value={form.songTitle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, songTitle: e.target.value }))
                    }
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Genre
                  </Label>
                  <Select
                    value={form.genre}
                    onValueChange={(v) => setForm((p) => ({ ...p, genre: v }))}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Genre" />
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
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Rating (1-5)
                  </Label>
                  <Select
                    value={String(form.rating)}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, rating: BigInt(v) }))
                    }
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}{" "}
                          {[...Array(n)].map((_, starIdx) => (
                            <Star
                              key={String(n) + String(starIdx)}
                              size={10}
                              className="inline fill-gold text-gold"
                            />
                          ))}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Reviewer Name
                </Label>
                <Input
                  value={form.reviewerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reviewerName: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Commentary
                </Label>
                <Textarea
                  value={form.commentary}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, commentary: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isPublished: v }))
                  }
                />
                <Label className="text-sm text-foreground">Published</Label>
              </div>
              <Button
                onClick={() => save.mutate()}
                disabled={save.isPending}
                className="w-full bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest"
              >
                {save.isPending ? "Saving..." : "SAVE"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">
                {r.songTitle}{" "}
                <span className="text-gold text-sm">— {r.artistName}</span>
              </div>
              <div className="text-muted-foreground text-sm">
                {r.genre} • {"⭐".repeat(Number(r.rating))} •{" "}
                {r.isPublished ? (
                  <span className="text-gold">Published</span>
                ) : (
                  <span>Draft</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEdit(r)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => del.mutate(r.id)}
                className="text-muted-foreground hover:text-crimson"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
