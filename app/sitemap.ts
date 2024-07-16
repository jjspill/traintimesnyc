import { MetadataRoute } from 'next';

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://traintimesnyc.com'; // Default to a fixed base URL
  // const domain = `https://${process.env.NEXT_PUBLIC_VERCEL_URL || baseUrl}`;
  const domain = baseUrl;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${domain}`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
    {
      url: `${domain}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
  ];

  return staticPages;
}

export default sitemap;
