"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import type { SearchItem } from "@/app/api/search-index/route";

// Hand-built command palette, no dependencies. Opened by Cmd/Ctrl+K or
// the navbar button. Native <dialog> gives us a free focus trap and
// backdrop; a simple subsequence fuzzy match ranks results; the active
// row is tracked via aria-activedescendant rather than moving DOM focus,
// so the input stays focused throughout arrow-key navigation.

type Action = {
  id: string;
  label: string;
  sublabel?: string;
  shortcut?: string;
  run: () => void;
};

function fuzzyScore(query: string, target: string): number | null {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      streak++;
      score += streak; // reward consecutive matches
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : null;
}

export default function CommandPalette() {
  const router = useRouter();
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchedRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
    dialogRef.current?.close();
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetch("/api/search-index")
        .then((res) => res.json())
        .then((data) => setItems(data.items || []))
        .catch(() => {});
    }
  }, []);

  // Global shortcut: Cmd/Ctrl+K.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) return prev;
          openPalette();
          return true;
        });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      // Defer focus until after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const copyEmail = useCallback(async () => {
    try {
      const res = await fetch("/api/reveal-email", { method: "POST" });
      const { email } = await res.json();
      await navigator.clipboard.writeText(email);
      setAnnouncement("Email copied");
    } catch {
      setAnnouncement("Could not copy email");
    }
  }, []);

  const staticActions: Action[] = [
    { id: "theme", label: "Toggle theme", run: toggleTheme },
    { id: "email", label: "Copy email", run: copyEmail },
    {
      id: "github",
      label: "Open GitHub",
      run: () => window.open("https://github.com/rattnak", "_blank", "noopener,noreferrer"),
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      run: () => window.open("https://linkedin.com/in/mongchanrattnak", "_blank", "noopener,noreferrer"),
    },
    { id: "resume", label: "Download resume", run: () => window.open("/api/resume?src=palette", "_blank") },
    {
      id: "simplify",
      label: document.documentElement.hasAttribute("data-simplified")
        ? "Restore full design"
        : "Simplify this site",
      run: () => {
        const next = !document.documentElement.hasAttribute("data-simplified");
        document.documentElement.toggleAttribute("data-simplified", next);
        localStorage.setItem("simplified", String(next));
      },
    },
  ];

  const navActions: Action[] = items.map((item) => ({
    id: item.id,
    label: item.label,
    sublabel: item.sublabel,
    run: () => router.push(item.href),
  }));

  const allActions = [...staticActions, ...navActions];

  const filtered = query
    ? allActions
        .map((action) => ({ action, score: fuzzyScore(query, action.label) }))
        .filter((r): r is { action: Action; score: number } => r.score !== null)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.action)
    : allActions;

  const runAction = (action: Action) => {
    action.run();
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) runAction(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <>
      {/* One small trigger design at every width: icon + "Search" always,
          the ⌘K hint hides itself below a breakpoint via CSS rather than
          swapping to a different, separately-styled mobile variant. */}
      <button
        type="button"
        onClick={openPalette}
        className="command-palette-search-trigger"
        aria-label="Search pages, projects, and actions"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <span>Search</span>
        <span className="command-palette-search-shortcut instrument">&#8984;K</span>
      </button>

      <dialog
        ref={dialogRef}
        className="command-palette-dialog"
        onClose={close}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        aria-label="Command palette"
      >
        <div className="command-palette-inner">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, projects, actions..."
            role="combobox"
            aria-expanded={open}
            aria-controls="command-palette-list"
            aria-activedescendant={filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined}
            className="command-palette-input"
            autoComplete="off"
          />
          <ul id="command-palette-list" role="listbox" className="command-palette-list">
            {filtered.length === 0 && <li className="command-palette-empty">No matches.</li>}
            {filtered.map((action, i) => (
              <li
                key={action.id}
                id={`cmd-${action.id}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`command-palette-item ${i === activeIndex ? "command-palette-item-active" : ""}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => runAction(action)}
              >
                <span>{action.label}</span>
                {action.sublabel && <span className="command-palette-sublabel">{action.sublabel}</span>}
              </li>
            ))}
          </ul>
        </div>
      </dialog>

      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
