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
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { RegionEntry } from "../../backend";
import { useActor } from "../../hooks/useActor";

const SUBREGIONS = [
  "East Coast",
  "West Coast",
  "South",
  "Midwest",
  "International",
];
const EMPTY: Omit<RegionEntry, "id"> = {
  artistName: "",
  region: "US",
  subregion: "East Coast",
  country: "",
  description: "",
  imageUrl: "",
  isActive: true,
};

export default function AdminUnderground() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RegionEntry | null>(null);
  const [form, setForm] = useState<Omit<RegionEntry, "id">>(EMPTY);

  const { data: entries = [] } = useQuery({
    queryKey: ["admin-underground"],
    queryFn: () => actor!.getAllActiveRegionEntries(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing)
        await actor.updateRegionEntry(editing.id, { ...form, id: editing.id });
      else await actor.createRegionEntry({ ...form, id: 0n });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-underground"] });
      qc.invalidateQueries({ queryKey: ["region-entries"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteRegionEntry(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-underground"] });
      toast.success("Deleted");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (e: RegionEntry) => {
    setEditing(e);
    setForm({
      artistName: e.artistName,
      region: e.region,
      subregion: e.subregion,
      country: e.country,
      description: e.description,
      imageUrl: e.imageUrl,
      isActive: e.isActive,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Underground Scene
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD ARTIST
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
                  Region
                </Label>
                <Select
                  value={form.subregion}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      subregion: v,
                      region: v === "International" ? "International" : "US",
                    }))
                  }
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {SUBREGIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Country
                </Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, country: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  rows={3}
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
      <div className="space-y-3">
        {entries.map((e) => (
          <div
            key={e.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">
                {e.artistName}
              </div>
              <div className="text-muted-foreground text-sm">
                {e.subregion} • {e.country}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEdit(e)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => del.mutate(e.id)}
                className="text-muted-foreground hover:text-crimson"
              >
                <Trash2 size={14} />
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
