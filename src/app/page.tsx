import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Clock, ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PostService } from "@/services/post.service";

interface FormattedPost {
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


export default async function Home() {
  let posts: FormattedPost[];
  
  try {
    const supabasePosts = await PostService.getAllPosts();
    posts = supabasePosts.map(PostService.formatPostForApp);
  } catch (error) {
    console.error('Erro ao carregar posts:', error);
    posts = [];
  }

  console.log(posts);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
                  Tech Blog
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Insights and tutorials for modern web development
                </p>
              </div>
              <Link href="/post/new">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar novo post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">
                Nenhum post encontrado. Que tal criar o primeiro?
              </p>
              <Link href="/post/new">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro post
                </Button>
              </Link>
            </div>
          ) : (
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
                            <span>{post.publishedAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readTime}</span>
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
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge 
                              key={tag}
                              className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge 
                              variant="outline"
                              className="text-xs"
                            >
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
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
          )}
        </div>
      </main>
    </div>
  );
}