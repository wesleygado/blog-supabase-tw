import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  urlImage: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  fullContent: string;
}

// Posts mockados
export const mockPosts: Post[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    content: "Learn how to build modern web applications with Next.js 14 and its latest features including App Router, Server Components, and improved performance.",
    urlImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    author: "Wesley Dev",
    publishedAt: "Aug 4, 2025",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Development", "TypeScript"],
    fullContent: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 brings significant improvements to the React development experience with enhanced App Router capabilities, improved Server Components, and better performance optimizations.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>App Router:</strong> The new routing system provides better performance and developer experience</li>
        <li><strong>Server Components:</strong> Improved server-side rendering capabilities</li>
        <li><strong>Turbopack:</strong> Faster build times and hot reload</li>
        <li><strong>Improved TypeScript support:</strong> Better type safety and IntelliSense</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>To create a new Next.js 14 project, you can use the following command:</p>
      <pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint</code></pre>
      
      <h3>Conclusion</h3>
      <p>Next.js 14 represents a significant step forward in React development, offering improved performance, better developer experience, and more powerful features for building modern web applications.</p>
    `
  },
  {
    id: "2",
    title: "Mastering TypeScript in 2025",
    content: "Dive deep into TypeScript's advanced features and learn how to write type-safe code that scales with your applications.",
    urlImage: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200&h=600&fit=crop",
    author: "Ana Silva",
    publishedAt: "Aug 3, 2025",
    readTime: "8 min read",
    tags: ["TypeScript", "JavaScript", "Programming", "Development"],
    fullContent: `
      <h2>Advanced TypeScript Features</h2>
      <p>TypeScript has evolved significantly, offering powerful features that help developers write more maintainable and type-safe code.</p>
      
      <h3>Utility Types</h3>
      <p>TypeScript provides several utility types that help transform types:</p>
      <ul>
        <li><strong>Partial&lt;T&gt;:</strong> Makes all properties optional</li>
        <li><strong>Required&lt;T&gt;:</strong> Makes all properties required</li>
        <li><strong>Pick&lt;T, K&gt;:</strong> Creates a type with selected properties</li>
        <li><strong>Omit&lt;T, K&gt;:</strong> Creates a type without certain properties</li>
      </ul>
      
      <h3>Template Literal Types</h3>
      <p>One of the most powerful features introduced in recent versions:</p>
      <pre><code>type Color = "red" | "blue" | "green"
type Size = "small" | "medium" | "large"
type ClassName = \`\${Color}-\${Size}\`</code></pre>
      
      <h3>Best Practices</h3>
      <p>Following these practices will help you write better TypeScript code and avoid common pitfalls.</p>
    `
  },
  {
    id: "3",
    title: "Building APIs with Supabase",
    content: "Discover how to create powerful backend APIs using Supabase's real-time database, authentication, and edge functions.",
    urlImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop",
    author: "Carlos Santos",
    publishedAt: "Aug 2, 2025",
    readTime: "12 min read",
    tags: ["Supabase", "API", "Database", "Backend"],
    fullContent: `
      <h2>Getting Started with Supabase</h2>
      <p>Supabase is an open-source Firebase alternative that provides a complete backend solution with PostgreSQL database, authentication, and real-time capabilities.</p>
      
      <h3>Setting Up Your Project</h3>
      <p>Create a new Supabase project and install the client library:</p>
      <pre><code>npm install @supabase/supabase-js</code></pre>
      
      <h3>Database Operations</h3>
      <p>Supabase provides a simple API for database operations:</p>
      <ul>
        <li><strong>Insert:</strong> Add new records to your tables</li>
        <li><strong>Select:</strong> Query data with filters and joins</li>
        <li><strong>Update:</strong> Modify existing records</li>
        <li><strong>Delete:</strong> Remove records from tables</li>
      </ul>
      
      <h3>Real-time Features</h3>
      <p>One of Supabase's standout features is real-time subscriptions:</p>
      <pre><code>const subscription = supabase
  .from('posts')
  .on('INSERT', payload => {
    console.log('New post:', payload.new)
  })
  .subscribe()</code></pre>
      
      <h3>Authentication</h3>
      <p>Supabase provides built-in authentication with multiple providers and easy-to-use APIs for managing user sessions.</p>
    `
  }
];

export default function Home() {
  const posts = mockPosts;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
              Tech Blog
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Insights and tutorials for modern web development
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900 p-0"
              >
                <div className="md:flex h-full">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <Image
                      src={post.urlImage}
                      alt={post.title}
                      width={400}
                      height={280}
                      className="w-full h-48 md:h-full min-h-[280px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardContent className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>Aug 4, 2025</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>5 min read</span>
                        </div>
                      </div>

                      <CardTitle className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {post.title}
                      </CardTitle>

                      <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base">
                        {post.content}
                      </CardDescription>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50">
                        Development
                      </Badge>
                      <Link href={`/post/${post.id}`}>
                        <button className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors group">
                          Read more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
