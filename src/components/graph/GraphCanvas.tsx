"use client";

import * as React from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";

import { useGraphStore } from "@/src/hooks/useGraphStore";
import { useTheme } from "@/src/hooks/useTheme";
import { CustomNode } from "@/src/components/graph/CustomNode";
import { EdgeLabelEditor } from "@/src/components/graph/EdgeLabelEditor";
import { layoutForce, layoutHierarchical, layoutRadial } from "@/src/utils/graphLayout";

const nodeTypes = { pkbNode: CustomNode };

function buildConnectedSet(edges: { source: string; target: string }[], nodeId: string) {
  const s = new Set<string>([nodeId]);
  for (const e of edges) {
    if (e.source === nodeId) s.add(e.target);
    if (e.target === nodeId) s.add(e.source);
  }
  return s;
}

export function GraphCanvas() {
  const { theme } = useTheme();

  const hydrateIfEmpty = useGraphStore((s) => s.hydrateIfEmpty);
  const applyLayoutNodes = useGraphStore((s) => s.applyLayoutNodes);
  const rfNodes = useGraphStore((s) => s.rfNodes);
  const rfEdges = useGraphStore((s) => s.rfEdges);
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const search = useGraphStore((s) => s.search);
  const layout = useGraphStore((s) => s.layout);

  const onNodesChange = useGraphStore((s) => s.onNodesChange);
  const onEdgesChange = useGraphStore((s) => s.onEdgesChange);
  const connect = useGraphStore((s) => s.connect);
  const setSelectedNodeId = useGraphStore((s) => s.setSelectedNodeId);
  const setSelectedEdgeId = useGraphStore((s) => s.setSelectedEdgeId);
  const onNodeDragStopPersist = useGraphStore((s) => s.onNodeDragStop);

  const [rfInstance, setRfInstance] = React.useState<ReactFlowInstance | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    hydrateIfEmpty();
  }, [hydrateIfEmpty]);

  React.useEffect(() => {
    if (layout === "free") return;
    const el = containerRef.current;
    const width = el?.clientWidth ?? window.innerWidth;
    const height = el?.clientHeight ?? window.innerHeight;

    const next =
      layout === "force"
        ? layoutForce(nodes, edges, width, height)
        : layout === "hierarchical"
          ? layoutHierarchical(nodes, edges, width, height)
          : layout === "radial"
            ? layoutRadial(nodes, width, height)
            : nodes;

    applyLayoutNodes(next);
  }, [applyLayoutNodes, edges, layout, nodes]);

  const connected = React.useMemo(() => {
    if (!selectedNodeId) return null;
    return buildConnectedSet(edges, selectedNodeId);
  }, [edges, selectedNodeId]);

  const searchSet = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    const s = new Set<string>();
    for (const n of nodes) {
      if (n.data.title.toLowerCase().includes(q)) s.add(n.id);
    }
    return s.size ? s : null;
  }, [nodes, search]);

  React.useEffect(() => {
    if (!rfInstance) return;
    if (!searchSet) return;
    const first = nodes.find((n) => searchSet.has(n.id));
    if (!first) return;
    setSelectedNodeId(first.id);
    rfInstance.setCenter(first.position.x, first.position.y, { zoom: 1.2, duration: 450 });
  }, [nodes, rfInstance, searchSet, setSelectedNodeId]);

  const displayNodes: Node[] = React.useMemo(() => {
    if (!connected && !searchSet) return rfNodes;
    return rfNodes.map((n) => ({
      ...n,
      style: {
        ...(n.style as any),
        opacity: connected ? (connected.has(n.id) ? 1 : 0.25) : 1,
        outline: searchSet && searchSet.has(n.id) ? "2px solid hsl(var(--ring))" : undefined,
        outlineOffset: searchSet && searchSet.has(n.id) ? "2px" : undefined,
      },
    }));
  }, [connected, rfNodes, searchSet]);

  const displayEdges: Edge[] = React.useMemo(() => {
    if (!connected) return rfEdges;
    return rfEdges.map((e) => ({
      ...e,
      style:
        connected.has(e.source) && connected.has(e.target)
          ? e.style
          : { ...(e.style as any), opacity: 0.15 },
    }));
  }, [connected, rfEdges]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onInit={setRfInstance}
        onNodesChange={onNodesChange as any}
        onEdgesChange={onEdgesChange as any}
        onConnect={(c: Connection) => connect(c)}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onEdgeClick={(evt, edge) => {
          evt.stopPropagation();
          setSelectedEdgeId(edge.id);
        }}
        onPaneClick={() => setSelectedNodeId(null)}
        onNodeDragStop={(_, node) => onNodeDragStopPersist(node.id, node.position)}
        fitView
      >
        <Background
          color={theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}
        />
        <MiniMap
          nodeColor={theme === "dark" ? "#a1a1aa" : "#52525b"}
          maskColor={theme === "dark" ? "rgba(9,9,11,0.65)" : "rgba(255,255,255,0.6)"}
        />
        <Controls />
      </ReactFlow>

      <EdgeLabelEditor />
    </div>
  );
}

