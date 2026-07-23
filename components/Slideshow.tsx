// components/Slideshow.tsx
"use client";
import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  alt: string;
};

export default function Slideshow({ images, alt }: Props) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const goTo = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <div
      style={{
        marginBottom: "3rem",
        borderRadius: "0.75rem",
        overflow: "hidden",
        backgroundColor: "var(--background-secondary)",
        border: "1px solid var(--border)",
      }}
    >
      <div
        className="w-full aspect-[16/9] relative"
        style={{ backgroundColor: "var(--background-tertiary)" }}
      >
        <div key={index} className="absolute inset-0 slideshow-fade">
          <Image
            src={images[index]}
            alt={`${alt}, image ${index + 1} of ${images.length}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(index - 1)}
              className="slideshow-nav slideshow-nav-prev"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(index + 1)}
              className="slideshow-nav slideshow-nav-next"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: "1.25rem", height: "1.25rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="slideshow-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => goTo(i)}
                  className="slideshow-dot"
                  data-active={i === index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
