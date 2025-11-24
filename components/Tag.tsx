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
    // Use database hex color - generate light/dark variants with good contrast
    const hexColor = color.startsWith('#') ? color : `#${color}`;

    // Helper function to convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const rgb = hexToRgb(hexColor);

    if (isDark) {
      colors = {
        bg: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` : `${hexColor}26`, // 15% opacity
        text: hexColor,
        border: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` : `${hexColor}4D`, // 30% opacity
      };
    } else {
      // Light mode - stronger background and darker text for WCAG AA compliance
      colors = {
        bg: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.20)` : `${hexColor}33`, // 20% opacity
        text: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : hexColor, // Full opacity for maximum contrast
        border: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)` : `${hexColor}59`, // 35% opacity
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
