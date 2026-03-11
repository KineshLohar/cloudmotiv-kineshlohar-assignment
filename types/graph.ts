// types/graph.ts
export type NodeId = string;
export type EdgeId = string;

export interface PKBNode {
  id: NodeId;            // e.g., "1" or uuid
  title: string;
  note?: string;
  category?: string;
  color?: string; // hex or css color string
  tags?: string[];
  position?: { x: number; y: number }; // persisted after user drags
  createdAt?: string;
}

export interface PKBEdge {
  id: EdgeId;            // e.g., "e-1-2"
  source: NodeId;
  target: NodeId;
  label?: string;        // relationship label
  directed?: boolean;    // true if arrow
  createdAt?: string;
}

export interface GraphState {
  nodes: PKBNode[];
  edges: PKBEdge[];
}