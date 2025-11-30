'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { zodiacs } from "@/data/zodiacs";

const ZodiacGrid = () => {

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Zodiac Sign</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your personalized horoscope and cosmic guidance based on your zodiac sign
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {zodiacs.map((sign, index) => (
            <Link 
              key={index}
              href={`/zodiac/${sign.slug}`}
              className="block"
            >
              <Card 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white cursor-pointer h-full"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${sign.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl text-white">{sign.symbol}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                    {sign.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {sign.dates}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Most Trusted Platform Section */}
        <div className="mt-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Most Trusted Astrology Platform
          </h3>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            We set the benchmark in the industry with our commitment to trust, privacy, 24/7 availability, and personalized assistance. Our platform is designed to provide you with the most accurate and reliable astrological guidance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">💕</div>
              <div className="font-semibold text-white">Love and Marriage concerns</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">🔮</div>
              <div className="font-semibold text-white">Kundli and matchmaking</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">💼</div>
              <div className="font-semibold text-white">Business and Career growth</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-semibold text-white">Health And Wellness</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <div className="font-semibold text-white">Guidance on Family and Relationships</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-semibold text-white">Financial Advice and Solutions</div>
            </div>
          </div>

          <p className="text-lg text-white/90 mb-8">
            Our platform is committed to providing you with expert guidance, maintaining complete privacy, and ensuring customer satisfaction in every interaction.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ZodiacGrid;
