"use client";
import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";

// Signature interactive element: a tangled line under the hero H1 that
// visitors straighten by dragging (or keyboard-nudging) four knots back
// onto the baseline. A small, playful stand-in for the brand thesis:
// "I like making complicated things simpler."
//
// The viewBox width tracks the container's real rendered width (via
// ResizeObserver) so 1 SVG unit always equals 1 real pixel on both axes.
// Without that, a fixed viewBox stretched to fill a differently-shaped
// box (preserveAspectRatio="none") would scale X and Y independently and
// turn the round knots into ellipses.

const HEIGHT = 48;
const BASELINE_Y = HEIGHT / 2;
const KNOT_FRACTIONS = [0.18, 0.4, 0.6, 0.82];
const START_OFFSET = [-16, 14, -18, 12]; // px off baseline, the "tangle"
const SNAP_THRESHOLD = 3; // px from baseline counts as locked
const NUDGE_STEP = 2;
const AUTO_SOLVE_IDLE_MS = 8000;

type KnotState = { y: number; locked: boolean };

function catmullRomPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// "Simplify this site" also forces the designed solved state, same as
// reduced motion: watches the data-simplified attribute the toggle
// writes to <html>, via MutationObserver since it can flip at any time
// from the footer or command palette, not just on mount.
function useSimplified() {
  const [simplified, setSimplified] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setSimplified(root.hasAttribute("data-simplified"));
    const observer = new MutationObserver(() => setSimplified(root.hasAttribute("data-simplified")));
    observer.observe(root, { attributes: true, attributeFilter: ["data-simplified"] });
    return () => observer.disconnect();
  }, []);
  return simplified;
}

function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

