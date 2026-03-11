"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Crosshair, Plus, Trash2 } from "lucide-react";

import { useGraphStore } from "@/src/hooks/useGraphStore";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const SIDES = ["top", "right", "bottom", "left"] as const;

export function NodeSidebar() {
  const sidebarOpen = useGraphStore((s) => s.sidebarOpen);
  const setSidebarOpen = useGraphStore((s) => s.setSidebarOpen);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const updateNodeData = useGraphStore((s) => s.updateNodeData);
  const deleteNode = useGraphStore((s) => s.deleteNode);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);

  const node = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null;

  const connections = React.useMemo(() => {
    if (!selectedNodeId) return [];
    return edges
      .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
      .map((e) => ({
        ...e,
        otherId: e.source === selectedNodeId ? e.target : e.source,
        direction: e.source === selectedNodeId ? "out" : "in",
      }));
  }, [edges, selectedNodeId]);

  const [newHandleSide, setNewHandleSide] = React.useState<(typeof SIDES)[number]>("bottom");

  return (
    <aside
      className={[
        "h-full border-l bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all",
        sidebarOpen ? "w-[360px]" : "w-12",
      ].join(" ")}
    >
      <div className="h-14 border-b flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          {sidebarOpen ? <div className="font-semibold text-sm">Node</div> : null}
        </div>
      </div>

      {!sidebarOpen ? null : (
        <div className="p-3 space-y-4">
          {!node ? (
            <div className="text-sm text-muted-foreground">Select a node to edit details.</div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Title</div>
                <Input
                  value={node.data.title}
                  onChange={(e) => updateNodeData(node.id, { title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Note</div>
                <textarea
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={node.data.note ?? ""}
                  onChange={(e) => updateNodeData(node.id, { note: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Category</div>
                  <Input
                    value={node.data.category ?? ""}
                    onChange={(e) => updateNodeData(node.id, { category: e.target.value })}
                    placeholder="Framework / Concept…"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Color</div>
                  <input
                    type="color"
                    className="h-10 w-full rounded-md border border-input bg-background p-1"
                    value={node.data.color ?? "#6366f1"}
                    onChange={(e) => updateNodeData(node.id, { color: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Tags (comma-separated)</div>
                <Input
                  value={(node.data.tags ?? []).join(", ")}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean);
                    updateNodeData(node.id, { tags });
                  }}
                  placeholder="ui, frontend, state"
                />
              </div>

              <div className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Handles</div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      value={newHandleSide}
                      onChange={(e) => setNewHandleSide(e.target.value as any)}
                    >
                      {SIDES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const handles = node.data.handles ?? [];
                        const id = `${newHandleSide}-${handles.length + 1}`;
                        updateNodeData(node.id, { handles: handles.concat({ id, side: newHandleSide }) as any });
                      }}
                    >
                      <Plus />
                      Add
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Handles determine where edges can connect (top/bottom/left/right).
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="text-sm font-semibold mb-2">Connections ({connections.length})</div>
                {connections.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No connections yet.</div>
                ) : (
                  <div className="space-y-2">
                    {connections.map((e) => {
                      const other = nodes.find((n) => n.id === e.otherId);
                      return (
                        <button
                          key={e.id}
                          onClick={() => setSelectedNodeId(e.otherId)}
                          className="w-full text-left rounded-md border px-2 py-2 hover:bg-accent"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate font-medium">{other?.data.title ?? e.otherId}</div>
                            <div className="text-xs text-muted-foreground shrink-0">
                              {e.direction === "out" ? "→" : "←"} {e.label ?? "relates to"}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedNodeId(node.id)}>
                  <Crosshair />
                  Focus
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => deleteNode(node.id)}>
                  <Trash2 />
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}

