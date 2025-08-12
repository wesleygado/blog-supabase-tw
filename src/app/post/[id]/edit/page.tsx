"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, X, Save, Upload, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { PostService } from "@/services/post.service";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase-client";
import Image from "next/image";

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<any>(null);
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [keepCurrentImage, setKeepCurrentImage] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url_image: "",
    read_time: "",
    full_content: ""
  });

  // Carregar dados do post
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar dados do post
        const postData = await PostService.getPostById(postId);
        if (!postData) {
          setError('Post não encontrado');
          return;
        }

        setPost(postData);

        // Verificar se o usuário é o autor do post
        if (user && postData.author !== user.id) {
          setError('Você não tem permissão para editar este post');
          return;
        }

        // Preencher formulário com dados do post
        setFormData({
          title: postData.title,
          content: postData.content,
          url_image: postData.url_image,
          read_time: postData.read_time,
          full_content: postData.full_content
        });

        // Definir preview da imagem atual
        setImagePreview(postData.url_image);
        setTags(postData.tags || []);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar dados do post');
      } finally {
        setIsLoadingPost(false);
      }
    };

    if (postId && user) {
      loadData();
    } else if (!user) {
      setError('Você precisa estar logado para editar posts');
      setIsLoadingPost(false);
    }
  }, [postId, user]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPostImage(file);
      setKeepCurrentImage(false);
      
      // Criar preview da nova imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      .from("posts-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const resetImageToOriginal = () => {
    setPostImage(null);
    setKeepCurrentImage(true);
    setImagePreview(formData.url_image);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let urlImage: string | null = formData.url_image; // Manter imagem atual por padrão

      // Se selecionou uma nova imagem, fazer upload
      if (postImage && !keepCurrentImage) {
        const uploadedImageUrl = await uploadImage(postImage);
        if (uploadedImageUrl) {
          urlImage = uploadedImageUrl;
        } else {
          throw new Error('Erro ao fazer upload da imagem');
        }
      }

      // Atualizar post no Supabase
      await PostService.updatePost(postId, {
        title: formData.title,
        content: formData.content,
        url_image: urlImage,
        read_time: formData.read_time,
        tags: tags,
        full_content: formData.full_content
      });

      // Redirecionar para o post atualizado
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error("Erro ao atualizar post:", error);
      setError("Erro ao atualizar o post. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <div className="space-x-4">
            <Link href="/">
              <Button>Voltar ao blog</Button>
            </Link>
            {error.includes('logado') && (
              <Link href="/auth/login">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  Fazer Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <Link 
              href={`/post/${postId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao post
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
                Editar post
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400">
                Atualize as informações do seu post
              </p>
              {post && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    📝 Editando como: <strong>{user?.email}</strong>
                  </p>
                </div>
              )}
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

                {/* Imagem do post */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    Imagem do post *
                  </label>
                  
                  {/* Preview da imagem atual */}
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Opções de imagem */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageOption"
                          checked={keepCurrentImage}
                          onChange={() => {
                            setKeepCurrentImage(true);
                            setPostImage(null);
                            setImagePreview(formData.url_image);
                          }}
                          className="text-teal-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Manter imagem atual
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageOption"
                          checked={!keepCurrentImage}
                          onChange={() => setKeepCurrentImage(false)}
                          className="text-teal-600"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Trocar imagem
                        </span>
                      </label>
                    </div>

                    {/* Upload de nova imagem */}
                    {!keepCurrentImage && (
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="border-slate-200 dark:border-slate-700"
                        />
                        {postImage && (
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <Upload className="h-4 w-4" />
                            <span>Nova imagem selecionada: {postImage.name}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={resetImageToOriginal}
                              className="ml-auto border-slate-200 dark:border-slate-700"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                  <Link href={`/post/${postId}`}>
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
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Atualizar post
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