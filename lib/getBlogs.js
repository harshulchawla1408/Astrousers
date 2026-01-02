import fs from 'fs';
import path from 'path';
import { parseMarkdown, getMarkdownFiles } from './markdown';

const contentDir = path.join(process.cwd(), 'content', 'blogs');

/**
 * Get all blogs from a specific category
 */
export function getBlogsByCategory(category) {
  const categoryDir = path.join(contentDir, category);
  const markdownFiles = getMarkdownFiles(categoryDir);

  const blogs = markdownFiles
    .map(filePath => {
      const parsed = parseMarkdown(filePath);
      if (!parsed) return null;

      const slug = path.basename(filePath, '.md');
      const { data, content } = parsed;

      return {
        slug,
        category,
        title: data.title || '',
        description: data.description || '',
        date: data.date || '',
        heroImage: data.heroImage || '',
        tags: data.tags || [],
        excerpt: content.substring(0, 200).replace(/[#*]/g, '').trim() + '...'
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return blogs;
}

/**
 * Get all blogs across all categories
 */
export function getAllBlogs() {
  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const allBlogs = [];

  categories.forEach(category => {
    const blogs = getBlogsByCategory(category);
    allBlogs.push(...blogs);
  });

  return allBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get blog slugs for a category (for static generation)
 */
export function getBlogSlugs(category) {
  const categoryDir = path.join(contentDir, category);
  const markdownFiles = getMarkdownFiles(categoryDir);

  return markdownFiles.map(filePath => ({
    slug: path.basename(filePath, '.md'),
    category
  }));
}

/**
 * Get all category slugs
 */
export function getCategorySlugs() {
  try {
    const categories = fs.readdirSync(contentDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    return categories;
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

