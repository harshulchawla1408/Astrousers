'use client';

import { Card, CardContent } from "@/components/ui/card";

const ZodiacGrid = () => {
  const zodiacSigns = [
    {
      name: "Aries",
      dateRange: "Mar 21 - Apr 19",
      symbol: "♈",
      color: "from-red-400 to-pink-500"
    },
    {
      name: "Taurus",
      dateRange: "Apr 20 - May 20",
      symbol: "♉",
      color: "from-green-400 to-emerald-500"
    },
    {
      name: "Gemini",
      dateRange: "May 21 - Jun 20",
      symbol: "♊",
      color: "from-yellow-400 to-orange-500"
    },
    {
      name: "Cancer",
      dateRange: "Jun 21 - Jul 22",
      symbol: "♋",
      color: "from-blue-400 to-cyan-500"
    },
    {
      name: "Leo",
      dateRange: "Jul 23 - Aug 22",
      symbol: "♌",
      color: "from-orange-400 to-yellow-500"
    },
    {
      name: "Virgo",
      dateRange: "Aug 23 - Sep 22",
      symbol: "♍",
      color: "from-purple-400 to-violet-500"
    },
    {
      name: "Libra",
      dateRange: "Sep 23 - Oct 22",
      symbol: "♎",
      color: "from-pink-400 to-rose-500"
    },
    {
      name: "Scorpio",
      dateRange: "Oct 23 - Nov 21",
      symbol: "♏",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Sagittarius",
      dateRange: "Nov 22 - Dec 21",
      symbol: "♐",
      color: "from-blue-500 to-purple-500"
    },
    {
      name: "Capricorn",
      dateRange: "Dec 22 - Jan 19",
      symbol: "♑",
      color: "from-gray-500 to-slate-500"
    },
    {
      name: "Aquarius",
      dateRange: "Jan 20 - Feb 18",
      symbol: "♒",
      color: "from-cyan-400 to-blue-500"
    },
    {
      name: "Pisces",
      dateRange: "Feb 19 - Mar 20",
      symbol: "♓",
      color: "from-indigo-400 to-purple-500"
    }
  ];

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
          {zodiacSigns.map((sign, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white cursor-pointer"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${sign.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-2xl text-white">{sign.symbol}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                  {sign.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {sign.dateRange}
                </p>
              </CardContent>
            </Card>
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
