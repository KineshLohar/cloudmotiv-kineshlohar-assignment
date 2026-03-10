// data/seed.

import { GraphState } from "@/types/graph";

export const seedGraph: GraphState = {
//   nodes: [
//     { id: '1', title: 'React', note: 'A JavaScript library for building user interfaces using components.' },
//     { id: '2', title: 'Next.js', note: 'React framework with SSR, routing, and API support built in.' },
//     { id: '3', title: 'TypeScript', note: 'Typed superset of JavaScript that compiles to plain JS.' },
//     { id: '4', title: 'State Management', note: 'Patterns for managing shared application state (Context, Zustand, Redux).' },
//     { id: '5', title: 'Component Design', note: 'Principles for building reusable, composable UI components.' },
//     { id: '6', title: 'Performance', note: 'Techniques like memoization, lazy loading, and virtualization.' },
//     { id: '7', title: 'Testing', note: 'Unit, integration, and e2e testing strategies for frontend apps.' },
//     { id: '8', title: 'CSS & Styling', note: 'Styling approaches including Tailwind, CSS Modules, and styled-components.' }
//   ],
  edges: [
    { id: 'e-2-1', source: '2', target: '1', label: 'built on', directed: true },
    { id: 'e-1-3', source: '1', target: '3', label: 'pairs well with' },
    { id: 'e-1-4', source: '1', target: '4', label: 'uses' },
    { id: 'e-1-5', source: '1', target: '5', label: 'guides' },
    { id: 'e-2-6', source: '2', target: '6', label: 'improves' },
    { id: 'e-1-7', source: '1', target: '7', label: 'requires' },
    { id: 'e-1-8', source: '1', target: '8', label: 'styled with' },
    { id: 'e-4-6', source: '4', target: '6', label: 'impacts' },
    { id: 'e-5-6', source: '5', target: '6', label: 'impacts' }
  ],
  nodes: [
    {
      "id": "1",
      "title": "React sdf",
      "note": "A JavaScript library for building user interfaces using components.",
      "position": {
        "x": 302.64826811130484,
        "y": 13.456301938763502
      }
    },
    {
      "id": "2",
      "title": "Next.js",
      "note": "React framework with SSR, routing, and API support built in.",
      "position": {
        "x": 168.53471357242984,
        "y": -127.500689614929
      }
    },
    {
      "id": "3",
      "title": "TypeScript",
      "note": "Typed superset of JavaScript that compiles to plain JS.",
      "position": {
        "x": 396.0300119560252,
        "y": 328.3972442426028
      }
    },
    {
      "id": "4",
      "title": "State Management",
      "note": "Patterns for managing shared application state (Context, Zustand, Redux).",
      "position": {
        "x": 186.5624225585858,
        "y": 256.2569748577315
      }
    },
    {
      "id": "5",
      "title": "Component Design",
      "note": "Principles for building reusable, composable UI components.",
      "position": {
        "x": 74.41301850233374,
        "y": 150.31490006624472
      }
    },
    {
      "id": "6",
      "title": "Performance",
      "note": "Techniques like memoization, lazy loading, and virtualization.",
      "position": {
        "x": -271.1186063238997,
        "y": 343.87603459677644
      }
    },
    {
      "id": "7",
      "title": "Testing",
      "note": "Unit, integration, and e2e testing strategies for frontend apps.",
      "position": {
        "x": 528.7283789745499,
        "y": 270.99958553148167
      }
    },
    {
      "id": "8",
      "title": "CSS & Styling",
      "note": "Styling approaches including Tailwind, CSS Modules, and styled-components.",
      "position": {
        "x": 621.4600381089733,
        "y": 188.46919663279388
      }
    },
    {
      "id": "8d454f9b-4684-4487-a616-9b125f958d3a",
      "title": "New Topic",
      "note": "",
      "position": {
        "x": 184.5593538958263,
        "y": 390.0249886607471
      }
    }
  ]

};