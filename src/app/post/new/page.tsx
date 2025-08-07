"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PostService } from "@/services/post.service";
import { supabase } from "@/supabase-client";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function CreatePost() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url_image: "",
    read_time: "",
    full_content: ""
  });

  // Carregar usuários ao montar o componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('id, name, email')
          .order('name');

        if (error) throw error;

        setUsers(data || []);
        
        // Selecionar primeiro usuário por padrão (ou Wesley Dev se existir)
        if (data && data.length > 0) {
          const wesleyUser = data.find(user => user.name.toLowerCase().includes('wesley'));
          setSelectedUserId(wesleyUser?.id || data[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        setError('Erro ao carregar usuários');
      }
    };

    loadUsers();
  }, []);

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
    setError(null);

    try {
      if (!selectedUserId) {
        throw new Error('Selecione um autor');
      }

      // Criar post no Supabase
      await PostService.createPost({
        title: formData.title,
        content: formData.content,
        url_image: formData.url_image,
        author: selectedUserId, // UUID do usuário selecionado
        read_time: formData.read_time,
        tags: tags,
        full_content: formData.full_content
      });

      // Redirecionar para a home após sucesso
      router.push("/");
      router.refresh(); // Force refresh to show new post
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
                  <label htmlFor="full_content" className="text-sm font-medium text-slate-900 dark:text-white">
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
                    Você pode usar HTML para formatar o conteúdo: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;pre&gt;
                  </p>
                </div>

                {/* URL da imagem */}
                <div className="space-y-2">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Autor */}
                  <div className="space-y-2">
                    <label htmlFor="author" className="text-sm font-medium text-slate-900 dark:text-white">
                      Autor *
                    </label>
                    <select
                      id="author"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione um autor</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tempo de leitura */}
                  <div className="space-y-2">
                    <label htmlFor="read_time" className="text-sm font-medium text-slate-900 dark:text-white">
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
                    disabled={isLoading || !selectedUserId}
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