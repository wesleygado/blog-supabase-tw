import { supabase } from "../supabase-client";
import { Post, PostInsert } from "../types/post.types";

export class PostService {
  static async getAllPosts(): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
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
      .select(
        `
      *,
      usuarios:author (
        id,
        name,
        email
      )
    `
      )
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

  static async createPost(post: PostInsert): Promise<Post> {
    const { data, error } = await supabase
      .from("posts")
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar post:", error);
      throw error;
    }

    return data;
  }

  static async updatePost(
    id: string,
    post: Partial<PostInsert>
  ): Promise<Post> {
    const { data, error } = await supabase
      .from("posts")
      .update({ ...post, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static formatPostForApp(post: any) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      urlImage: post.url_image,
      author: post.author, // Fallback para o campo antigo
      publishedAt: new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: post.read_time,
      tags: post.tags,
      fullContent: post.full_content,
      usuarios: post.usuarios
    };
  }
}
