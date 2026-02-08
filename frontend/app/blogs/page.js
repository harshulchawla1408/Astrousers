import Link from 'next/link';
import { getAllCategories } from '@/data/blogCategories';
import { getBlogsByCategory } from '@/lib/getBlogs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Astrology Blogs - Complete Guide to Vedic Astrology',
  description: 'Explore comprehensive astrology blogs covering kundli, dosha, rashifal, grah, remedies, and more. Learn Vedic astrology from experts.',
};

export default function BlogsPage() {
  const categories = getAllCategories();
  const categoryCounts = {};

  // Get blog count for each category
  categories.forEach(cat => {
    const blogs = getBlogsByCategory(cat.slug);
    categoryCounts[cat.slug] = blogs.length;
  });

  return (
    <div className="min-h-screen bg-[#FFF8EE]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#0A1A2F] mb-6">
            Astrology <span className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] bg-clip-text text-transparent">Blogs</span>
          </h1>
          <p className="text-xl text-[#666] max-w-3xl mx-auto">
            Complete guide to Vedic astrology, kundli analysis, dosha remedies, and spiritual wisdom
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const blogCount = categoryCounts[category.slug] || 0;
            
            return (
              <Link
                key={category.slug}
                href={`/blogs/${category.slug}`}
                className="group relative block"
              >
                <div className="bg-white rounded-2xl p-8 border border-[#F2D7A0] hover:border-[#FFA726] transition-all duration-300 hover:shadow-xl h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-[#0A1A2F] mb-2 group-hover:text-[#FFA726] transition-colors">
                        {category.title}
                      </h2>
                      <p className="text-[#666] text-sm leading-relaxed mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[#FFA726] font-medium">
                        <span>{blogCount} Articles</span>
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 bg-white rounded-2xl px-12 py-8 border border-[#F2D7A0]">
            <div>
              <div className="text-4xl font-bold text-[#FFA726]">
                {categories.reduce((sum, cat) => sum + (categoryCounts[cat.slug] || 0), 0)}
              </div>
              <div className="text-sm text-[#666] mt-1">Total Articles</div>
            </div>
            <div className="w-px h-12 bg-[#F2D7A0]"></div>
            <div>
              <div className="text-4xl font-bold text-[#FFA726]">
                {categories.length}
              </div>
              <div className="text-sm text-[#666] mt-1">Categories</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

