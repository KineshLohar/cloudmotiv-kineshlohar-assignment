'use client'
import { GraphState, PKBEdge, PKBNode } from '@/types/graph';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  MarkerType,
  useReactFlow,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';
import { seedGraph } from './seed';

const LS_KEY = 'pkb_graph_v1';

function toReactFlowNodes(nodes: PKBNode[]): Node[] {
  return nodes.map(n => ({
    id: n.id,
    type: 'default',
    position: n.position ?? { x: Math.random() * 400, y: Math.random() * 200 },
    data: { label: n.title }
  }));
}

function toReactFlowEdges(edges: PKBEdge[]): Edge[] {
  return edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    markerEnd: e.directed ? { type: MarkerType.Arrow } : undefined,
    animated: false
  }));
}

export default function HomePage() {
  const [graph, setGraph] = useState<GraphState>({ nodes: [], edges: [] });
  const [rfNodes, setRfNodes] = useState<Node[]>([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // load from localStorage or seed
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as GraphState;
        setGraph(parsed);
        setRfNodes(toReactFlowNodes(parsed.nodes));
        setRfEdges(toReactFlowEdges(parsed.edges));
        return;
      } catch {}
    }
    // fallback to seed
    setGraph(seedGraph);
    setRfNodes(toReactFlowNodes(seedGraph.nodes));
    setRfEdges(toReactFlowEdges(seedGraph.edges));
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(graph));
  }, [graph]);

  const onNodesChange: OnNodesChange = useCallback(changes => {
    setRfNodes(prev => applyNodeChanges(changes, prev));
    // extract positions after change and persist in graph.nodes
    setTimeout(() => {
      // sync positions back to graph.nodes
      setGraph(prev => {
        const newNodes = prev.nodes.map(n => {
          const rf = document.querySelector(`[data-id="${n.id}"]`) as any;
          // we can't reliably query positions from DOM here; instead we will rely on rfNodes state
          return n;
        });
        return { ...prev, nodes: newNodes };
      });
    }, 0);
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              position: node.position
            }
          : n
      )
    }));
  }, []);

  const onEdgesChange: OnEdgesChange = useCallback(changes => {
    setRfEdges(prev => applyEdgeChanges(changes, prev));
  }, []);

  const onConnect = useCallback((params: Edge | Connection) => {
    // create an edge with label default 'relates to'
    const id = `e-${uuid()}`;
    const newEdge: Edge = {
      id,
      source: (params as any).source!,
      target: (params as any).target!,
      label: 'relates to',
      markerEnd: { type: MarkerType.Arrow }
    };
    setRfEdges(es => es.concat(newEdge));

    setGraph(prev => ({
      ...prev,
      edges: prev.edges.concat({
        id,
        source: (params as any).source!,
        target: (params as any).target!,
        label: 'relates to',
        directed: true,
        createdAt: new Date().toISOString()
      })
    }));
  }, []);

  // click handler to open sidebar (React Flow onNodeClick)
  const onNodeClick = useCallback((_evt, node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Add node example
  const addNode = () => {
    const id = uuid();
    const title = `New Topic`;
    const newNode: PKBNode = { id, title, note: '' };
    setGraph(prev => ({ ...prev, nodes: prev.nodes.concat(newNode) }));
    setRfNodes(ns => ns.concat({
      id,
      position: { x: 250, y: 250 },
      data: { label: title }
    }));
  };

  // Delete node
  const deleteNode = (nodeId: string) => {
    setGraph(prev => ({
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }));
    setRfNodes(ns => ns.filter(n => n.id !== nodeId));
    setRfEdges(es => es.filter(e => e.source !== nodeId && e.target !== nodeId));
    setSelectedNodeId(null);
  };

  return (
    <div className="w-full h-screen flex">
      <div className="flex-1">
        <div style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDragStop={onNodeDragStop}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-96 p-4 border-l">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Details</h2>
          <div>
            <button onClick={addNode} className="px-3 py-1 border rounded">+ Node</button>
          </div>
        </div>

        {selectedNodeId ? (
          (() => {
            const node = graph.nodes.find(n => n.id === selectedNodeId)!;
            if (!node) return <div>Not found</div>;
            return (
              <div>
                <input
                  className="w-full p-2 mb-2 border"
                  value={node.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setGraph(prev => ({
                      ...prev,
                      nodes: prev.nodes.map(n => n.id === node.id ? { ...n, title } : n)
                    }));
                    setRfNodes(ns => ns.map(rn => rn.id === node.id ? { ...rn, data: { ...rn.data, label: title } } : rn));
                  }}
                />
                <textarea
                  className="w-full p-2 border h-36"
                  value={node.note}
                  onChange={(e) => {
                    const note = e.target.value;
                    setGraph(prev => ({
                      ...prev,
                      nodes: prev.nodes.map(n => n.id === node.id ? { ...n, note } : n)
                    }));
                  }}
                />
                <div className="mt-4">
                  <button onClick={() => deleteNode(node.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete node</button>
                </div>
              </div>
            );
          })()
        ) : (
          <div>Select a node to edit</div>
        )}
      </aside>
    </div>
  );
}