import dagre from "dagre";
import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force";

import type { PKBEdge, PKBNode } from "@/src/types/graph";

export type LayoutMode = "free" | "force" | "hierarchical" | "radial";

export function layoutRadial(nodes: PKBNode[], width: number, height: number): PKBNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.35;
  const n = Math.max(1, nodes.length);
  return nodes.map((node, i) => {
    const a = (i / n) * Math.PI * 2;
    return { ...node, position: { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r } };
  });
}

export function layoutForce(nodes: PKBNode[], edges: PKBEdge[], width: number, height: number): PKBNode[] {
  const simNodes = nodes.map((n) => ({ id: n.id, x: n.position.x, y: n.position.y }));
  const links = edges.map((e) => ({ source: e.source, target: e.target }));

  const sim = forceSimulation(simNodes as any)
    .force("charge", forceManyBody().strength(-450))
    .force("center", forceCenter(width / 2, height / 2))
    .force("link", forceLink(links as any).id((d: any) => d.id).distance(170).strength(0.7))
    .stop();

  for (let i = 0; i < 220; i++) sim.tick();

  const pos = new Map(simNodes.map((n) => [n.id, { x: Number(n.x) || 0, y: Number(n.y) || 0 }]));
  return nodes.map((n) => ({ ...n, position: pos.get(n.id) ?? n.position }));
}

export function layoutHierarchical(nodes: PKBNode[], edges: PKBEdge[], width: number, height: number): PKBNode[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: 40,
    ranksep: 90,
    marginx: 20,
    marginy: 20,
  });

  for (const n of nodes) {
    g.setNode(n.id, { width: 220, height: 90 });
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target);
  }

  dagre.layout(g);

  // center within viewport
  const dagreNodes = nodes.map((n) => {
    const p = g.node(n.id) as { x: number; y: number } | undefined;
    return { id: n.id, x: p?.x ?? n.position.x, y: p?.y ?? n.position.y };
  });

  const minX = Math.min(...dagreNodes.map((n) => n.x));
  const minY = Math.min(...dagreNodes.map((n) => n.y));
  const maxX = Math.max(...dagreNodes.map((n) => n.x));
  const maxY = Math.max(...dagreNodes.map((n) => n.y));
  const graphW = Math.max(1, maxX - minX);
  const graphH = Math.max(1, maxY - minY);
  const offsetX = width / 2 - (minX + graphW / 2);
  const offsetY = height / 2 - (minY + graphH / 2);

  const pos = new Map(dagreNodes.map((n) => [n.id, { x: n.x + offsetX, y: n.y + offsetY }]));
  return nodes.map((n) => ({ ...n, position: pos.get(n.id) ?? n.position }));
}

