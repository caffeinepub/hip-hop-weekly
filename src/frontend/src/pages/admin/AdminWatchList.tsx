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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SocialLink, WatchListEntry } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY: Omit<WatchListEntry, "id"> = {
  artistName: "",
  bio: "",
  imageUrl: "",
  socialLinks: [],
  isActive: false,
  updatedAt: BigInt(Date.now()),
};

export default function AdminWatchList() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WatchListEntry | null>(null);
  const [form, setForm] = useState<Omit<WatchListEntry, "id">>(EMPTY);
  const [linkInput, setLinkInput] = useState("");
  const [linkPlatform, setLinkPlatform] = useState("");

  const { data: entries = [] } = useQuery({
    queryKey: ["admin-watchlist"],
    queryFn: () => actor!.getAllWatchListEntries(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing) {
        await actor.updateWatchListEntry(editing.id, {
          ...form,
          id: editing.id,
        });
      } else {
        await actor.createWatchListEntry({ ...form, id: 0n });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-watchlist"] });
      qc.invalidateQueries({ queryKey: ["watch-list-active"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error saving"),
  });

  const _del = useMutation({
    mutationFn: (_id: bigint) => Promise.resolve(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-watchlist"] });
      toast.success("Deleted");
    },
  });

  const setActive = useMutation({
    mutationFn: (id: bigint) => actor!.setActiveWatchList(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-watchlist"] });
      qc.invalidateQueries({ queryKey: ["watch-list-active"] });
      toast.success("Set as active spotlight");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (e: WatchListEntry) => {
    setEditing(e);
    setForm({
      artistName: e.artistName,
      bio: e.bio,
      imageUrl: e.imageUrl,
      socialLinks: e.socialLinks,
      isActive: e.isActive,
      updatedAt: e.updatedAt,
    });
    setOpen(true);
  };

  const addLink = () => {
    if (!linkPlatform || !linkInput) return;
    setForm((p) => ({
      ...p,
      socialLinks: [
        ...p.socialLinks,
        { platform: linkPlatform, url: linkInput } as SocialLink,
      ],
    }));
    setLinkPlatform("");
    setLinkInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Watch List
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD ENTRY
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-foreground">
                {editing ? "Edit Entry" : "New Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Artist Name
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
                  Bio
                </Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  rows={4}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Image URL
                </Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Social Links
                </Label>
                {form.socialLinks.map((l, i) => (
                  <div
                    key={l.platform + l.url}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="text-gold font-semibold">
                      {l.platform}
                    </span>
                    <span className="text-muted-foreground truncate flex-1">
                      {l.url}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          socialLinks: p.socialLinks.filter((_, j) => j !== i),
                        }))
                      }
                      className="text-crimson hover:text-crimson-hover"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={linkPlatform}
                    onChange={(e) => setLinkPlatform(e.target.value)}
                    placeholder="Platform"
                    className="bg-secondary border-border w-28"
                  />
                  <Input
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="URL"
                    className="bg-secondary border-border flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={addLink}
                    variant="outline"
                    className="border-border"
                  >
                    Add
                  </Button>
                </div>
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
        {entries.map((e) => (
          <div
            key={e.id.toString()}
            className={`bg-card border rounded-sm p-4 flex items-center gap-4 ${e.isActive ? "border-gold" : "border-border"}`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground">
                {e.artistName}
              </div>
              <div className="text-muted-foreground text-sm truncate">
                {e.bio.slice(0, 80)}...
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActive.mutate(e.id)}
                className={
                  e.isActive
                    ? "text-gold"
                    : "text-muted-foreground hover:text-gold"
                }
                title="Set as active"
              >
                <Star size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEdit(e)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No entries yet.
          </p>
        )}
      </div>
    </div>
  );
}
