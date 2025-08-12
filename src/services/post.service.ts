/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/supabase-client";
import { Post, PostInsert } from "@/types/post.types";

export class PostService {
  static async getAllPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        usuarios:author (
          id,
          name,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar posts:", error);
      throw error;
    }

    return data || [];
  }

  static async getPostById(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        usuarios:author (
          id,
          name,
          email
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      console.error("Erro ao buscar post:", error);
      throw error;
    }

    return data;
  }

  static async createPost(post: Omit<PostInsert, 'author'>): Promise<Post> {
    // Verificar se usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([{
        ...post,
        author: user.id // UUID do usuário autenticado
      }])
      .select(`
        *,
        usuarios:author (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error("Erro ao criar post:", error);
      throw error;
    }

    return data;
  }

  // ✅ MÉTODO UPDATEPOST QUE ESTAVA FALTANDO
  static async updatePost(id: string, post: Partial<PostInsert>): Promise<Post> {
    const { data, error } = await supabase
      .from("posts")
      .update({ 
        ...post, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", id)
      .select(`
        *,
        usuarios:author (
          id,
          name,
          email
        )
      `)
      .single();

    if (error) {
      console.error("Erro ao atualizar post:", error);
      throw error;
    }

    return data;
  }

  static async deletePost(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.error("Erro ao deletar post:", error);
      throw error;
    }
  }

  // Função helper para formatar dados do Supabase para o formato da aplicação
  static formatPostForApp(post: any) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      urlImage: post.url_image,
      author: post.usuarios?.name || 'Autor desconhecido',
      publishedAt: new Date(post.published_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      readTime: post.read_time,
      tags: post.tags,
      fullContent: post.full_content,
    };
  }
}