export default function UntangleKnot() {
  const reducedMotion = usePrefersReducedMotion();
  const simplified = useSimplified();
  // Both "prefers-reduced-motion" and "simplify this site" render the
  // designed static solved state instead of the drag interaction.
  const forceStatic = reducedMotion || simplified;
  const [containerRef, width] = useContainerWidth<HTMLDivElement>();
  const svgWidth = width || 640; // sane default before first measurement
  const knotX = KNOT_FRACTIONS.map((f) => svgWidth * f);

  const [knots, setKnots] = useState<KnotState[]>(() =>
    START_OFFSET.map((offset) => ({ y: BASELINE_Y + offset, locked: false }))
  );
  const [solved, setSolved] = useState(forceStatic);
  const [startTime] = useState(() => Date.now());
  const [elapsedLabel, setElapsedLabel] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingIndex = useRef<number | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finishIfSolved = useCallback(
    (next: KnotState[]) => {
      if (next.every((k) => k.locked) && !solved) {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        setSolved(true);
        const seconds = ((Date.now() - startTime) / 1000).toFixed(1);
        setElapsedLabel(`${seconds}s`);
      }
    },
    [solved, startTime]
  );

  const updateKnot = useCallback(
    (index: number, y: number) => {
      setKnots((prev) => {
        const clamped = Math.max(6, Math.min(HEIGHT - 6, y));
        const locked = Math.abs(clamped - BASELINE_Y) <= SNAP_THRESHOLD;
        const next = [...prev];
        next[index] = { y: locked ? BASELINE_Y : clamped, locked };
        finishIfSolved(next);
        return next;
      });
    },
    [finishIfSolved]
  );

  // Auto-solve gently after idle, unless already solved or reduced motion
  // (reduced motion starts solved, so this never fires there). Runs once
  // on mount; interaction handlers restart it directly rather than this
  // effect depending on knot state, which would otherwise tear down and
  // restart the timer on every drag frame.
  const armIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setKnots(START_OFFSET.map(() => ({ y: BASELINE_Y, locked: true })));
      setSolved(true);
      const seconds = ((Date.now() - startTime) / 1000).toFixed(1);
      setElapsedLabel(`${seconds}s (auto)`);
    }, AUTO_SOLVE_IDLE_MS);
  }, [startTime]);

  useEffect(() => {
    if (solved || forceStatic) return;
    armIdleTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If reduced-motion or "simplify this site" turns on mid-session
  // (rather than being true on mount), snap straight to the static
  // solved state instead of leaving the drag interaction live.
  useEffect(() => {
    if (forceStatic && !solved) {
      setKnots(START_OFFSET.map(() => ({ y: BASELINE_Y, locked: true })));
      setSolved(true);
    }
  }, [forceStatic, solved]);

  const resetIdleTimer = useCallback(() => {
    if (solved) return;
    armIdleTimer();
  }, [armIdleTimer, solved]);

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    if (solved) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingIndex.current = index;
    resetIdleTimer();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIndex.current === null || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = HEIGHT / rect.height;
    const y = (e.clientY - rect.top) * scale;
    updateKnot(draggingIndex.current, y);
  };

  const handlePointerUp = () => {
    draggingIndex.current = null;
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    if (solved) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      updateKnot(index, knots[index].y - NUDGE_STEP);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      updateKnot(index, knots[index].y + NUDGE_STEP);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (Math.abs(knots[index].y - BASELINE_Y) <= SNAP_THRESHOLD * 4) {
        updateKnot(index, BASELINE_Y);
      }
    }
  };

  const replay = () => {
    setKnots(START_OFFSET.map((offset) => ({ y: BASELINE_Y + offset, locked: false })));
    setSolved(false);
    setElapsedLabel(null);
    if (!forceStatic) armIdleTimer();
  };

  const points = [
    { x: -10, y: BASELINE_Y },
    ...knotX.map((x, i) => ({ x, y: knots[i].y })),
    { x: svgWidth + 10, y: BASELINE_Y },
  ];
  const pathD = solved
    ? `M -10,${BASELINE_Y} L ${svgWidth + 10},${BASELINE_Y}`
    : catmullRomPath(points);

  if (forceStatic && !elapsedLabel) {
    // Reduced motion or "simplify this site": show the designed solved
    // state immediately, with a manual replay control rather than blank
    // space or forced animation.
    return (
      <div className="untangle-knot" ref={containerRef} aria-hidden={false}>
        <svg viewBox={`0 0 ${svgWidth} ${HEIGHT}`} width="100%" height={HEIGHT} role="img" aria-label="Underline, simplified">
          <line x1="-10" y1={BASELINE_Y} x2={svgWidth + 10} y2={BASELINE_Y} stroke="var(--accent-primary)" strokeWidth="2" />
        </svg>
        <div className="untangle-stamp">
          <span className="instrument">simplified</span>
          <button type="button" onClick={replay} className="untangle-replay">
            replay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="untangle-knot" ref={containerRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${svgWidth} ${HEIGHT}`}
        width="100%"
        height={HEIGHT}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        role="img"
        aria-label={solved ? "Underline, simplified" : "Untangle the underline by dragging the knots to the baseline"}
      >
        <line
          x1="-10"
          y1={BASELINE_Y}
          x2={svgWidth + 10}
          y2={BASELINE_Y}
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <path
          d={pathD}
          fill="none"
          stroke={solved ? "var(--accent-primary)" : "var(--text-muted)"}
          strokeWidth="2"
          strokeLinecap="round"
          className={solved ? "untangle-path-solved" : undefined}
        />
        {!solved &&
          knotX.map((x, i) => (
            <g key={i} style={{ touchAction: "none" }}>
              <circle
                cx={x}
                cy={knots[i].y}
                r="10"
                fill="transparent"
                stroke="transparent"
                style={{ cursor: "grab" }}
                onPointerDown={handlePointerDown(i)}
                tabIndex={0}
                role="slider"
                aria-label={`Knot ${i + 1} of ${knotX.length}`}
                aria-valuemin={0}
                aria-valuemax={HEIGHT}
                aria-valuenow={Math.round(knots[i].y)}
                aria-valuetext={knots[i].locked ? "locked to baseline" : "off baseline"}
                onKeyDown={handleKeyDown(i)}
              />
              <circle
                cx={x}
                cy={knots[i].y}
                r={knots[i].locked ? 4 : 5}
                fill={knots[i].locked ? "var(--accent-primary)" : "var(--background)"}
                stroke={knots[i].locked ? "var(--accent-primary)" : "var(--text-muted)"}
                strokeWidth="1.5"
                pointerEvents="none"
              />
            </g>
          ))}
      </svg>
      {solved && elapsedLabel && (
        <div className="untangle-stamp untangle-stamp-in">
          <span className="instrument">simplified &#10003; {elapsedLabel}</span>
          <button type="button" onClick={replay} className="untangle-replay">
            replay
          </button>
        </div>
      )}
    </div>
  );
}
