import type { MetadataRoute } from "next";
import { getTopics } from "@/lib/db";

// 话题列表随时变化，按请求生成，避免构建期依赖数据库
export const dynamic = "force-dynamic";

const BASE_URL = "https://boxuezhe.cc";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let topics: Awaited<ReturnType<typeof getTopics>> = [];
  try {
    topics = await getTopics();
  } catch {
    // 数据库暂时不可用时也要返回可用的 sitemap
    topics = [];
  }

  const topicEntries: MetadataRoute.Sitemap = topics.map(({ topic, lastActivity }) => ({
    url: `${BASE_URL}/topics/${topic.id}`,
    lastModified: lastActivity ? new Date(`${lastActivity}T00:00:00+08:00`) : undefined,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/topics/new`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...topicEntries,
  ];
}
