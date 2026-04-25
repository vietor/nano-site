'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PostTemplate } from '@/app/templates';
import type { Post } from '@/app/shared/types';

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/posts?id=${params.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.json();
        })
        .then(data => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.id]);

  return <PostTemplate loading={loading} post={post} />;
}
