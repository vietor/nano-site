import { loadConfig, getPostById } from '@/app/lib/model';
import { PostTemplate } from '@/app/templates';

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const config = loadConfig();
  const post = getPostById(Number(id));
  const viewPost = post && post.status !== 'published'? post: null;

  return <PostTemplate config={config} post={viewPost} />;
}
