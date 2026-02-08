import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getCategoryBySlug } from '@/data/blogCategories';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/getSingleBlog';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  const { getBlogSlugs, getCategorySlugs } = await import('@/lib/getBlogs');
  const categories = getCategorySlugs();
  const params = [];

  categories.forEach(category => {
    const slugs = getBlogSlugs(category);
    slugs.forEach(({ slug }) => {
      params.push({ category, slug });
    });
  });

  return params;
}

export async function generateMetadata({ params }) {
  const blog = getBlogBySlug(params.category, params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
    };
  }

  return {
    title: `${blog.title} - Astrology Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: blog.heroImage ? [blog.heroImage] : [],
    },
  };
}

export default function BlogPostPage({ params }) {
  const blog = getBlogBySlug(params.category, params.slug);
  const category = getCategoryBySlug(params.category);

  if (!blog || !category) {
    notFound();
  }

  const relatedBlogs = getRelatedBlogs(params.category, params.slug, 3);

  // Process content to insert images at strategic points (2 images only)
  const processContent = (content, images) => {
    if (!images || images.length === 0) return content;
    
    const paragraphs = content.split(/\n\n+/);
    const processed = [];
    let imageIndex = 0;
    
    // Calculate positions for 2 images (33%, 66% through content)
    const totalParagraphs = paragraphs.length;
    const imagePositions = [
      Math.max(1, Math.floor(totalParagraphs * 0.33)),
      Math.max(2, Math.floor(totalParagraphs * 0.66))
    ];

    paragraphs.forEach((para, idx) => {
      processed.push(para);
      
      // Insert image after certain paragraphs (only 2 images)
      if (imageIndex < images.length && imageIndex < 2 && imagePositions.includes(idx + 1)) {
        processed.push(`\n\n![${blog.title} - Image ${imageIndex + 1}](${images[imageIndex]})\n\n`);
        imageIndex++;
      }
    });

    return processed.join('\n\n');
  };

  const processedContent = processContent(blog.content, blog.images);

  return (
    <div className="min-h-screen bg-[#FFF8EE]">
      <Header />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Image - Full Width ABOVE Heading */}
        {blog.heroImage && (
          <div className="relative w-full h-96 md:h-[600px] mb-12 rounded-2xl overflow-hidden">
            <Image
              src={blog.heroImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          <Link
            href={`/blogs/${params.category}`}
            className="inline-flex items-center gap-2 text-[#FFA726] hover:text-[#FF8F00] font-medium mb-6 transition-colors"
          >
            ← Back to {category.title}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-[#666] mb-6">
            <time dateTime={blog.date}>
              {new Date(blog.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{category.title}</span>
          </div>

          {blog.description && (
            <p className="text-xl text-[#666] leading-relaxed">
            {blog.description}
          </p>
          )}

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#FFF7E6] text-[#FFA726] rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => {
                // If the only child is an image, return it directly (no <p>)
                if (
                  Array.isArray(children) &&
                  children.length === 1 &&
                  children[0]?.type === 'img'
                ) {
                  return children;
                }
                return (
                  <p className="mb-6 text-[#333] leading-relaxed text-lg">
                    {children}
                  </p>
                );
              },
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold text-[#0A1A2F] mt-12 mb-6">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold text-[#0A1A2F] mt-8 mb-4">
                  {children}
                </h3>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-6 space-y-2 text-[#333]">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-6 space-y-2 text-[#333]">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-lg leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-[#0A1A2F]">
                  {children}
                </strong>
              ),
              img: ({ src, alt }) => (
                <div className="relative w-full h-96 md:h-[500px] my-12 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl overflow-hidden">
                  <Image
                    src={src || ''}
                    alt={alt || blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ),
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#F2D7A0]">
            <h2 className="text-3xl font-bold text-[#0A1A2F] mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedBlogs.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blogs/${params.category}/${related.slug}`}
                  className="group"
                >
                  {related.heroImage && (
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                      <Image
                        src={related.heroImage}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#0A1A2F] mb-2 group-hover:text-[#FFA726] transition-colors">
                    {related.title}
                  </h3>
                  <p className="text-sm text-[#666] line-clamp-2">
                    {related.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
}

