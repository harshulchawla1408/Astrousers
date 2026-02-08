import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/data/blogCategories';
import { getBlogsByCategory } from '@/lib/getBlogs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  const { getCategorySlugs } = await import('@/lib/getBlogs');
  const slugs = getCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.category);
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.title} - Astrology Blogs`,
    description: category.description,
  };
}

export default function CategoryBlogsPage({ params }) {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }

  const blogs = getBlogsByCategory(params.category);

  return (
    <div className="min-h-screen bg-[#FFF8EE]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Category Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{category.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F]">
              {category.title}
            </h1>
          </div>
          <p className="text-lg text-[#666] max-w-3xl">
            {category.description}
          </p>
        </div>

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#666]">No blogs found in this category yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {blogs.map((blog) => (
              <article key={blog.slug} className="group">
                <Link href={`/blogs/${params.category}/${blog.slug}`}>
                  {/* Hero Image - Full Width */}
                  {blog.heroImage && (
                    <div className="relative w-full h-96 md:h-[500px] mb-8 rounded-2xl overflow-hidden">
                      <Image
                        src={blog.heroImage}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={blogs.indexOf(blog) === 0}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-4 group-hover:text-[#FFA726] transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-lg text-[#666] mb-4 leading-relaxed">
                      {blog.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#999]">
                      <time dateTime={blog.date}>
                        {new Date(blog.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span>•</span>
                      <span className="text-[#FFA726] font-medium">Read More →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-16">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[#FFA726] hover:text-[#FF8F00] font-medium transition-colors"
          >
            ← Back to All Categories
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

