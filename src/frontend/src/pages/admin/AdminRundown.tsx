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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RundownStory } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY: Omit<RundownStory, "id"> = {
  title: "",
  summary: "",
  contentBody: "",
  author: "",
  imageUrl: "",
  publishedAt: BigInt(Date.now()),
  isPublished: false,
};

export default function AdminRundown() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RundownStory | null>(null);
  const [form, setForm] = useState<Omit<RundownStory, "id">>(EMPTY);

  const { data: stories = [] } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: () => actor!.getAllRundownStories(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing) {
        await actor.updateRundownStory(editing.id, { ...form, id: editing.id });
      } else {
        await actor.createRundownStory({ ...form, id: 0n });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stories"] });
      qc.invalidateQueries({ queryKey: ["rundown-stories"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error saving"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteRundownStory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-stories"] });
      toast.success("Deleted");
    },
    onError: () => toast.error("Error deleting"),
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (s: RundownStory) => {
    setEditing(s);
    setForm({
      title: s.title,
      summary: s.summary,
      contentBody: s.contentBody,
      author: s.author,
      imageUrl: s.imageUrl,
      publishedAt: s.publishedAt,
      isPublished: s.isPublished,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Rundown Stories
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD STORY
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-foreground">
                {editing ? "Edit Story" : "New Story"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Title
                </Label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Author
                </Label>
                <Input
                  value={form.author}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, author: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Summary
                </Label>
                <Textarea
                  value={form.summary}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, summary: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  rows={2}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Content
                </Label>
                <Textarea
                  value={form.contentBody}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contentBody: e.target.value }))
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
        {stories.map((s) => (
          <div
            key={s.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground truncate">
                {s.title}
              </div>
              <div className="text-muted-foreground text-sm">
                {s.author} •{" "}
                {s.isPublished ? (
                  <span className="text-gold">Published</span>
                ) : (
                  <span className="text-muted-foreground">Draft</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEdit(s)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => del.mutate(s.id)}
                className="text-muted-foreground hover:text-crimson"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {stories.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No stories yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
