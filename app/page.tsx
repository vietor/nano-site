import { getPagedPublishedPosts, loadConfig } from "@/app/lib/model";
import { HomeTemplate } from "./templates";
import { PAGE_SIZE } from "./lib/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolved = await searchParams;
  const page = resolved.page ? parseInt(resolved.page) : 1;
  const config = loadConfig();
  const { posts, totalPages } = getPagedPublishedPosts(page, PAGE_SIZE);

  return (
    <HomeTemplate
      config={config}
      posts={posts}
      page={page}
      totalPages={totalPages}
    />
  );
}
