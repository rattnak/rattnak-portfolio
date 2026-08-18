// components/DeckEmbed.tsx
// Embeds a slide deck in a work write-up: Canva, Google Slides, or a PDF.
//
// Authored in content as a ```deck fence holding the share URL, optionally
// followed by a label line:
//
//   ```deck
//   https://www.canva.com/design/XXX/YYY/view
//   YourMedi pitch deck
//   ```
//
// Providers publish a viewer URL and an embeddable variant, and they are not
// the same page: the share link a person copies out of Canva or Google Slides
// renders the full editor chrome and refuses to frame. toEmbedUrl maps the
// share link to the embed variant so the pasted URL just works.
//
// A URL from a provider we do not recognize is not embedded at all. Framing an
// arbitrary origin either breaks on X-Frame-Options or silently renders a login
// page, so an unknown host degrades to a labeled link rather than a dead box.

type Props = {
  url: string;
  label?: string;
};

function toEmbedUrl(raw: string): { src: string; provider: string } | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== 'https:') return null;

  const host = u.hostname.replace(/^www\./, '');

  // canva.link/<code> is Canva's share shortener. It redirects to the real
  // /design/<id>/<token>/view URL, but the target is only knowable by
  // following the redirect, which a server component cannot do at render
  // time without a fetch. Paste the expanded "view" URL to get an embed;
  // a short link degrades to the labeled fallback link below.

  // Canva: /design/<id>/<token>/view -> same path with ?embed
  if (host === 'canva.com' && /^\/design\/[^/]+\/[^/]+\/view/.test(u.pathname)) {
    return { src: `https://www.canva.com${u.pathname.replace(/\/$/, '')}?embed`, provider: 'Canva' };
  }

  // Google Slides: /presentation/d/<id>/(edit|view|pub) -> /embed
  if (host === 'docs.google.com' && u.pathname.startsWith('/presentation/')) {
    const id = u.pathname.match(/\/presentation\/d\/(?:e\/)?([^/]+)/)?.[1];
    if (id) {
      const pub = u.pathname.includes('/d/e/');
      const base = pub
        ? `https://docs.google.com/presentation/d/e/${id}/embed`
        : `https://docs.google.com/presentation/d/${id}/embed`;
      return { src: `${base}?start=false&loop=false`, provider: 'Google Slides' };
    }
  }

  // Google Drive file (a PDF, usually): /file/d/<id>/view -> /preview
  if (host === 'drive.google.com') {
    const id = u.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    if (id) return { src: `https://drive.google.com/file/d/${id}/preview`, provider: 'Google Drive' };
  }

  // A PDF served from anywhere: the browser's own viewer handles it.
  if (u.pathname.toLowerCase().endsWith('.pdf')) {
    return { src: u.toString(), provider: 'PDF' };
  }

  return null;
}

export default function DeckEmbed({ url, label }: Props) {
  const embed = toEmbedUrl(url);
  const title = label || 'Slide deck';

  // Unrecognized host: a link, not a broken frame.
  if (!embed) {
    return (
      <a className="deck-embed-fallback" href={url} target="_blank" rel="noreferrer">
        <span className="deck-embed-fallback-label instrument">View deck</span>
        <span className="deck-embed-fallback-title">{title}</span>
      </a>
    );
  }

  return (
    <figure className="deck-embed">
      <div className="deck-embed-frame">
        <iframe
          src={embed.src}
          title={title}
          loading="lazy"
          allowFullScreen
          allow="fullscreen"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <figcaption className="deck-embed-caption">
        <span>{title}</span>
        {/* The embed is not always reachable (a deck can be unshared later),
            so the original link stays available next to it. */}
        <a href={url} target="_blank" rel="noreferrer">
          Open in {embed.provider}
        </a>
      </figcaption>
    </figure>
  );
}
