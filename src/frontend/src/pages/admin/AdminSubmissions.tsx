import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { SongSubmission } from "../../backend";
import { useActor } from "../../hooks/useActor";

const statusColors: Record<string, string> = {
  pending: "bg-secondary text-muted-foreground",
  reviewed: "bg-gold text-[oklch(0.10_0_0)]",
  rejected: "bg-crimson text-foreground",
};

export default function AdminSubmissions() {
  const { actor } = useActor();
  const qc = useQueryClient();

  const { data: submissions = [] } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: () => actor!.getAllSongSubmissions(),
    enabled: !!actor,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: string }) =>
      actor!.updateSubmissionStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Error"),
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteSongSubmission(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-submissions"] });
      toast.success("Deleted");
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Song Submissions
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {submissions.length} total submission
          {submissions.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="space-y-3">
        {submissions.map((s: SongSubmission) => (
          <div
            key={s.id.toString()}
            className="bg-card border border-border rounded-sm p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-display font-bold text-foreground">
                    {s.songTitle}
                  </span>
                  <span className="text-gold text-sm">by {s.artistName}</span>
                  <Badge
                    className={`text-xs ${statusColors[s.status] || statusColors.pending}`}
                  >
                    {s.status.toUpperCase()}
                  </Badge>
                  <Badge
                    className={`text-xs ${s.paymentStatus === "paid" ? "bg-green-900 text-green-300" : "bg-secondary text-muted-foreground"}`}
                  >
                    {s.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-muted-foreground text-sm">
                  {s.genre} • {s.contactEmail}
                </div>
                {s.songLink && (
                  <a
                    href={s.songLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold text-xs flex items-center gap-1 mt-1 hover:underline"
                  >
                    <ExternalLink size={10} /> {s.songLink}
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={s.status}
                  onValueChange={(v) =>
                    updateStatus.mutate({ id: s.id, status: v })
                  }
                >
                  <SelectTrigger className="bg-secondary border-border w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => del.mutate(s.id)}
                  className="text-muted-foreground hover:text-crimson text-xs"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No submissions yet.
          </p>
        )}
      </div>
    </div>
  );
}
