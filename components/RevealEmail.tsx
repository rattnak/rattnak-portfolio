"use client";
import { useEffect, useRef, useState } from "react";

// The one place on the site that can show her address. Extracted from
// the old ConnectPanel so the footer can stay a server component: the
// footer's Email icon links here, to the About page's contact section,
// instead of revealing in place.
//
// Reads as a password field (2026-08-12): masked dots with an eye toggle
// on the right, the address in their place once revealed, and a "Copied"
// bubble when the address itself is clicked.

// Fallback width used until the real length arrives (and if that fetch
// fails). The real count comes from GET /api/reveal-email so the dots
// occupy exactly the address's width, and revealing swaps text of the
// same length instead of resizing the row.
const FALLBACK_MASK_LENGTH = 24;

export default function RevealEmail() {
  const [status, setStatus] = useState<"idle" | "loading" | "revealed" | "error">("idle");
  const [announcement, setAnnouncement] = useState("");
  // Fetched once and cached: re-hiding just stops displaying it, it
  // doesn't forget the value, so toggling back and forth doesn't hit
  // the API again. Never rendered until a deliberate click, so it's
  // never present in server-rendered HTML for scrapers to find.
  const [email, setEmail] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [maskLength, setMaskLength] = useState(FALLBACK_MASK_LENGTH);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The bubble hides itself on a timer; clear it on unmount so a state
  // update can't land after the component is gone.
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  // Fetch the address's length (not the address) so the dots match its
  // exact character count. Aborted on unmount so a late response cannot
  // set state on a gone component; any failure just keeps the fallback.
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reveal-email", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (typeof data?.length === "number" && data.length > 0) {
          setMaskLength(data.length);
        }
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const toggle = async () => {
    if (status === "loading") return;

    if (visible) {
      setVisible(false);
      setAnnouncement("Email hidden");
      return;
    }
    if (email) {
      // Already fetched: just show it again, no need to re-hit the API.
      setVisible(true);
      setAnnouncement("Email revealed");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/reveal-email", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const { email: revealed } = await res.json();
      setEmail(revealed);
      setVisible(true);
      setStatus("revealed");
      setAnnouncement("Email revealed, click it to copy");
    } catch {
      setStatus("error");
      setAnnouncement("Could not load email, please try again");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  // Clicking the revealed address copies it and floats a bubble above.
  const handleCopy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setAnnouncement("Email copied to clipboard");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can fail on permissions or an insecure context. The
      // address stays on screen and selectable, so this is not a dead
      // end, but say so rather than appearing to do nothing.
      setAnnouncement("Could not copy, select the address manually");
    }
  };

  const label = visible ? "Hide email" : status === "loading" ? "Loading email" : "Reveal email";

  return (
    <div className="reveal-email">
      <span className="instrument-label reveal-email-prompt">prefer email directly?</span>

      <div className="reveal-email-field">
        {email && visible ? (
          <button
            type="button"
            onClick={handleCopy}
            className="reveal-email-value"
            // Plain text in a button, never a mailto: href, which would
            // put the address back into rendered HTML for scrapers.
            aria-label={`Copy email address ${email}`}
          >
            <span className="instrument reveal-email-address">{email}</span>
            <span className={`reveal-email-bubble ${copied ? "is-shown" : ""}`} aria-hidden="true">
              Copied
            </span>
          </button>
        ) : (
          <span className="reveal-email-mask" aria-hidden="true">
            {status === "error"
              ? "couldn't load, try again"
              : "•".repeat(maskLength)}
          </span>
        )}

        <button
          type="button"
          onClick={toggle}
          className="reveal-email-toggle"
          aria-label={label}
          title={label}
          aria-pressed={visible}
        >
          {visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.94 10.94 0 0112 20c-5.5 0-9.5-4-11-8 .69-1.94 1.9-3.68 3.44-5.06M9.9 4.24A10.94 10.94 0 0112 4c5.5 0 9.5 4 11 8-.46 1.29-1.13 2.5-2 3.57M14.12 14.12a3 3 0 11-4.24-4.24" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l20 20" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <span role="status" aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
