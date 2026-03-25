import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import type { Subscriber } from "../../backend";
import { useActor } from "../../hooks/useActor";

export default function AdminSubscribers() {
  const { actor } = useActor();
  const qc = useQueryClient();

  const { data: subscribers = [] } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: () => actor!.getAllSubscribers(),
    enabled: !!actor,
  });

  const del = useMutation({
    mutationFn: (id: bigint) => actor!.deleteSubscriber(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-subscribers"] });
      toast.success("Removed");
    },
    onError: () => toast.error("Error"),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-black text-foreground uppercase text-2xl tracking-tight">
          Subscribers
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="bg-card border border-gold rounded-sm px-4 py-2 flex items-center gap-3">
            <Users size={18} className="text-gold" />
            <span className="font-display font-bold text-foreground">
              {subscribers.length}
            </span>
            <span className="text-muted-foreground text-sm">
              total subscriber{subscribers.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {subscribers.map((s: Subscriber) => (
          <div
            key={s.id.toString()}
            className="bg-card border border-border rounded-sm p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-display font-semibold text-foreground">
                {s.email}
              </div>
              <div className="text-muted-foreground text-xs">
                Subscribed{" "}
                {new Date(
                  Number(s.subscribedAt) / 1_000_000,
                ).toLocaleDateString()}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => del.mutate(s.id)}
              className="text-muted-foreground hover:text-crimson"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        {subscribers.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No subscribers yet.
          </p>
        )}
      </div>
    </div>
  );
}
