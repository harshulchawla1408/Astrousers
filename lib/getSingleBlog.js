import fs from 'fs';
import path from 'path';
import { parseMarkdown } from './markdown';
import { getBlogsByCategory } from './getBlogs';

const contentDir = path.join(process.cwd(), 'content', 'blogs');

/**
 * Get a single blog by category and slug
 */
export function getBlogBySlug(category, slug) {
  const filePath = path.join(contentDir, category, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const parsed = parseMarkdown(filePath);
  if (!parsed) {
    return null;
  }

  const { data, content } = parsed;

  return {
    slug,
    category,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    heroImage: data.heroImage || '',
    images: data.images || [],
    tags: data.tags || [],
    content
  };
}

/**
 * Get related blogs (3 from same category, excluding current blog)
 */
export function getRelatedBlogs(category, currentSlug, limit = 3) {
  const allBlogs = getBlogsByCategory(category);
  
  // Filter out current blog and get random selection
  const related = allBlogs
    .filter(blog => blog.slug !== currentSlug)
    .slice(0, limit);

  return related;
}

