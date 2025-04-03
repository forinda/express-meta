export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePostDto extends Omit<Post, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdatePostDto extends Partial<CreatePostDto> {} 