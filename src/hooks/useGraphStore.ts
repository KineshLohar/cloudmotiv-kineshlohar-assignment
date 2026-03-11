import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Connection, Edge, Node } from "reactflow";
import { MarkerType, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { v4 as uuid } from "uuid";

import type { GraphState, NodeHandle, PKBEdge, PKBNode } from "@/src/types/graph";
import { seedGraph } from "@/src/utils/seedGraph";
import type { LayoutMode } from "@/src/utils/graphLayout";

const LS_GRAPH_KEY = "pkb_graph_v2";

type GraphStructure = "knowledge" | "network" | "dependency" | "tree";

function defaultHandles(): NodeHandle[] {
  return [
    { id: "t", side: "top" },
    { id: "r", side: "right" },
    { id: "b", side: "bottom" },
    { id: "l", side: "left" },
  ];
}

function toRfNodes(nodes: PKBNode[]): Node[] {
  return nodes.map((n) => ({
    id: n.id,
    type: "pkbNode",
    position: n.position,
    data: n.data,
  }));
}

function toRfEdges(edges: PKBEdge[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle,
    targetHandle: e.targetHandle,
    label: e.label,
    animated: e.animated ?? false,
    markerEnd: e.directed ? { type: MarkerType.Arrow } : undefined,
    data: { directed: !!e.directed },
  }));
}

function fromRfNodes(nodes: Node[], prev: PKBNode[]): PKBNode[] {
  // Preserve PKB shape; primarily positions change during drag
  return nodes.map((n) => {
    const prevNode = prev.find((p) => p.id === n.id);
    return {
      id: n.id,
      position: n.position,
      data: (n.data as any) ?? prevNode?.data ?? { title: "Untitled", handles: defaultHandles() },
    };
  });
}

function fromRfEdges(edges: Edge[], prev: PKBEdge[]): PKBEdge[] {
  return edges.map((e) => {
    const prevEdge = prev.find((p) => p.id === e.id);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: (e as any).sourceHandle,
      targetHandle: (e as any).targetHandle,
      label: (e.label as any) ?? prevEdge?.label,
      directed: (e.data as any)?.directed ?? (e.markerEnd != null) ?? prevEdge?.directed,
      animated: e.animated ?? prevEdge?.animated,
      createdAt: prevEdge?.createdAt,
    };
  });
}

function edgeDefaultsForStructure(structure: GraphStructure) {
  switch (structure) {
    case "dependency":
      return { label: "depends on", directed: true };
    case "tree":
      return { label: "child of", directed: true };
    case "network":
      return { label: "relates to", directed: false };
    case "knowledge":
    default:
      return { label: "relates to", directed: false };
  }
}

export interface GraphUiState {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  sidebarOpen: boolean;
  structure: GraphStructure;
  search: string;
  layout: LayoutMode;
}

interface GraphStore extends GraphState, GraphUiState {
  rfNodes: Node[];
  rfEdges: Edge[];

  hydrateIfEmpty: () => void;

  applyLayoutNodes: (nodes: PKBNode[]) => void;

  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setStructure: (s: GraphStructure) => void;
  setSearch: (q: string) => void;
  setLayout: (l: LayoutMode) => void;

  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onNodeDragStop: (nodeId: string, position: { x: number; y: number }) => void;

  addNode: (node: Omit<PKBNode, "id"> & { id?: string }) => string;
  updateNodeData: (nodeId: string, patch: Partial<PKBNode["data"]>) => void;
  deleteNode: (nodeId: string) => void;

  connect: (params: Connection) => void;
  updateEdgeLabel: (edgeId: string, label: string) => void;
}

