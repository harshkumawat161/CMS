import { MetadataRoute } from 'next';
import portfolioApi from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/skills`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  try {
    const [projects, blogsRes] = await Promise.all([
      portfolioApi.getProjects(),
      portfolioApi.getBlogs(0, 100),
    ]);

    const projectRoutes: MetadataRoute.Sitemap = (projects || [])
      .filter((p) => p.status === 'PUBLISHED' && p.slug)
      .map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));

    const blogRoutes: MetadataRoute.Sitemap = (blogsRes?.content || [])
      .filter((b) => b.status === 'PUBLISHED' && b.slug)
      .map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.publishedAt ? new Date(b.publishedAt) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...projectRoutes, ...blogRoutes];
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
    return staticRoutes;
  }
}
