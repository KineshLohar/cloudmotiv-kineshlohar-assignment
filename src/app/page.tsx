"use client";

import { GraphCanvas } from "@/src/components/graph/GraphCanvas";
import { NodeSidebar } from "@/src/components/sidebar/NodeSidebar";
import { TopToolbar } from "@/src/components/toolbar/TopToolbar";

export default function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col">
      <TopToolbar />
      <div className="flex-1 min-h-0 flex">
        <div className="flex-1 min-h-0">
          <GraphCanvas />
        </div>
        <NodeSidebar />
      </div>
    </div>
  );
}

