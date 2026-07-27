// components/NavbarClient.tsx
"use client";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import ThemeToggle with no SSR to avoid hydration issues
const ThemeToggle = dynamic(() => import("./ThemeToggle").then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => <div className="w-9 h-9" />,
});

const CommandPalette = dynamic(() => import("./CommandPalette"), {
  ssr: false,
  loading: () => <div className="w-9 h-9" />,
});

// Contact is not a nav link: About absorbed the old /contact route, so
// a separate entry pointed at a section of a page already in this list.
//
// The navbar carries no contact affordance at all (2026-08-11). It held
// GitHub, LinkedIn, and an email popover; all three are gone. The navbar
// navigates this site, and every one of those has a better home: the
// social links in the footer, the address in the footer and the command
// palette's copy-email action, the form on /about#contact.
const NAV_LINKS = (showBlog: boolean) => [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  ...(showBlog ? [{ href: "/blog", label: "Blog" }] : []),
];

// One inline row at every width (2026-08-12). The links used to collapse
// into a slide-in drawer below 768px, which put a "Menu" control on
// screen for two or three links, and appeared under browser zoom on
// desktop as well. Removing it took the portal, the open/mounted state,
// the body-scroll lock, and the Escape handler with it, so this is now a
// client component only because ThemeToggle and CommandPalette are.
export default function NavbarClient({ showBlog }: { showBlog: boolean }) {
  const links = NAV_LINKS(showBlog);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--background) 80%, transparent)',
        borderBottom: '1px solid var(--border)'
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

          <nav className="flex items-center navbar-links">
            {/* Right before Work, same small trigger design as every
                other breakpoint. */}
            <CommandPalette />
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm link-text">
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