export const useGraphStore = create<GraphStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      rfNodes: [],
      rfEdges: [],

      selectedNodeId: null,
      selectedEdgeId: null,
      sidebarOpen: true,
      structure: "knowledge",
      search: "",
      layout: "free",

      hydrateIfEmpty: () => {
        const { nodes } = get();
        if (nodes.length) return;
        const g = seedGraph;
        set({
          nodes: g.nodes,
          edges: g.edges,
          rfNodes: toRfNodes(g.nodes),
          rfEdges: toRfEdges(g.edges),
        });
      },

      applyLayoutNodes: (nodes) => {
        set({ nodes, rfNodes: toRfNodes(nodes) });
      },

      setSelectedNodeId: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
      setSelectedEdgeId: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setStructure: (s) => {
        set({ structure: s });
        // Normalize existing edge direction to match mode
        const directed = s === "dependency" || s === "tree";
        const nextEdges = get().edges.map((e) => ({ ...e, directed }));
        set({ edges: nextEdges, rfEdges: toRfEdges(nextEdges) });
      },
      setSearch: (q) => set({ search: q }),
      setLayout: (l) => set({ layout: l }),

      onNodesChange: (changes) => {
        // Controlled React Flow nodes (smooth drag): only update rfNodes here.
        set((state) => ({ rfNodes: applyNodeChanges(changes, state.rfNodes) }));
      },
      onEdgesChange: (changes) => {
        set((state) => ({ rfEdges: applyEdgeChanges(changes, state.rfEdges) }));
      },
      onNodeDragStop: (nodeId, position) => {
        // Persist final position to GraphState; do NOT write during drag.
        const nextNodes = get().nodes.map((n) => (n.id === nodeId ? { ...n, position } : n));
        set({ nodes: nextNodes });
      },

      addNode: (node) => {
        const id = node.id ?? uuid();
        const createdAt = node.data.createdAt ?? new Date().toISOString();
        const next: PKBNode = {
          id,
          position: node.position,
          data: {
            title: node.data.title,
            note: node.data.note ?? "",
            category: node.data.category,
            color: node.data.color,
            tags: node.data.tags ?? [],
            handles: node.data.handles?.length ? node.data.handles : defaultHandles(),
            createdAt,
          },
        };
        const nextNodes = get().nodes.concat(next);
        set({
          nodes: nextNodes,
          rfNodes: toRfNodes(nextNodes),
          selectedNodeId: id,
          sidebarOpen: true,
        });
        return id;
      },

      updateNodeData: (nodeId, patch) => {
        const nextNodes = get().nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n));
        set({ nodes: nextNodes, rfNodes: toRfNodes(nextNodes) });
      },

      deleteNode: (nodeId) => {
        const nextNodes = get().nodes.filter((n) => n.id !== nodeId);
        const nextEdges = get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
        set({
          nodes: nextNodes,
          edges: nextEdges,
          rfNodes: toRfNodes(nextNodes),
          rfEdges: toRfEdges(nextEdges),
          selectedNodeId: null,
          selectedEdgeId: null,
        });
      },

      connect: (params) => {
        const { structure } = get();
        const defaults = edgeDefaultsForStructure(structure);

        const id = `e-${uuid()}`;
        const source = params.source!;
        const target = params.target!;
        const sourceHandle = params.sourceHandle ?? undefined;
        const targetHandle = params.targetHandle ?? undefined;

        if (structure === "tree") {
          const nextEdges = get()
            .edges.filter((e) => e.target !== target)
            .concat({
              id,
              source,
              target,
              sourceHandle,
              targetHandle,
              label: defaults.label,
              directed: defaults.directed,
              animated: true,
              createdAt: new Date().toISOString(),
            });
          set({ edges: nextEdges, rfEdges: toRfEdges(nextEdges) });
          return;
        }

        const nextEdge: PKBEdge = {
          id,
          source,
          target,
          sourceHandle,
          targetHandle,
          label: defaults.label,
          directed: defaults.directed,
          animated: true,
          createdAt: new Date().toISOString(),
        };
        const nextEdges = get().edges.concat(nextEdge);

        // Keep rfEdges controlled but derived from PKB edges for consistency.
        set({ edges: nextEdges, rfEdges: toRfEdges(nextEdges) });
      },

      updateEdgeLabel: (edgeId, label) => {
        const nextEdges = get().edges.map((e) => (e.id === edgeId ? { ...e, label } : e));
        set({ edges: nextEdges, rfEdges: toRfEdges(nextEdges) });
      },
    }),
    {
      name: LS_GRAPH_KEY,
      partialize: (s) => ({ nodes: s.nodes, edges: s.edges }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // After zustand hydrate, rebuild rf state
        const nodes = state.nodes?.length ? state.nodes : seedGraph.nodes;
        const edges = state.edges?.length ? state.edges : seedGraph.edges;
        state.nodes = nodes;
        state.edges = edges;
        state.rfNodes = toRfNodes(nodes);
        state.rfEdges = toRfEdges(edges);
      },
    }
  )
);

