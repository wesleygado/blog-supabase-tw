"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Save, Target } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase-client";

export default function NewPostPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url_image: "",
    read_time: "",
    full_content: "",
  });

  // Redirecionar se não estiver logado
  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Você precisa estar logado para criar posts.
          </p>
          <Link href="/auth/login">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPostImage(e.target.files[0]);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;

    const { error } = await supabase.storage
      .from("posts-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading image: " + error);
      return null;
    }

    const { data } = await supabase.storage
      .from("posts-images").getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    let urlImage: string | null = null;

    if (postImage) {
      urlImage = await uploadImage(postImage);
    }

    try {
      // Criar post no Supabase (o autor será automaticamente o usuário logado)
      await PostService.createPost({
        title: formData.title,
        content: formData.content,
        url_image: urlImage,
        read_time: formData.read_time,
        tags: tags,
        full_content: formData.full_content,
      });

      // Redirecionar para a home após sucesso
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar post:", error);
      setError("Erro ao criar o post. Tente novamente.");
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
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  📝 Criando como: <strong>{user.email}</strong>
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
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
                  <label
                    htmlFor="content"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
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
                  <label
                    htmlFor="full_content"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
                    Conteúdo completo (HTML) *
                  </label>
                  <Textarea
                    id="full_content"
                    name="full_content"
                    value={formData.full_content}
                    onChange={handleInputChange}
                    placeholder="Digite o conteúdo completo usando HTML..."
                    rows={10}
                    required
                    className="border-slate-200 dark:border-slate-700 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Você pode usar HTML para formatar o conteúdo: &lt;h2&gt;,
                    &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;,
                    &lt;strong&gt;, &lt;code&gt;, &lt;pre&gt;
                  </p>
                </div>

                {/* URL da imagem */}
                <div className="space-y-2">
                  <label
                    htmlFor="upload_image"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
                    Upload da imagem *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                {/* <div className="space-y-2">
                  <label htmlFor="url_image" className="text-sm font-medium text-slate-900 dark:text-white">
                    URL da imagem *
                  </label>
                  <Input
                    id="url_image"
                    name="url_image"
                    type="url"
                    value={formData.url_image}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div> */}

                {/* Tempo de leitura */}
                <div className="space-y-2">
                  <label
                    htmlFor="read_time"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
                    Tempo de leitura *
                  </label>
                  <Input
                    id="read_time"
                    name="read_time"
                    value={formData.read_time}
                    onChange={handleInputChange}
                    placeholder="5 min read"
                    required
                    className="border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label
                    htmlFor="tags"
                    className="text-sm font-medium text-slate-900 dark:text-white"
                  >
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
                    className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
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
