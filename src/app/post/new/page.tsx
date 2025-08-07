"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePosts } from "../../../contexts/PostContext";

export default function CreatePost() {
  const router = useRouter();
  const { addPost } = usePosts();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    urlImage: "",
    author: "Wesley Dev",
    readTime: "",
    fullContent: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular delay de criação
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Adicionar o post usando o contexto
      addPost({
        title: formData.title,
        content: formData.content,
        urlImage: formData.urlImage,
        author: formData.author,
        readTime: formData.readTime,
        tags: tags,
        fullContent: formData.fullContent
      });

      // Redirecionar para a home
      router.push("/");
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
              Voltar ao blog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                Criar novo post
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Compartilhe seus conhecimentos e insights com a comunidade
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-900 dark:text-white">
                    Título do post *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Digite o título do seu post..."
                    required
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Descrição curta */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium text-slate-900 dark:text-white">
                    Descrição curta *
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Escreva uma breve descrição do seu post..."
                    rows={3}
                    required
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Conteúdo completo */}
                <div className="space-y-2">
                  <label htmlFor="fullContent" className="text-sm font-medium text-slate-900 dark:text-white">
                    Conteúdo completo (HTML) *
                  </label>
                  <Textarea
                    id="fullContent"
                    name="fullContent"
                    value={formData.fullContent}
                    onChange={handleInputChange}
                    placeholder="Digite o conteúdo completo usando HTML..."
                    rows={10}
                    required
                    className="border-slate-200 dark:border-slate-700 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Você pode usar HTML para formatar o conteúdo: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;pre&gt;
                  </p>
                </div>

                {/* URL da imagem */}
                <div className="space-y-2">
                  <label htmlFor="urlImage" className="text-sm font-medium text-slate-900 dark:text-white">
                    URL da imagem *
                  </label>
                  <Input
                    id="urlImage"
                    name="urlImage"
                    type="url"
                    value={formData.urlImage}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Autor */}
                  <div className="space-y-2">
                    <label htmlFor="author" className="text-sm font-medium text-slate-900 dark:text-white">
                      Autor *
                    </label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      required
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>

                  {/* Tempo de leitura */}
                  <div className="space-y-2">
                    <label htmlFor="readTime" className="text-sm font-medium text-slate-900 dark:text-white">
                      Tempo de leitura *
                    </label>
                    <Input
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      placeholder="5 min read"
                      required
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium text-slate-900 dark:text-white">
                    Tags
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Digite uma tag e pressione Enter"
                      className="border-slate-200 dark:border-slate-700"
                    />
                    <Button 
                      type="button" 
                      onClick={addTag}
                      variant="outline"
                      className="border-slate-200 dark:border-slate-700"
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 pr-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/">
                    <Button 
                      type="button" 
                      variant="outline"
                      className="border-slate-200 dark:border-slate-700"
                    >
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Criar post
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}