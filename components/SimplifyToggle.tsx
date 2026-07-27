"use client";
import { useEffect, useState } from "react";

// The accessibility-values-as-feature control: sets data-simplified on
// <html> (persisted in localStorage) so CSS can kill animation, hide
// decorative SVG in favor of plain text, maximize contrast, and
// linearize cards to a single column. Lives in the footer and is also
// reachable from the command palette.
export default function SimplifyToggle() {
  const [simplified, setSimplified] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("simplified") === "true";
    setSimplified(stored);
    document.documentElement.toggleAttribute("data-simplified", stored);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !simplified;
    setSimplified(next);
    localStorage.setItem("simplified", String(next));
    document.documentElement.toggleAttribute("data-simplified", next);
  };

  if (!mounted) {
    return <span className="simplify-toggle-placeholder" aria-hidden="true" />;
  }

  // Glyph mirrors the state it moves toward: three stacked rules for
  // the stripped-back view, a filled square for the full design.
  return (
    <button
      type="button"
      onClick={toggle}
      className="simplify-toggle"
      aria-pressed={simplified}
    >
      <span className="footer-control-glyph" aria-hidden="true">
        {simplified ? "■" : "≡"}
      </span>
      {simplified ? "restore full design" : "simplify this site"}
    </button>
  );
}
