import type { SiteConfig, Post } from '@/app/shared/types';

export interface HomeTemplateProps {
  config: SiteConfig;
  posts: Post[];
  page: number;
  totalPages: number;
}

export interface PostTemplateProps {
  config: SiteConfig;
  post: Post | null;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
