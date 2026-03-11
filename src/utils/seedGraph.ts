import type { GraphState, NodeHandle } from "@/src/types/graph";

const defaultHandles: NodeHandle[] = [
  { id: "t", side: "top" },
  { id: "r", side: "right" },
  { id: "b", side: "bottom" },
  { id: "l", side: "left" },
];

export const seedGraph: GraphState = {
  nodes: [
    {
      id: "1",
      position: { x: 302.64826811130484, y: 13.456301938763502 },
      data: {
        title: "React sdf",
        note: "A JavaScript library for building user interfaces using components.",
        category: "Framework",
        color: "#60a5fa",
        tags: ["react", "ui"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "2",
      position: { x: 168.53471357242984, y: -127.500689614929 },
      data: {
        title: "Next.js",
        note: "React framework with SSR, routing, and API support built in.",
        category: "Framework",
        color: "#a78bfa",
        tags: ["web"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "3",
      position: { x: 396.0300119560252, y: 328.3972442426028 },
      data: {
        title: "TypeScript",
        note: "Typed superset of JavaScript that compiles to plain JS.",
        category: "Language",
        color: "#34d399",
        tags: ["typescript"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "4",
      position: { x: 186.5624225585858, y: 256.2569748577315 },
      data: {
        title: "State Management",
        note: "Patterns for managing shared application state (Context, Zustand, Redux).",
        category: "Concept",
        color: "#f59e0b",
        tags: ["state"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "5",
      position: { x: 74.41301850233374, y: 150.31490006624472 },
      data: {
        title: "Component Design",
        note: "Principles for building reusable, composable UI components.",
        category: "Concept",
        color: "#fb7185",
        tags: ["components"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "6",
      position: { x: -271.1186063238997, y: 343.87603459677644 },
      data: {
        title: "Performance",
        note: "Techniques like memoization, lazy loading, and virtualization.",
        category: "Optimization",
        color: "#22c55e",
        tags: ["performance"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "7",
      position: { x: 528.7283789745499, y: 270.99958553148167 },
      data: {
        title: "Testing",
        note: "Unit, integration, and e2e testing strategies for frontend apps.",
        category: "Practice",
        color: "#38bdf8",
        tags: ["testing"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "8",
      position: { x: 621.4600381089733, y: 188.46919663279388 },
      data: {
        title: "CSS & Styling",
        note: "Styling approaches including Tailwind, CSS Modules, and styled-components.",
        category: "Styling",
        color: "#f472b6",
        tags: ["css"],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
    {
      id: "8d454f9b-4684-4487-a616-9b125f958d3a",
      position: { x: 184.5593538958263, y: 390.0249886607471 },
      data: {
        title: "New Topic",
        note: "",
        category: "General",
        color: "#94a3b8",
        tags: [],
        handles: defaultHandles,
        createdAt: new Date().toISOString(),
      },
    },
  ],

  edges: [
    { id: "e-2-1", source: "2", target: "1", label: "built on", directed: true, animated: true },
    { id: "e-1-3", source: "1", target: "3", label: "pairs well with", directed: false, animated: true },
    { id: "e-1-4", source: "1", target: "4", label: "uses", directed: false, animated: true },
    { id: "e-1-5", source: "1", target: "5", label: "guides", directed: false, animated: true },
    { id: "e-2-6", source: "2", target: "6", label: "improves", directed: false, animated: true },
    { id: "e-1-7", source: "1", target: "7", label: "requires", directed: false, animated: true },
    { id: "e-1-8", source: "1", target: "8", label: "styled with", directed: false, animated: true },
    { id: "e-4-6", source: "4", target: "6", label: "impacts", directed: false, animated: true },
    { id: "e-5-6", source: "5", target: "6", label: "impacts", directed: false, animated: true },
  ],
};