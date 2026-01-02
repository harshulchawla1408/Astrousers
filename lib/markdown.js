import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Parse markdown file with frontmatter
 */
export function parseMarkdown(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    return { data, content };
  } catch (error) {
    console.error(`Error parsing markdown: ${filePath}`, error);
    return null;
  }
}

/**
 * Get all markdown files from a directory
 */
export function getMarkdownFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    const files = fs.readdirSync(dirPath);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(dirPath, file));
  } catch (error) {
    console.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
}

