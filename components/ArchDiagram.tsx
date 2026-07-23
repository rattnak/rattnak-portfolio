// components/ArchDiagram.tsx
"use client";
import { useState } from "react";

// Interactive architecture diagram rendered from a JSON spec (authored
// inside an ```architecture fenced block in case-study markdown):
// {
//   "nodes": [{ "id": "api", "label": "API", "sublabel": "Node.js", "x": 0, "y": 0 }],
//   "edges": [{ "from": "api", "to": "db", "label": "SQL" }],
//   "notes": { "api": "Explanation shown in the side panel on hover/focus." }
// }
// Hover or focus a node: its connected edges highlight and the note
// appears in a panel below the SVG (not a tooltip, keyboard accessible).

export type ArchSpec = {
  nodes: { id: string; label: string; sublabel?: string; x: number; y: number }[];
  edges: { from: string; to: string; label?: string }[];
  notes?: Record<string, string>;
};

const NODE_W = 148;
const NODE_H = 56;
const PAD = 40;

export function parseArchSpec(raw: string): ArchSpec | null {
  try {
    const spec = JSON.parse(raw);
    if (!Array.isArray(spec?.nodes) || !Array.isArray(spec?.edges)) return null;
    return spec as ArchSpec;
  } catch {
    return null;
  }
}

export default function ArchDiagram({ spec }: { spec: ArchSpec }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const byId = new Map(spec.nodes.map((n) => [n.id, n]));
  const xs = spec.nodes.map((n) => n.x);
  const ys = spec.nodes.map((n) => n.y);
  const minX = Math.min(...xs) - NODE_W / 2 - PAD;
  const minY = Math.min(...ys) - NODE_H / 2 - PAD;
  const width = Math.max(...xs) - Math.min(...xs) + NODE_W + PAD * 2;
  const height = Math.max(...ys) - Math.min(...ys) + NODE_H + PAD * 2;

  const activeNote = activeId ? spec.notes?.[activeId] : null;

  return (
    <figure className="arch-diagram">
      <svg
        viewBox={`${minX} ${minY} ${width} ${height}`}
        role="img"
        aria-label="Architecture diagram"
        style={{ width: "100%", height: "auto" }}
      >
        <defs>
          <marker id="arch-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--text-muted)" />
          </marker>
          <marker id="arch-arrow-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--accent-primary)" />
          </marker>
        </defs>

        {spec.edges.map((edge, i) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          const active = activeId === edge.from || activeId === edge.to;
          // Trim the line so the arrowhead lands on the node border,
          // not its center.
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const len = Math.hypot(dx, dy) || 1;
          const trimFrom = { x: from.x + (dx / len) * (NODE_W / 2 - 8), y: from.y + (dy / len) * (NODE_H / 2 + 4) };
          const trimTo = { x: to.x - (dx / len) * (NODE_W / 2 - 4), y: to.y - (dy / len) * (NODE_H / 2 + 8) };
          return (
            <g key={i}>
              <line
                x1={trimFrom.x}
                y1={trimFrom.y}
                x2={trimTo.x}
                y2={trimTo.y}
                stroke={active ? "var(--accent-primary)" : "var(--border-secondary)"}
                strokeWidth={active ? 1.5 : 1}
                markerEnd={active ? "url(#arch-arrow-active)" : "url(#arch-arrow)"}
              />
              {edge.label && (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 6}
                  textAnchor="middle"
                  className="arch-edge-label"
                  fill={active ? "var(--accent-primary)" : "var(--text-muted)"}
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {spec.nodes.map((node) => {
          const active = activeId === node.id;
          const hasNote = Boolean(spec.notes?.[node.id]);
          return (
            <g
              key={node.id}
              tabIndex={hasNote ? 0 : undefined}
              role={hasNote ? "button" : undefined}
              aria-describedby={hasNote && active ? "arch-note-panel" : undefined}
              onMouseEnter={() => setActiveId(node.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(node.id)}
              onBlur={() => setActiveId(null)}
              style={{ cursor: hasNote ? "pointer" : "default", outline: "none" }}
            >
              <rect
                x={node.x - NODE_W / 2}
                y={node.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill="var(--background-secondary)"
                stroke={active ? "var(--accent-primary)" : "var(--border-secondary)"}
                strokeWidth={active ? 1.5 : 1}
              />
              <text x={node.x} y={node.sublabel ? node.y - 2 : node.y + 4} textAnchor="middle" className="arch-node-label" fill="var(--text-primary)">
                {node.label}
              </text>
              {node.sublabel && (
                <text x={node.x} y={node.y + 16} textAnchor="middle" className="arch-node-sublabel" fill="var(--text-muted)">
                  {node.sublabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <figcaption id="arch-note-panel" className="arch-note-panel" aria-live="polite">
        {activeNote || "Hover or focus a component to read its note."}
      </figcaption>
    </figure>
  );
}
