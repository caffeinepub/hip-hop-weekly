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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BeatChartEntry } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY: Omit<BeatChartEntry, "id"> = {
  rank: 1n,
  title: "",
  producer: "",
  bpm: 90n,
  genre: "",
  audioLink: "",
  isActive: true,
};

export default function AdminBeats() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BeatChartEntry | null>(null);
  const [form, setForm] = useState<Omit<BeatChartEntry, "id">>(EMPTY);

  const { data: beats = [] } = useQuery({
    queryKey: ["admin-beats"],
    queryFn: () => actor!.getAllActiveBeatChartEntries(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing)
        await actor.updateBeatChartEntry(editing.id, {
          ...form,
          id: editing.id,
        });
      else await actor.createBeatChartEntry({ ...form, id: 0n });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-beats"] });
      qc.invalidateQueries({ queryKey: ["beat-charts"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteBeatChartEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-beats"] });
      toast.success("Deleted");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (b: BeatChartEntry) => {
    setEditing(b);
    setForm({
      rank: b.rank,
      title: b.title,
      producer: b.producer,
      bpm: b.bpm,
      genre: b.genre,
      audioLink: b.audioLink,
      isActive: b.isActive,
    });
    setOpen(true);
  };

  const sorted = [...beats].sort((a, b) => Number(a.rank) - Number(b.rank));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Beat Charts
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD BEAT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-foreground">
                {editing ? "Edit Beat" : "New Beat"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Rank
                  </Label>
                  <Input
                    type="number"
                    value={Number(form.rank)}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        rank: BigInt(e.target.value || 1),
                      }))
                    }
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    BPM
                  </Label>
                  <Input
                    type="number"
                    value={Number(form.bpm)}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        bpm: BigInt(e.target.value || 90),
                      }))
                    }
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
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
                  Producer
                </Label>
                <Input
                  value={form.producer}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, producer: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Genre
                </Label>
                <Input
                  value={form.genre}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, genre: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Audio Link
                </Label>
                <Input
                  value={form.audioLink}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, audioLink: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, isActive: v }))
                  }
                />
                <Label className="text-sm text-foreground">Active</Label>
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
      <div className="space-y-2">
        {sorted.map((b) => (
          <div
            key={b.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
          >
            <span className="font-display font-black text-gold text-xl w-8">
              {Number(b.rank)}
            </span>
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">
                {b.title}
              </div>
              <div className="text-muted-foreground text-sm">
                {b.producer} • {Number(b.bpm)} BPM • {b.genre}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEdit(b)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => del.mutate(b.id)}
                className="text-muted-foreground hover:text-crimson"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {beats.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No beats yet.
          </p>
        )}
      </div>
    </div>
  );
}
