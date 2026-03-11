"use client";

import * as React from "react";

import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { useGraphStore } from "@/src/hooks/useGraphStore";

export function AddNodeModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [color, setColor] = React.useState("#6366f1");

  const addNode = useGraphStore((s) => s.addNode);
  const setSidebarOpen = useGraphStore((s) => s.setSidebarOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add topic</DialogTitle>
          <DialogDescription>Create a new node in your knowledge graph.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1">
            <div className="text-sm font-medium">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React" />
          </div>
          <div className="grid gap-1">
            <div className="text-sm font-medium">Description</div>
            <textarea
              className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Short note…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <div className="text-sm font-medium">Category (optional)</div>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Framework / Concept…" />
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-medium">Color (optional)</div>
              <input
                type="color"
                className="h-10 w-full rounded-md border border-input bg-background p-1"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const w = window.innerWidth;
              const h = window.innerHeight;
              addNode({
                position: { x: w / 2 - 120, y: h / 2 - 80 },
                data: {
                  title: title.trim() || "Untitled",
                  note,
                  category: category.trim() || undefined,
                  color: color || undefined,
                  handles: undefined,
                },
              });
              setSidebarOpen(false);
              setOpen(false);
              setTitle("");
              setNote("");
              setCategory("");
              setColor("#6366f1");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

