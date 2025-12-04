'use client';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import AstrologersCarousel from '@/components/AstrologersCarousel';
import ZodiacGrid from '@/components/ZodiacGrid';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import FAQAccordion from '@/components/FAQAccordion';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main>
        <Hero />
        <ServicesGrid />
        <AstrologersCarousel />
        <ZodiacGrid />
        <ReviewsCarousel />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  );
}

