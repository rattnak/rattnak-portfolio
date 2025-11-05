// lib/tagColors.ts - Centralized tag color configuration
// Easy to modify - just change the colors here!

export type TagColor = {
  bg: string;
  text: string;
  border: string;
};

// Predefined color palette for tags
export const TAG_COLORS: Record<string, TagColor> = {
  // Programming Languages
  'JavaScript': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'TypeScript': { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD' },
  'Python': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'Java': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Go': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'Rust': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },
  'C++': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },

  // Frontend Frameworks & Libraries
  'React': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'Next.js': { bg: '#F3F4F6', text: '#111827', border: '#9CA3AF' },
  'Vue.js': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'Angular': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'Svelte': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },
  'Tailwind CSS': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'TailwindCSS': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },

  // Backend & Databases
  'Node.js': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'Express': { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' },
  'MongoDB': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'PostgreSQL': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'MySQL': { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD' },
  'Firebase': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'Prisma': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },

  // Cloud & DevOps
  'AWS': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },
  'Docker': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'Kubernetes': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  'CI/CD': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },

  // Mobile Development
  'React Native': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'Flutter': { bg: '#DBEAFE', text: '#1E3A8A', border: '#93C5FD' },
  'Swift': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },

  // Design & UI/UX
  'Figma': { bg: '#F0ABFC', text: '#701A75', border: '#E879F9' },
  'UI/UX': { bg: '#F0ABFC', text: '#701A75', border: '#E879F9' },
  'Prototyping': { bg: '#F0ABFC', text: '#701A75', border: '#E879F9' },
  'Mobile Design': { bg: '#FBCFE8', text: '#831843', border: '#F9A8D4' },
  'Mobile UI': { bg: '#FBCFE8', text: '#831843', border: '#F9A8D4' },
  'User Research': { bg: '#E9D5FF', text: '#581C87', border: '#D8B4FE' },
  'Animation': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },

  // AI & Machine Learning
  'AI': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  'Machine Learning': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  'TensorFlow': { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },

  // Other Technologies
  'GraphQL': { bg: '#F0ABFC', text: '#701A75', border: '#E879F9' },
  'REST API': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'WebSockets': { bg: '#DBEAFE', text: '#1E40AF', border: '#60A5FA' },
  'Stripe': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },

  // General Categories
  'Algorithms': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  'Data Structures': { bg: '#E0E7FF', text: '#3730A3', border: '#A5B4FC' },
  'Problem Solving': { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  'Academic Excellence': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
};

// Dark mode color variants (automatically generated from light mode)
export const TAG_COLORS_DARK: Record<string, TagColor> = {
  // Programming Languages
  'JavaScript': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FCD34D', border: 'rgba(251, 191, 36, 0.3)' },
  'TypeScript': { bg: 'rgba(59, 130, 246, 0.15)', text: '#93C5FD', border: 'rgba(59, 130, 246, 0.3)' },
  'Python': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'Java': { bg: 'rgba(239, 68, 68, 0.15)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' },
  'Go': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'Rust': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },
  'C++': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },

  // Frontend Frameworks & Libraries
  'React': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'Next.js': { bg: 'rgba(156, 163, 175, 0.15)', text: '#D1D5DB', border: 'rgba(156, 163, 175, 0.3)' },
  'Vue.js': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'Angular': { bg: 'rgba(239, 68, 68, 0.15)', text: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' },
  'Svelte': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },
  'Tailwind CSS': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'TailwindCSS': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },

  // Backend & Databases
  'Node.js': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'Express': { bg: 'rgba(156, 163, 175, 0.15)', text: '#D1D5DB', border: 'rgba(156, 163, 175, 0.3)' },
  'MongoDB': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'PostgreSQL': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'MySQL': { bg: 'rgba(147, 197, 253, 0.15)', text: '#93C5FD', border: 'rgba(147, 197, 253, 0.3)' },
  'Firebase': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FCD34D', border: 'rgba(251, 191, 36, 0.3)' },
  'Prisma': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },

  // Cloud & DevOps
  'AWS': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },
  'Docker': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'Kubernetes': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },
  'CI/CD': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },

  // Mobile Development
  'React Native': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'Flutter': { bg: 'rgba(147, 197, 253, 0.15)', text: '#93C5FD', border: 'rgba(147, 197, 253, 0.3)' },
  'Swift': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },

  // Design & UI/UX
  'Figma': { bg: 'rgba(232, 121, 249, 0.15)', text: '#E879F9', border: 'rgba(232, 121, 249, 0.3)' },
  'UI/UX': { bg: 'rgba(232, 121, 249, 0.15)', text: '#E879F9', border: 'rgba(232, 121, 249, 0.3)' },
  'Prototyping': { bg: 'rgba(232, 121, 249, 0.15)', text: '#E879F9', border: 'rgba(232, 121, 249, 0.3)' },
  'Mobile Design': { bg: 'rgba(249, 168, 212, 0.15)', text: '#F9A8D4', border: 'rgba(249, 168, 212, 0.3)' },
  'Mobile UI': { bg: 'rgba(249, 168, 212, 0.15)', text: '#F9A8D4', border: 'rgba(249, 168, 212, 0.3)' },
  'User Research': { bg: 'rgba(216, 180, 254, 0.15)', text: '#D8B4FE', border: 'rgba(216, 180, 254, 0.3)' },
  'Animation': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },

  // AI & Machine Learning
  'AI': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },
  'Machine Learning': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },
  'TensorFlow': { bg: 'rgba(249, 115, 22, 0.15)', text: '#FDBA74', border: 'rgba(249, 115, 22, 0.3)' },

  // Other Technologies
  'GraphQL': { bg: 'rgba(232, 121, 249, 0.15)', text: '#E879F9', border: 'rgba(232, 121, 249, 0.3)' },
  'REST API': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'WebSockets': { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA', border: 'rgba(96, 165, 250, 0.3)' },
  'Stripe': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },

  // General Categories
  'Algorithms': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },
  'Data Structures': { bg: 'rgba(99, 102, 241, 0.15)', text: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' },
  'Problem Solving': { bg: 'rgba(16, 185, 129, 0.15)', text: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' },
  'Academic Excellence': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FCD34D', border: 'rgba(251, 191, 36, 0.3)' },
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
  border: 'rgba(156, 163, 175, 0.3)',
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
