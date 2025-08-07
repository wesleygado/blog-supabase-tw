export interface Post {
  id: string;
  title: string;
  content: string;
  url_image: string;
  author: string;
  published_at: string;
  read_time: string;
  tags: string[];
  full_content: string;
  created_at: string;
  updated_at: string;
}

export interface PostInsert {
  title: string;
  content: string;
  url_image: string;
  author: string;
  read_time: string;
  tags: string[];
  full_content: string;
}