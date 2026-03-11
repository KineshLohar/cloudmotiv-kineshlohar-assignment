import * as React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { Pencil, Plus, Trash2 } from "lucide-react";

import type { PKBNodeData } from "@/src/types/graph";
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { useGraphStore } from "@/src/hooks/useGraphStore";

function toPosition(side: string) {
  switch (side) {
    case "top":
      return Position.Top;
    case "bottom":
      return Position.Bottom;
    case "left":
      return Position.Left;
    case "right":
      return Position.Right;
    default:
      return Position.Bottom;
  }
}

export const CustomNode = React.memo(function CustomNode(props: NodeProps<PKBNodeData>) {
  const { id, data, selected } = props;
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const deleteNode = useGraphStore((s) => s.deleteNode);

  const handles = data.handles ?? [];
  const notePreview = (data.note ?? "").trim().slice(0, 60);

  return (
    <div
      className={cn(
        "group relative",
        selected && "ring-2 ring-ring ring-offset-2 ring-offset-background rounded-lg"
      )}
      onClick={() => setSelectedNodeId(id)}
    >
      <Card className="min-w-[190px] max-w-[240px]">
        <CardHeader className="p-3">
          <div className="flex items-start gap-2">
            <div
              className="mt-0.5 h-3.5 w-3.5 rounded-sm border"
              style={{ backgroundColor: data.color ?? "transparent" }}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{data.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {notePreview || "No description"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Hover quick actions */}
      <div className="pointer-events-none absolute -top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          className="pointer-events-auto rounded border bg-background p-1 shadow-sm hover:bg-accent"
          title="Edit in sidebar"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNodeId(id);
          }}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          className="pointer-events-auto rounded border bg-background p-1 shadow-sm hover:bg-accent"
          title="Add handle (coming soon)"
          onClick={(e) => {
            e.stopPropagation();
            // handled in sidebar (later). keep affordance.
          }}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          className="pointer-events-auto rounded border bg-background p-1 shadow-sm hover:bg-accent"
          title="Delete node"
          onClick={(e) => {
            e.stopPropagation();
            deleteNode(id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Dynamic handles: render source + target at same side */}
      {handles.map((h) => (
        <React.Fragment key={h.id}>
          <Handle
            id={`${h.id}-s`}
            type="source"
            position={toPosition(h.side)}
            className="h-2.5! w-2.5! border-2! border-background! bg-primary!"
          />
          <Handle
            id={`${h.id}-t`}
            type="target"
            position={toPosition(h.side)}
            className="h-2.5! w-2.5! border-2! border-background! bg-secondary!"
          />
        </React.Fragment>
      ))}
    </div>
  );
});

