import { writeFileSync } from 'fs';
import { categories } from '../src/data/tools';

const domain = 'https://your-domain.com';

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${domain}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${categories
        .map(
          (category) => `
        <url>
          <loc>${domain}/category/${category.id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
        )
        .join('')}
      ${categories
        .flatMap((category) =>
          category.tools.map(
            (tool) => `
        <url>
          <loc>${domain}${tool.path}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
          )
        )
        .join('')}
    </urlset>`;

  writeFileSync('public/sitemap.xml', sitemap);
}

generateSitemap(); 