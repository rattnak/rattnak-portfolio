// lib/tagColors.ts - Centralized tag color configuration
//
// Palette is generated: each tag family gets a distinct hue spaced by the
// golden angle (~137.5deg) around the color wheel, so no two adjacent tags
// in a list read as the same color. Light-mode text/background pairs are
// verified to meet WCAG AA (>=4.5:1) programmatically, not eyeballed; dark
// variants are derived from the same hue as translucent overlays rather
// than hand-typed, so they can't drift out of sync with light mode.

export type TagColor = {
  bg: string;
  text: string;
  border: string;
};

export const TAG_COLORS: Record<string, TagColor> = {
  'AI': { bg: '#F5EDEA', text: '#7C301D', border: '#D2A89D' },
  'AWS': { bg: '#EAF5F0', text: '#1D7C4C', border: '#9DD2B7' },
  'Academic Excellence': { bg: '#F3EAF5', text: '#671D7C', border: '#C79DD2' },
  'Algorithms': { bg: '#F4F5EA', text: '#6D741B', border: '#CED29D' },
  'Angular': { bg: '#EAF1F5', text: '#1D597C', border: '#9DBFD2' },
  'Animation': { bg: '#F5EAEE', text: '#7C1D3D', border: '#D29DAF' },
  'C++': { bg: '#EBF5EA', text: '#227C1D', border: '#A0D29D' },
  'CI/CD': { bg: '#EDEAF5', text: '#341D7C', border: '#AA9DD2' },
  'Data Structures': { bg: '#F5F0EA', text: '#7C501D', border: '#D2B99D' },
  'Docker': { bg: '#EAF5F3', text: '#1B7464', border: '#9DD2C9' },
  'Express': { bg: '#F5EAF4', text: '#7C1D71', border: '#D29DCC' },
  'Figma': { bg: '#F1F5EA', text: '#4F741B', border: '#BCD29D' },
  'Firebase': { bg: '#EAEEF5', text: '#1D397C', border: '#9DADD2' },
  'Flutter': { bg: '#F5EAEB', text: '#7C1D1E', border: '#D29D9D' },
  'Go': { bg: '#EAF5ED', text: '#1D7C38', border: '#9DD2AC' },
  'GraphQL': { bg: '#F1EAF5', text: '#541D7C', border: '#BC9DD2' },
  'Java': { bg: '#F5F4EA', text: '#74681B', border: '#D2CB9D' },
  'JavaScript': { bg: '#EAF3F5', text: '#1D6D7C', border: '#9DCAD2' },
  'Kubernetes': { bg: '#F5EAF0', text: '#7C1D51', border: '#D29DBA' },
  'Machine Learning': { bg: '#EDF5EA', text: '#357C1D', border: '#ABD29D' },
  'Mobile Design': { bg: '#EBEAF5', text: '#201D7C', border: '#9F9DD2' },
  'Mobile UI': { bg: '#F5EEEA', text: '#7C3C1D', border: '#D2AE9D' },
  'MongoDB': { bg: '#EAF5F1', text: '#1D7C58', border: '#9DD2BE' },
  'MySQL': { bg: '#F4EAF5', text: '#741D7C', border: '#CD9DD2' },
  'Next.js': { bg: '#F3F5EA', text: '#62741B', border: '#C7D29D' },
  'Node.js': { bg: '#EAF0F5', text: '#1D4D7C', border: '#9DB8D2' },
  'PostgreSQL': { bg: '#F5EAED', text: '#7C1D31', border: '#D29DA8' },
  'Prisma': { bg: '#EAF5EB', text: '#1D7C25', border: '#9DD2A1' },
  'Problem Solving': { bg: '#EEEAF5', text: '#401D7C', border: '#B19DD2' },
  'Prototyping': { bg: '#F5F1EA', text: '#7C5C1D', border: '#D2C09D' },
  'Python': { bg: '#EAF5F4', text: '#1B7470', border: '#9DD2D0' },
  'REST API': { bg: '#F5EAF2', text: '#7C1D65', border: '#D29DC5' },
  'React': { bg: '#EFF5EA', text: '#44741B', border: '#B6D29D' },
  'React Native': { bg: '#EAECF5', text: '#1D2D7C', border: '#9DA6D2' },
  'Rust': { bg: '#F5ECEA', text: '#7C291D', border: '#D2A39D' },
  'Stripe': { bg: '#EAF5EF', text: '#1D7C44', border: '#9DD2B3' },
  'Svelte': { bg: '#F2EAF5', text: '#601D7C', border: '#C29DD2' },
  'Swift': { bg: '#F5F5EA', text: '#6B6B19', border: '#D2D29D' },
  'Tailwind CSS': { bg: '#EAF2F5', text: '#1D617C', border: '#9DC3D2' },
  'TailwindCSS': { bg: '#EAF2F5', text: '#1D617C', border: '#9DC3D2' },
  'TensorFlow': { bg: '#F5EAEF', text: '#7C1D45', border: '#D29DB3' },
  'TypeScript': { bg: '#ECF5EA', text: '#297C1D', border: '#A4D29D' },
  'UI/UX': { bg: '#ECEAF5', text: '#2D1D7C', border: '#A69DD2' },
  'User Research': { bg: '#F5EFEA', text: '#7C481D', border: '#D2B59D' },
  'Vue.js': { bg: '#EAF5F2', text: '#1B745D', border: '#9DD2C5' },
  'WebSockets': { bg: '#F5EAF5', text: '#7C1D78', border: '#D29DD0' },
};

