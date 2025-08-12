export interface Post {
  id: string; // UUID como string
  title: string;
  content: string;
  url_image: string;
  author: string; // UUID como string
  published_at: string;
  read_time: string;
  tags: string[];
  full_content: string;
  created_at: string;
  updated_at: string;
  usuarios?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PostInsert {
  title: string;
  content: string;
  url_image: string | null;
  author: string; // UUID como string
  read_time: string;
  tags: string[];
  full_content: string;
}