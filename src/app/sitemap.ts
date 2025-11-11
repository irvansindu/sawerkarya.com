import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.sawerkarya.com';
  const routes = ['', '/produk', '/tentang', '/kontak', '/demo', '/tos', '/privasi'];
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
}
