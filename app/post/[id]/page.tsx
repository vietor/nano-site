import { notFound } from 'next/navigation';
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

  if (!post || post.status === 'draft') {
    notFound();
  }

  return <PostTemplate config={config} post={post} />;
}
