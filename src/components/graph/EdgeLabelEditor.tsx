import * as React from "react";

import { useGraphStore } from "@/src/hooks/useGraphStore";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

export function EdgeLabelEditor() {
  const selectedEdgeId = useGraphStore((s) => s.selectedEdgeId);
  const setSelectedEdgeId = useGraphStore((s) => s.setSelectedEdgeId);
  const edges = useGraphStore((s) => s.edges);
  const updateEdgeLabel = useGraphStore((s) => s.updateEdgeLabel);

  const edge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;
  const [label, setLabel] = React.useState("");

  React.useEffect(() => {
    setLabel(edge?.label ?? "");
  }, [edge?.label, selectedEdgeId]);

  return (
    <Dialog open={!!selectedEdgeId} onOpenChange={(open) => !open && setSelectedEdgeId(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit relationship</DialogTitle>
        </DialogHeader>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="relates to / depends on / built on…" />
        <DialogFooter>
          <Button variant="outline" onClick={() => setSelectedEdgeId(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!selectedEdgeId) return;
              updateEdgeLabel(selectedEdgeId, label.trim());
              setSelectedEdgeId(null);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

