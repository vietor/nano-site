export type PostStatus = 'draft' | 'published';

export interface Post {
  id: number;
  title: string;
  content: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  title: string;
  description: string;
}

export type MediaType = 'image' | 'video' | 'document' | 'audio';

export interface Media {
  id: number;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  passwordHash: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface MediaResponse {
  media: Media[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
