import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, ArrowLeft, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mockPosts } from "@/app/page";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Gerar as páginas estáticas para os posts mockados
export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;
  
  // Encontrar o post pelo ID
  const post = mockPosts.find(p => p.id === id);
  
  // Se o post não existir, retornar 404
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={post.urlImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag) => (
                <Badge 
                  key={tag}
                  className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {post.author?.charAt(0)}
                  </div>
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>{post.publishedAt}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Post Content */}
          <div 
            className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg space-y-6
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-8 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:leading-relaxed
              [&_ul]:my-4 [&_ul]:space-y-2 [&_ul]:ml-6
              [&_li]:list-disc [&_li]:ml-4
              [&_strong]:font-semibold [&_strong]:text-slate-900 [&_strong]:dark:text-white
              [&_code]:bg-slate-100 [&_code]:dark:bg-slate-800 [&_code]:text-teal-600 [&_code]:dark:text-teal-400 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_pre]:bg-slate-900 [&_pre]:dark:bg-slate-800 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-slate-200 [&_pre]:dark:border-slate-700
              [&_pre_code]:bg-transparent [&_pre_code]:text-slate-100 [&_pre_code]:p-0 [&_pre_code]:text-sm
              [&_a]:text-teal-600 [&_a]:dark:text-teal-400 [&_a]:hover:underline"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />

          {/* Post Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Tags:</span>
                {post.tags?.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                variant="outline"
                className="border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
              >
                <Share className="h-4 w-4 mr-2" />
                Share this post
              </Button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}