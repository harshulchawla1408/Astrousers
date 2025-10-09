'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesGrid from '@/components/ServicesGrid';
import AstrologersCarousel from '@/components/AstrologersCarousel';
import ZodiacGrid from '@/components/ZodiacGrid';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import FAQAccordion from '@/components/FAQAccordion';
import Footer from '@/components/Footer';

// Load cursor component only on client side
const Cursor = dynamic(() => import('@/components/Cursor'), { 
  ssr: false 
});

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Cursor />
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

