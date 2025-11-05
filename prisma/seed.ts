// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.blogPost.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.project.deleteMany();

  // Seed Projects
  const projects = await prisma.project.createMany({
    data: [
      {
        name: 'Portfolio Website',
        description: 'Personal portfolio built with Next.js, Prisma, and Tailwind CSS showcasing my work',
        url: 'https://github.com/yourusername/portfolio',
        type: 'CODING',
        tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
        imageUrl: '/img/projects/portfolio.png',
        githubUrl: 'https://github.com/yourusername/portfolio',
        liveUrl: 'https://yourportfolio.com',
        featured: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-01'),
      },
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce platform with payment integration and admin dashboard',
        url: 'https://github.com/yourusername/ecommerce',
        type: 'CODING',
        tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        imageUrl: '/img/projects/ecommerce.png',
        githubUrl: 'https://github.com/yourusername/ecommerce',
        liveUrl: 'https://demo-ecommerce.com',
        featured: true,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-11-01'),
      },
      {
        name: 'Mobile Banking App Redesign',
        description: 'Complete UX/UI redesign of a mobile banking application with user research',
        url: 'https://figma.com/file/your-design',
        type: 'CASE_STUDY',
        tags: ['Figma', 'UI/UX', 'Mobile Design', 'User Research'],
        imageUrl: '/img/projects/banking-app.png',
        githubUrl: null,
        liveUrl: null,
        featured: true,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-01'),
      },
      {
        name: 'Food Delivery App Concept',
        description: 'Modern food delivery app design with interactive Figma prototype',
        url: 'https://figma.com/file/food-delivery',
        type: 'CASE_STUDY',
        tags: ['Figma', 'Prototyping', 'Mobile UI', 'Animation'],
        imageUrl: '/img/projects/food-delivery.png',
        githubUrl: null,
        liveUrl: null,
        featured: false,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-07-15'),
      },
    ],
  });

  console.log(`✅ Created ${projects.count} projects`);

  // Seed Competitions
  const competitions = await prisma.competition.createMany({
    data: [
      {
        name: 'HackMIT 2024',
        type: 'Hackathon',
        description: 'Built an AI-powered study assistant that won 1st place among 200+ teams',
        result: '1st Place',
        organizer: 'MIT',
        imageUrl: '/img/competitions/hackmit.png',
        url: 'https://devpost.com/your-project',
        date: new Date('2024-09-15'),
        featured: true,
      },
      {
        name: 'Google Code Jam',
        type: 'Competition',
        description: 'Advanced to Round 2 in Google\'s annual coding competition',
        result: 'Round 2 Qualifier',
        organizer: 'Google',
        imageUrl: '/img/competitions/codejam.png',
        url: 'https://codingcompetitions.withgoogle.com',
        date: new Date('2024-04-20'),
        featured: true,
      },
      {
        name: 'Dean\'s List Award',
        type: 'Award',
        description: 'Recognized for academic excellence with a GPA above 3.75',
        result: 'Dean\'s List',
        organizer: 'University',
        imageUrl: null,
        url: null,
        date: new Date('2024-12-15'),
        featured: false,
      },
    ],
  });

  console.log(`✅ Created ${competitions.count} competitions`);

  // Seed Blog Posts
  const blogs = await prisma.blogPost.createMany({
    data: [
      {
        title: 'My Journey into Software Engineering',
        slug: 'journey-into-software-engineering',
        excerpt: 'Reflecting on my path from beginner to building production applications',
        content: `# My Journey into Software Engineering

When I first started learning to code, I had no idea where it would take me. This is my story...

## The Beginning

It all started with a simple "Hello World" program...

## Overcoming Challenges

The hardest part was...

## Where I Am Today

Now I'm building full-stack applications and loving every moment of it.`,
        coverImage: '/img/blog/journey.jpg',
        tags: ['Career', 'Reflection', 'Learning'],
        published: true,
        readTime: 5,
        publishedAt: new Date('2025-03-01'),
      },
      {
        title: 'Building Scalable Web Applications',
        slug: 'building-scalable-web-applications',
        excerpt: 'Best practices and lessons learned from building production-ready apps',
        content: `# Building Scalable Web Applications

Scaling is more than just handling more users...

## Architecture Patterns

Here are the patterns I use...

## Performance Optimization

Tips for keeping your app fast...`,
        coverImage: '/img/blog/scalable-apps.jpg',
        tags: ['Web Development', 'Architecture', 'Best Practices'],
        published: true,
        readTime: 8,
        publishedAt: new Date('2025-02-15'),
      },
      {
        title: 'The Importance of UI/UX in Software',
        slug: 'importance-of-ui-ux',
        excerpt: 'Why every developer should care about design and user experience',
        content: `# The Importance of UI/UX in Software

Great code means nothing if users can't use your product...

## User-Centered Design

Always start with the user...

## Tools and Resources

My favorite design tools...`,
        coverImage: '/img/blog/ui-ux.jpg',
        tags: ['UI/UX', 'Design', 'User Experience'],
        published: true,
        readTime: 6,
        publishedAt: new Date('2025-02-01'),
      },
    ],
  });

  console.log(`✅ Created ${blogs.count} blog posts`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
