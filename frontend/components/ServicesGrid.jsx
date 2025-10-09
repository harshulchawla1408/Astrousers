'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ServicesGrid = () => {
  const services = [
    {
      icon: "⭐",
      title: "Daily Horoscope",
      description: "Your AstroTip everyday",
      price: "Free",
      badge: "Updated Daily",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: "🔮",
      title: "Kundli Generator",
      description: "Free summary + Paid full report",
      price: "₹249",
      badge: "Premium Report",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: "💬",
      title: "Astrologer Profiles",
      description: "Verified experts with chat/call/video",
      price: "Live Sessions",
      badge: "24/7",
      color: "from-pink-400 to-red-500"
    },
    {
      icon: "💰",
      title: "Coin Wallet",
      description: "Recharge coins easily, first chat free",
      price: "3 min free",
      badge: "Easy Recharge",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: "💕",
      title: "Love & Marriage",
      description: "Compatibility analysis and relationship guidance",
      price: "₹199",
      badge: "Popular",
      color: "from-rose-400 to-pink-500"
    },
    {
      icon: "💼",
      title: "Career Guidance",
      description: "Professional growth and job opportunities",
      price: "₹299",
      badge: "Expert Advice",
      color: "from-indigo-400 to-blue-500"
    },
    {
      icon: "🏠",
      title: "Vastu Consultation",
      description: "Home and office energy optimization",
      price: "₹399",
      badge: "Home Visit",
      color: "from-amber-400 to-yellow-500"
    },
    {
      icon: "🔢",
      title: "Numerology",
      description: "Life path numbers and destiny analysis",
      price: "₹149",
      badge: "Quick Report",
      color: "from-purple-400 to-violet-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Astrology <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to navigate life with the wisdom of the stars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
              data-cursor="pointer"
            >
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">
                    {service.price}
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                    {service.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Astrousers Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Why Astrousers?</h3>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Astrousers blends trusted astrological techniques with modern clarity — delivering personalized, practical guidance for relationships, career, health, and life decisions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Accuracy</h4>
              <p className="text-gray-600">Precise birth charts using verified astronomical data.</p>
            </div>
            
            <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">👨‍🏫</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Experts</h4>
              <p className="text-gray-600">Vetted astrologers with decades of experience.</p>
            </div>
            
            <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Actionable</h4>
              <p className="text-gray-600">Practical remedies and follow-up guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
