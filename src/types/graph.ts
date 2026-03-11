export type NodeId = string;
export type EdgeId = string;

export type HandleSide = "top" | "bottom" | "left" | "right";

export interface NodeHandle {
  id: string; // stable id within node
  side: HandleSide;
  label?: string;
}

export interface PKBNodeData {
  title: string;
  note?: string;
  category?: string;
  color?: string; // css color string
  tags?: string[];
  handles?: NodeHandle[];
  createdAt?: string;
}

export interface PKBNode {
  id: NodeId;
  position: { x: number; y: number };
  data: PKBNodeData;
}

export interface PKBEdge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  directed?: boolean;
  animated?: boolean;
  createdAt?: string;
}

export interface GraphState {
  nodes: PKBNode[];
  edges: PKBEdge[];
}

