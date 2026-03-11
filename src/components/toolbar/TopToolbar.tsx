"use client";

import * as React from "react";
import { LayoutGrid, Network, Search } from "lucide-react";

import { ThemeToggle } from "@/src/components/toolbar/ThemeToggle";
import { AddNodeModal } from "@/src/components/modals/AddNodeModal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useGraphStore } from "@/src/hooks/useGraphStore";

export function TopToolbar() {
  const layout = useGraphStore((s) => s.layout);
  const setLayout = useGraphStore((s) => s.setLayout);

  const structure = useGraphStore((s) => s.structure);
  const setStructure = useGraphStore((s) => s.setStructure);
  const search = useGraphStore((s) => s.search);
  const setSearch = useGraphStore((s) => s.setSearch);
  const sidebarOpen = useGraphStore((s) => s.sidebarOpen);
  const setSidebarOpen = useGraphStore((s) => s.setSidebarOpen);

  return (
    <div className="h-14 shrink-0 border-b bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="h-full px-3 flex items-center gap-2">
        <ThemeToggle />

        <AddNodeModal>
          <Button size="sm">
            <Network />
            Add Node
          </Button>
        </AddNodeModal>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <LayoutGrid />
              Layout
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={layout} onValueChange={(v) => setLayout(v as LayoutMode)}>
              <DropdownMenuRadioItem value="free">Free</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="force">Force (d3)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="hierarchical">Hierarchical (dagre)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="radial">Radial</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Structure
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={structure} onValueChange={(v) => setStructure(v as any)}>
              <DropdownMenuRadioItem value="knowledge">Knowledge Map</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="network">Network</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dependency">Dependency</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="tree">Tree</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-[min(360px,40vw)] hidden sm:block">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            Sidebar
          </Button>
        </div>
      </div>
    </div>
  );
}

