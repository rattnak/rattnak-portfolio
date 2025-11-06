// components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import ThemeToggle with no SSR to avoid hydration issues
const ThemeToggle = dynamic(() => import("./ThemeToggle").then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => <div className="w-9 h-9" />,
});

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-lg"
      style={{
        backgroundColor: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        opacity: 0.98
      }}
    >
      <div className="navbar-container">
        <div className="flex items-center justify-between navbar-inner">
          <Link
            href="/"
            className="text-sm font-semibold rounded-lg transition-all hover:bg-[var(--background-secondary)] navbar-logo"
            style={{ color: 'var(--text-primary)' }}
          >
            CM
          </Link>

          <nav className="hidden md:flex items-center navbar-links">
            <Link href="/" className="text-sm link-text">
              Home
            </Link>
            <Link href="/projects" className="text-sm link-text">
              Projects
            </Link>
            <Link href="/achievements" className="text-sm link-text">
              Achievements
            </Link>
            <Link href="/blog" className="text-sm link-text">
              Writing
            </Link>
            <Link href="/contact" className="text-sm link-text">
              Contact
            </Link>
            <ThemeToggle />
          </nav>

          <div className="md:hidden flex items-center navbar-mobile">
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="text-sm transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden"
          style={{
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--background)',
            opacity: 0.98
          }}
        >
          <div className="navbar-mobile-menu">
            <nav className="flex flex-col navbar-mobile-links">
              <Link href="/" onClick={() => setOpen(false)} className="text-sm link-text">
                Home
              </Link>
              <Link href="/projects" onClick={() => setOpen(false)} className="text-sm link-text">
                Projects
              </Link>
              <Link href="/achievements" onClick={() => setOpen(false)} className="text-sm link-text">
                Achievements
              </Link>
              <Link href="/blog" onClick={() => setOpen(false)} className="text-sm link-text">
                Writing
              </Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="text-sm link-text">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
