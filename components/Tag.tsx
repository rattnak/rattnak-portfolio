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

  // Debug: Log color prop (only in development)
  if (process.env.NODE_ENV === 'development' && color) {
    console.log(`Tag "${children}" received color:`, color);
  }

  // Use database color if available, otherwise fallback to predefined colors
  let colors;
  if (color) {
    // Use database hex color - generate light/dark variants
    const hexColor = color.startsWith('#') ? color : `#${color}`;
    if (isDark) {
      colors = {
        bg: `${hexColor}26`, // 15% opacity
        text: hexColor,
        border: `${hexColor}4D`, // 30% opacity
      };
    } else {
      // Light mode - use a lighter background
      colors = {
        bg: `${hexColor}1A`, // 10% opacity
        text: hexColor,
        border: `${hexColor}33`, // 20% opacity
      };
    }
  } else {
    // Fallback to predefined color scheme from tagColors.ts
    colors = getTagColor(children, isDark);
  }

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
