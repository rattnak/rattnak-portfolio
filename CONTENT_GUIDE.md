# Content Management Guide

This guide explains how to easily add and modify content in your portfolio.

## Quick Start

All your portfolio content is stored in **`lib/mockData.ts`**. You can edit this file directly to:
- Add new projects
- Add new achievements
- Add new blog posts
- Update existing content

## Adding a New Project

Open `lib/mockData.ts` and add a new entry to the `mockProjects` array:

```typescript
{
  id: 6, // Use the next available number
  name: 'Your Project Name',
  description: 'A brief description of your project',
  url: 'https://github.com/yourusername/project', // Main URL
  type: 'CODING', // or 'CASE_STUDY' for design projects
  tags: ['React', 'TypeScript', 'Next.js'], // Add relevant skills
  imageUrl: '/img/projects/your-project.png', // Optional: Add image to public/img/projects/
  githubUrl: 'https://github.com/yourusername/project', // Optional
  liveUrl: 'https://your-project.com', // Optional
  featured: true, // Set to true to highlight this project
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-03-01'), // Or null if ongoing
  createdAt: new Date(),
}
```

### Project Types
- **`CODING`**: For development projects (shows GitHub link)
- **`CASE_STUDY`**: For design projects (shows Figma/design link)

## Adding a New Achievement

Add to the `mockCompetitions` array in `lib/mockData.ts`:

```typescript
{
  id: 4, // Use the next available number
  name: 'Your Competition/Award Name',
  type: 'Hackathon', // or 'Competition', 'Award', etc.
  description: 'What you achieved and how',
  result: '1st Place', // Your result/award
  organizer: 'Organization Name',
  imageUrl: '/img/competitions/certificate.png', // Optional
  url: 'https://devpost.com/your-project', // Optional
  tags: ['React', 'AI', 'Machine Learning'], // Skills used
  date: new Date('2025-01-15'),
  featured: true, // Set to true to highlight
  createdAt: new Date(),
}
```

## Adding a New Blog Post

Add to the `mockBlogPosts` array in `lib/mockData.ts`:

```typescript
{
  id: 4, // Use the next available number
  title: 'Your Blog Post Title',
  slug: 'your-blog-post-url', // URL-friendly version
  excerpt: 'A short preview of your post',
  content: '', // Full content (can add later)
  coverImage: '/img/blog/your-image.jpg', // Optional
  tags: ['Web Development', 'Tutorial'],
  published: true,
  readTime: 5, // Minutes to read
  publishedAt: new Date('2025-01-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## Managing Skill Tags

### Adding Colors for New Skills

If you add a new skill tag that doesn't have a color, you can add it to `lib/tagColors.ts`:

```typescript
// In TAG_COLORS object (light mode)
'Your Skill': {
  bg: '#DBEAFE',      // Light background color
  text: '#1E40AF',    // Text color
  border: '#60A5FA'   // Border color
},

// In TAG_COLORS_DARK object (dark mode)
'Your Skill': {
  bg: 'rgba(96, 165, 250, 0.15)',      // Transparent background
  text: '#60A5FA',                      // Bright text color
  border: 'rgba(96, 165, 250, 0.3)'    // Transparent border
},
```

### Pre-configured Skills

These skills already have colorful tags configured:
- **Languages**: JavaScript, TypeScript, Python, Java, Go, Rust, C++
- **Frontend**: React, Next.js, Vue.js, Angular, Svelte, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, PostgreSQL, MySQL, Firebase, Prisma
- **Cloud**: AWS, Docker, Kubernetes, CI/CD
- **Mobile**: React Native, Flutter, Swift
- **Design**: Figma, UI/UX, Prototyping, Mobile Design, Animation
- **AI/ML**: AI, Machine Learning, TensorFlow
- **Other**: GraphQL, REST API, WebSockets, Stripe, Algorithms

## Adding Images

1. Create the appropriate folder in `public/img/`:
   - `public/img/projects/` for project images
   - `public/img/competitions/` for achievement images
   - `public/img/blog/` for blog post images

2. Add your image files to the folder

3. Reference them in your data:
   ```typescript
   imageUrl: '/img/projects/my-project.png'
   ```

## Tips for Best Results

### Projects
- **Keep descriptions concise**: 1-2 sentences that clearly explain what the project does
- **Use specific tags**: Choose technologies you actually used
- **Add images**: Projects with images look more professional
- **Feature your best work**: Set `featured: true` for your top 3-5 projects

### Achievements
- **Be specific about results**: "1st Place out of 200 teams" is better than just "Winner"
- **Explain the impact**: What did you build? What problem did it solve?
- **Add proof**: Link to Devpost, certificates, or competition pages

### Tags/Skills
- **Use consistent naming**: "React" not "react" or "ReactJS"
- **Order by importance**: Put the most relevant technologies first
- **Limit the number**: 3-6 tags per item is ideal
- **Match existing names**: Use the same tag names across projects for consistency

## Data Validation

Make sure your data follows these rules:

- ✅ **IDs are unique**: Each item needs its own ID number
- ✅ **Dates are valid**: Use `new Date('YYYY-MM-DD')` format
- ✅ **URLs start with http**: Use full URLs like `https://example.com`
- ✅ **Image paths start with /**: Like `/img/projects/image.png`
- ✅ **Tags are strings**: Use array of strings like `['React', 'TypeScript']`

## Common Issues

**Tags appear gray instead of colored?**
- Check that the tag name exactly matches one in `lib/tagColors.ts`
- Capitalization matters: "TypeScript" ✅ "typescript" ❌

**Images not showing?**
- Verify the image exists in `public/img/`
- Check the path starts with `/img/` not `./img/` or `img/`
- Make sure the filename matches exactly (including extension)

**Projects/Achievements not appearing?**
- Make sure you added them to the correct array in `lib/mockData.ts`
- Verify the syntax is correct (no missing commas or brackets)
- Check the browser console for errors

## Future: Database Migration

Currently using mock data in `lib/mockData.ts`. When you're ready to migrate to a database:

1. The Prisma schema is already set up in `prisma/schema.prisma`
2. Run `npm run db:push` to create database tables
3. Use the admin panel (when implemented) to manage content
4. Update components to fetch from database instead of mock data

For now, editing `lib/mockData.ts` directly is the easiest way to manage your content!
