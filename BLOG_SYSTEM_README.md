# Astrology Blog System

Complete, scalable blog system for astrology website using Next.js App Router.

## 📁 File Structure

```
frontend/
├── app/
│   └── blogs/
│       ├── page.js                    # All categories page
│       └── [category]/
│           ├── page.js                # Category blogs listing
│           └── [slug]/
│               └── page.js           # Single blog post
├── content/
│   └── blogs/
│       ├── kundli/
│       │   ├── janam-kundli.md
│       │   ├── lagna-importance.md
│       │   └── images/
│       ├── dosha/
│       │   ├── mangal-dosha.md
│       │   └── images/
│       └── [other-categories]/
├── data/
│   └── blogCategories.js               # Category definitions
└── lib/
    ├── getBlogs.js                     # Blog fetching utilities
    ├── getSingleBlog.js                # Single blog + related blogs
    └── markdown.js                     # Markdown parsing
```

## 🚀 Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install gray-matter react-markdown
   ```

2. **Create Content Structure**
   - Create category folders in `frontend/content/blogs/`
   - Add markdown files with proper frontmatter
   - Add images in `images/` subfolder

## 📝 Markdown Format

Each blog must follow this exact format:

```markdown
---
title: "Blog Title"
description: "Short description"
date: "2026-01-15"
category: "kundli"
heroImage: "/blogs/kundli/images/hero.jpg"
images:
  - "/blogs/kundli/images/image-1.jpg"
  - "/blogs/kundli/images/image-2.jpg"
tags: ["tag1", "tag2"]
---

Your markdown content here...
```

## 🎨 Features

- ✅ 15 Categories (all defined in `data/blogCategories.js`)
- ✅ SEO-friendly URLs (`/blogs/[category]/[slug]`)
- ✅ Hero image on blog post (above heading) + category listing
- ✅ 2 inline content images (automatically inserted at 33% and 66%)
- ✅ Related blogs (3 from same category)
- ✅ Professional, content-focused UI
- ✅ Full-width images (not boxed)
- ✅ Mobile responsive
- ✅ Static generation for performance

## 📍 Routes

- `/blogs` - All categories page
- `/blogs/[category]` - Category-specific blogs
- `/blogs/[category]/[slug]` - Single blog post

## 🖼️ Image Requirements

- **Hero Image**: Displayed at top of blog post (above heading) and in category listing page
- **Content Images**: 2 images automatically inserted at 33% and 66% through content
- **Image Path**: Use `/blogs/[category]/images/[filename]` (images go in `frontend/public/blogs/[category]/images/`)
- **Format**: JPG, PNG, WebP supported

## 📦 Categories

All 15 categories are pre-configured:
1. Kundli & Birth Chart
2. Dosha & Yog
3. Rashifal
4. Grah (Planet-wise)
5. Gochar & Transit
6. Marriage & Relationship
7. Career
8. Money & Wealth
9. Love & Romance
10. Health
11. Gemstone
12. Remedies & Upay
13. Muhurat & Festivals
14. Beginner Astrology
15. Astrology Awareness & Myths

## 🔧 Adding New Blogs

1. Create markdown file in appropriate category folder
2. Add frontmatter with all required fields
3. Add images to `images/` subfolder
4. Reference images in frontmatter
5. Build will automatically include new blog

## 🎯 Next Steps

1. Add actual blog content (150+ articles)
2. Add real images for each blog
3. Customize styling if needed
4. Add analytics tracking
5. Set up RSS feed (optional)

