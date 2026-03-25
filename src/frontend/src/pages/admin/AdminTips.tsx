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
import type { ProducerTip } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY: Omit<ProducerTip, "id"> = {
  tipTitle: "",
  tipBody: "",
  producerName: "",
  producerImageUrl: "",
  isPublished: false,
};

export default function AdminTips() {
  const { actor } = useActor();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProducerTip | null>(null);
  const [form, setForm] = useState<Omit<ProducerTip, "id">>(EMPTY);

  const { data: tips = [] } = useQuery({
    queryKey: ["admin-tips"],
    queryFn: () => actor!.getAllPublishedProducerTips(),
    enabled: !!actor,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      if (editing)
        await actor.updateProducerTip(editing.id, { ...form, id: editing.id });
      else await actor.createProducerTip({ ...form, id: 0n });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tips"] });
      qc.invalidateQueries({ queryKey: ["producer-tips"] });
      toast.success("Saved");
      setOpen(false);
    },
    onError: () => toast.error("Error"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteProducerTip(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-tips"] });
      toast.success("Deleted");
    },
  });

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };
  const openEdit = (t: ProducerTip) => {
    setEditing(t);
    setForm({
      tipTitle: t.tipTitle,
      tipBody: t.tipBody,
      producerName: t.producerName,
      producerImageUrl: t.producerImageUrl,
      isPublished: t.isPublished,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Producer Tips
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="bg-crimson hover:bg-crimson-hover text-foreground font-display font-bold uppercase tracking-widest text-xs"
            >
              <Plus size={14} className="mr-2" /> ADD TIP
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display font-bold text-foreground">
                {editing ? "Edit Tip" : "New Tip"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tip Title
                </Label>
                <Input
                  value={form.tipTitle}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tipTitle: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Producer Name
                </Label>
                <Input
                  value={form.producerName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, producerName: e.target.value }))
                  }
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Tip Content
                </Label>
                <Textarea
                  value={form.tipBody}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tipBody: e.target.value }))
                  }
                  className="bg-secondary border-border"
                  rows={4}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Producer Image URL
                </Label>
                <Input
                  value={form.producerImageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, producerImageUrl: e.target.value }))
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
        {tips.map((t) => (
          <div
            key={t.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center gap-4"
          >
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">
                {t.tipTitle}
              </div>
              <div className="text-muted-foreground text-sm">
                {t.producerName} •{" "}
                {t.isPublished ? (
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
                onClick={() => openEdit(t)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => del.mutate(t.id)}
                className="text-muted-foreground hover:text-crimson"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {tips.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No tips yet.
          </p>
        )}
      </div>
    </div>
  );
}
