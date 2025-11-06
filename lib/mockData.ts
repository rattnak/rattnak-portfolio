// lib/mockData.ts - Temporary mock data until database is synced

type ProjectType = "CODING" | "CASE_STUDY";

export const mockProjects = [
  {
    id: 1,
    name: 'Portfolio Website',
    description: 'Personal portfolio built with Next.js, Prisma, and Tailwind CSS showcasing my work',
    url: 'https://github.com/yourusername/portfolio',
    type: 'CODING' as ProjectType,
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
    imageUrl: '/img/projects/portfolio.png',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    featured: true,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-03-01'),
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with payment integration and admin dashboard',
    url: 'https://github.com/yourusername/ecommerce',
    type: 'CODING' as ProjectType,
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    imageUrl: '/img/projects/ecommerce.png',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://demo-ecommerce.com',
    featured: true,
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-11-01'),
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Mobile Banking App Redesign',
    description: 'Complete UX/UI redesign of a mobile banking application with user research',
    url: 'https://figma.com/file/your-design',
    type: 'CASE_STUDY' as ProjectType,
    tags: ['Figma', 'UI/UX', 'Mobile Design', 'User Research'],
    imageUrl: '/img/projects/banking-app.png',
    githubUrl: null,
    liveUrl: null,
    featured: true,
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-01'),
    createdAt: new Date(),
  },
  {
    id: 4,
    name: 'Food Delivery App Concept',
    description: 'Modern food delivery app design with interactive Figma prototype',
    url: 'https://figma.com/file/food-delivery',
    type: 'CASE_STUDY' as ProjectType,
    tags: ['Figma', 'Prototyping', 'Mobile UI', 'Animation'],
    imageUrl: '/img/projects/food-delivery.png',
    githubUrl: null,
    liveUrl: null,
    featured: false,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-07-15'),
    createdAt: new Date(),
  },
  {
    id: 5,
    name: 'Task Management App',
    description: 'Collaborative task management tool with real-time updates',
    url: 'https://github.com/yourusername/task-app',
    type: 'CODING' as ProjectType,
    tags: ['Vue.js', 'Firebase', 'WebSockets', 'TailwindCSS'],
    imageUrl: null,
    githubUrl: 'https://github.com/yourusername/task-app',
    liveUrl: 'https://task-demo.com',
    featured: false,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-01'),
    createdAt: new Date(),
  },
];

export const mockCompetitions = [
  {
    id: 1,
    name: 'HackMIT 2024',
    type: 'Hackathon',
    description: 'Built an AI-powered study assistant that won 1st place among 200+ teams',
    content: `## The Challenge

At HackMIT 2024, our team set out to solve a common problem faced by students: inefficient study habits and information overload. We wanted to create an intelligent study companion that could understand individual learning patterns and provide personalized assistance.

## Our Solution

We developed an AI-powered study assistant that combines natural language processing with spaced repetition algorithms. The application analyzes study materials, generates custom quizzes, and adapts to each user's learning pace and style.

### Key Features
- **Smart Content Analysis**: Automatically extracts key concepts from study materials
- **Personalized Quizzing**: Generates questions based on user's weak areas
- **Progress Tracking**: Visual analytics dashboard showing learning progress
- **Collaborative Study**: Real-time study groups with shared flashcards

## Technical Implementation

Built with React for the frontend and Python with FastAPI for the backend. We integrated OpenAI's GPT-4 for content analysis and question generation, and implemented a custom spaced repetition algorithm based on the SM-2 algorithm.

## Impact

Our project impressed the judges with its practical application and technical execution. We competed against 200+ teams and secured 1st place. The project has since been used by over 500 students at MIT.`,
    result: '1st Place',
    organizer: 'MIT',
    imageUrl: '/img/competitions/hackmit.png',
    url: 'https://devpost.com/your-project',
    tags: ['AI', 'Machine Learning', 'React', 'Python'],
    date: new Date('2024-09-15'),
    featured: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Google Code Jam',
    type: 'Competition',
    description: 'Advanced to Round 2 in Google\'s annual coding competition',
    content: `## About the Competition

Google Code Jam is one of the most prestigious coding competitions in the world, attracting tens of thousands of participants globally. The competition tests algorithmic thinking, problem-solving skills, and implementation speed across multiple rounds.

## My Journey

### Qualification Round
Successfully solved 4 out of 5 problems within the time limit, securing a spot in Round 1 with a top 20% ranking.

### Round 1
Advanced to Round 2 by solving challenging problems involving:
- Dynamic programming optimization
- Graph theory algorithms
- Number theory and combinatorics

## Key Achievements

- Ranked in the top 3,000 globally out of 30,000+ participants
- Demonstrated proficiency in competitive programming techniques
- Solved complex algorithmic challenges under time pressure

## Skills Developed

This competition significantly improved my ability to:
- Break down complex problems into manageable components
- Optimize algorithms for time and space complexity
- Work efficiently under pressure
- Debug code quickly and effectively`,
    result: 'Round 2 Qualifier',
    organizer: 'Google',
    imageUrl: '/img/competitions/codejam.png',
    url: 'https://codingcompetitions.withgoogle.com',
    tags: ['Algorithms', 'Data Structures', 'Problem Solving'],
    date: new Date('2024-04-20'),
    featured: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Dean\'s List Award',
    type: 'Award',
    description: 'Recognized for academic excellence with a GPA above 3.75',
    content: `## Academic Achievement

The Dean's List is a prestigious academic honor awarded to students who demonstrate exceptional performance in their coursework. This recognition reflects consistent dedication to academic excellence throughout the semester.

## Requirements

- Maintain a GPA of 3.75 or higher
- Complete a full course load (minimum 12 credits)
- Demonstrate academic integrity and ethical conduct

## Significance

This achievement represents:
- Strong foundational knowledge across multiple disciplines
- Effective time management and study skills
- Commitment to continuous learning and improvement
- Balance between academic rigor and personal development

## Academic Focus

My coursework this semester included:
- Advanced algorithms and data structures
- Software engineering principles
- Database systems
- Web application development
- Computer systems architecture

This recognition motivates me to continue pursuing academic excellence while applying classroom knowledge to real-world projects.`,
    result: 'Dean\'s List',
    organizer: 'University',
    imageUrl: null,
    url: null,
    tags: ['Academic Excellence'],
    date: new Date('2024-12-15'),
    featured: false,
    createdAt: new Date(),
  },
];

export const mockBlogPosts = [
  {
    id: 1,
    title: 'My Journey into Software Engineering',
    slug: 'journey-into-software-engineering',
    excerpt: 'Reflecting on my path from beginner to building production applications',
    content: '',
    coverImage: '/img/blog/journey.jpg',
    tags: ['Career', 'Reflection', 'Learning'],
    published: true,
    readTime: 5,
    publishedAt: new Date('2025-03-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Building Scalable Web Applications',
    slug: 'building-scalable-web-applications',
    excerpt: 'Best practices and lessons learned from building production-ready apps',
    content: '',
    coverImage: '/img/blog/scalable-apps.jpg',
    tags: ['Web Development', 'Architecture', 'Best Practices'],
    published: true,
    readTime: 8,
    publishedAt: new Date('2025-02-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: 'The Importance of UI/UX in Software',
    slug: 'importance-of-ui-ux',
    excerpt: 'Why every developer should care about design and user experience',
    content: '',
    coverImage: '/img/blog/ui-ux.jpg',
    tags: ['UI/UX', 'Design', 'User Experience'],
    published: true,
    readTime: 6,
    publishedAt: new Date('2025-02-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
