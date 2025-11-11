"use client";
import { useState, useEffect } from "react";
import { getTagColor } from "@/lib/tagColors";

type TagProps = {
  children: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string | null; // NEW: color from database
};

export default function Tag({ children, className = "", size = "md", color }: TagProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Always use getTagColor which has the proper color scheme from tagColors.ts
  // The database color is just a reference, but we use the full color config
  const colors = getTagColor(children, isDark);

  return (
    <span
      className={`inline-block transition-all tag-${size} ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.25rem',
        fontWeight: 500,
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  );
}
