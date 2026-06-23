import { loadConfig, getPostById, getAdjacentPosts, incrementViews } from '@/app/lib/model';
import { PostTemplate } from '@/app/templates';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = loadConfig();
  const post = getPostById(Number(id));
  let viewPost = null;
  let adjacent = { prev: null, next: null };
  if (post && post.status === 'published') {
    incrementViews(post.id);
    viewPost = { ...post, views: post.views + 1 };
    adjacent = getAdjacentPosts(post.id);
  }

  return <PostTemplate config={config} post={viewPost} adjacent={adjacent} />;
}