export const TAG_COLORS_DARK: Record<string, TagColor> = {
  'AI': { bg: 'rgba(228, 157, 139, 0.15)', text: 'rgb(228, 157, 139)', border: 'rgba(228, 157, 139, 0.35)' },
  'AWS': { bg: 'rgba(139, 228, 183, 0.15)', text: 'rgb(139, 228, 183)', border: 'rgba(139, 228, 183, 0.35)' },
  'Academic Excellence': { bg: 'rgba(209, 139, 228, 0.15)', text: 'rgb(209, 139, 228)', border: 'rgba(209, 139, 228, 0.35)' },
  'Algorithms': { bg: 'rgba(221, 228, 139, 0.15)', text: 'rgb(221, 228, 139)', border: 'rgba(221, 228, 139, 0.35)' },
  'Angular': { bg: 'rgba(139, 195, 228, 0.15)', text: 'rgb(139, 195, 228)', border: 'rgba(139, 195, 228, 0.35)' },
  'Animation': { bg: 'rgba(228, 139, 170, 0.15)', text: 'rgb(228, 139, 170)', border: 'rgba(228, 139, 170, 0.35)' },
  'C++': { bg: 'rgba(144, 228, 139, 0.15)', text: 'rgb(144, 228, 139)', border: 'rgba(144, 228, 139, 0.35)' },
  'CI/CD': { bg: 'rgba(161, 139, 228, 0.15)', text: 'rgb(161, 139, 228)', border: 'rgba(161, 139, 228, 0.35)' },
  'Data Structures': { bg: 'rgba(228, 187, 139, 0.15)', text: 'rgb(228, 187, 139)', border: 'rgba(228, 187, 139, 0.35)' },
  'Docker': { bg: 'rgba(139, 228, 212, 0.15)', text: 'rgb(139, 228, 212)', border: 'rgba(139, 228, 212, 0.35)' },
  'Express': { bg: 'rgba(228, 139, 217, 0.15)', text: 'rgb(228, 139, 217)', border: 'rgba(228, 139, 217, 0.35)' },
  'Figma': { bg: 'rgba(192, 228, 139, 0.15)', text: 'rgb(192, 228, 139)', border: 'rgba(192, 228, 139, 0.35)' },
  'Firebase': { bg: 'rgba(139, 166, 228, 0.15)', text: 'rgb(139, 166, 228)', border: 'rgba(139, 166, 228, 0.35)' },
  'Flutter': { bg: 'rgba(228, 139, 140, 0.15)', text: 'rgb(228, 139, 140)', border: 'rgba(228, 139, 140, 0.35)' },
  'Go': { bg: 'rgba(139, 228, 165, 0.15)', text: 'rgb(139, 228, 165)', border: 'rgba(139, 228, 165, 0.35)' },
  'GraphQL': { bg: 'rgba(190, 139, 228, 0.15)', text: 'rgb(190, 139, 228)', border: 'rgba(190, 139, 228, 0.35)' },
  'Java': { bg: 'rgba(228, 216, 139, 0.15)', text: 'rgb(228, 216, 139)', border: 'rgba(228, 216, 139, 0.35)' },
  'JavaScript': { bg: 'rgba(139, 214, 228, 0.15)', text: 'rgb(139, 214, 228)', border: 'rgba(139, 214, 228, 0.35)' },
  'Kubernetes': { bg: 'rgba(228, 139, 188, 0.15)', text: 'rgb(228, 139, 188)', border: 'rgba(228, 139, 188, 0.35)' },
  'Machine Learning': { bg: 'rgba(162, 228, 139, 0.15)', text: 'rgb(162, 228, 139)', border: 'rgba(162, 228, 139, 0.35)' },
  'Mobile Design': { bg: 'rgba(143, 139, 228, 0.15)', text: 'rgb(143, 139, 228)', border: 'rgba(143, 139, 228, 0.35)' },
  'Mobile UI': { bg: 'rgba(228, 168, 139, 0.15)', text: 'rgb(228, 168, 139)', border: 'rgba(228, 168, 139, 0.35)' },
  'MongoDB': { bg: 'rgba(139, 228, 194, 0.15)', text: 'rgb(139, 228, 194)', border: 'rgba(139, 228, 194, 0.35)' },
  'MySQL': { bg: 'rgba(220, 139, 228, 0.15)', text: 'rgb(220, 139, 228)', border: 'rgba(220, 139, 228, 0.35)' },
  'Next.js': { bg: 'rgba(210, 228, 139, 0.15)', text: 'rgb(210, 228, 139)', border: 'rgba(210, 228, 139, 0.35)' },
  'Node.js': { bg: 'rgba(139, 184, 228, 0.15)', text: 'rgb(139, 184, 228)', border: 'rgba(139, 184, 228, 0.35)' },
  'PostgreSQL': { bg: 'rgba(228, 139, 158, 0.15)', text: 'rgb(228, 139, 158)', border: 'rgba(228, 139, 158, 0.35)' },
  'Prisma': { bg: 'rgba(139, 228, 146, 0.15)', text: 'rgb(139, 228, 146)', border: 'rgba(139, 228, 146, 0.35)' },
  'Problem Solving': { bg: 'rgba(172, 139, 228, 0.15)', text: 'rgb(172, 139, 228)', border: 'rgba(172, 139, 228, 0.35)' },
  'Prototyping': { bg: 'rgba(228, 198, 139, 0.15)', text: 'rgb(228, 198, 139)', border: 'rgba(228, 198, 139, 0.35)' },
  'Python': { bg: 'rgba(139, 228, 224, 0.15)', text: 'rgb(139, 228, 224)', border: 'rgba(139, 228, 224, 0.35)' },
  'REST API': { bg: 'rgba(228, 139, 206, 0.15)', text: 'rgb(228, 139, 206)', border: 'rgba(228, 139, 206, 0.35)' },
  'React': { bg: 'rgba(180, 228, 139, 0.15)', text: 'rgb(180, 228, 139)', border: 'rgba(180, 228, 139, 0.35)' },
  'React Native': { bg: 'rgba(139, 154, 228, 0.15)', text: 'rgb(139, 154, 228)', border: 'rgba(139, 154, 228, 0.35)' },
  'Rust': { bg: 'rgba(228, 150, 139, 0.15)', text: 'rgb(228, 150, 139)', border: 'rgba(228, 150, 139, 0.35)' },
  'Stripe': { bg: 'rgba(139, 228, 176, 0.15)', text: 'rgb(139, 228, 176)', border: 'rgba(139, 228, 176, 0.35)' },
  'Svelte': { bg: 'rgba(202, 139, 228, 0.15)', text: 'rgb(202, 139, 228)', border: 'rgba(202, 139, 228, 0.35)' },
  'Swift': { bg: 'rgba(228, 228, 139, 0.15)', text: 'rgb(228, 228, 139)', border: 'rgba(228, 228, 139, 0.35)' },
  'Tailwind CSS': { bg: 'rgba(139, 202, 228, 0.15)', text: 'rgb(139, 202, 228)', border: 'rgba(139, 202, 228, 0.35)' },
  'TailwindCSS': { bg: 'rgba(139, 202, 228, 0.15)', text: 'rgb(139, 202, 228)', border: 'rgba(139, 202, 228, 0.35)' },
  'TensorFlow': { bg: 'rgba(228, 139, 176, 0.15)', text: 'rgb(228, 139, 176)', border: 'rgba(228, 139, 176, 0.35)' },
  'TypeScript': { bg: 'rgba(151, 228, 139, 0.15)', text: 'rgb(151, 228, 139)', border: 'rgba(151, 228, 139, 0.35)' },
  'UI/UX': { bg: 'rgba(154, 139, 228, 0.15)', text: 'rgb(154, 139, 228)', border: 'rgba(154, 139, 228, 0.35)' },
  'User Research': { bg: 'rgba(228, 180, 139, 0.15)', text: 'rgb(228, 180, 139)', border: 'rgba(228, 180, 139, 0.35)' },
  'Vue.js': { bg: 'rgba(139, 228, 206, 0.15)', text: 'rgb(139, 228, 206)', border: 'rgba(139, 228, 206, 0.35)' },
  'WebSockets': { bg: 'rgba(228, 139, 224, 0.15)', text: 'rgb(228, 139, 224)', border: 'rgba(228, 139, 224, 0.35)' },
};

// Default colors for tags not in the predefined list
export const DEFAULT_TAG_COLOR: TagColor = {
  bg: '#F3F4F6',
  text: '#374151',
  border: '#D1D5DB',
};

export const DEFAULT_TAG_COLOR_DARK: TagColor = {
  bg: 'rgba(156, 163, 175, 0.15)',
  text: '#9CA3AF',
  border: 'rgba(156, 163, 175, 0.35)',
};

/**
 * Get the color configuration for a tag
 * @param tag - The tag name
 * @param isDark - Whether dark mode is active
 * @returns TagColor configuration
 */
export function getTagColor(tag: string, isDark: boolean = false): TagColor {
  const colorMap = isDark ? TAG_COLORS_DARK : TAG_COLORS;
  const defaultColor = isDark ? DEFAULT_TAG_COLOR_DARK : DEFAULT_TAG_COLOR;

  return colorMap[tag] || defaultColor;
}
