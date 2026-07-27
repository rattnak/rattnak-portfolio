import "../styles/globals.css";
import localFont from "next/font/local";
import type { Viewport } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const switzer = localFont({
  src: [
    { path: "../public/fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/switzer/Switzer-Italic.woff2", weight: "400", style: "italic" },
    { path: "../public/fonts/switzer/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/switzer/Switzer-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/jetbrains-mono/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/jetbrains-mono/JetBrainsMono-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://rattnak.com";
const DESCRIPTION =
  "Full-stack software engineer who likes making complicated things simpler. Payment systems, event-driven backends, and agentic AI across fintech, education, and cybersecurity.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chanrattnak Mong - Software Engineer",
    template: "%s | Chanrattnak Mong",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Chanrattnak Mong - Software Engineer",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Chanrattnak Mong",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chanrattnak Mong - Software Engineer",
    description: DESCRIPTION,
    creator: "@rattnakmong",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chanrattnak Mong",
  url: SITE_URL,
  jobTitle: "Full-Stack Software Engineer",
  description: DESCRIPTION,
  sameAs: [
    "https://github.com/rattnak",
    "https://linkedin.com/in/mongchanrattnak",
    "https://x.com/rattnakmong",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${switzer.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme / wrong simplified state */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  if (localStorage.getItem('simplified') === 'true') {
                    document.documentElement.setAttribute('data-simplified', '');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
