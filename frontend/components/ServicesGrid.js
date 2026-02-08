"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ServicesGrid = () => {
  const services = [
    {
      icon: "⭐",
      title: "Daily Horoscope",
      description: "Your AstroTip everyday",
      price: "Free",
      badge: "Updated Daily",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: "🔮",
      title: "Kundli Generator",
      description: "Free summary + Paid full report",
      price: "₹249",
      badge: "Premium Report",
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: "💬",
      title: "Astrologer Profiles",
      description: "Verified experts with chat/call/video",
      price: "Live Sessions",
      badge: "24/7",
      color: "from-pink-400 to-red-500",
    },
    {
      icon: "💰",
      title: "Coin Wallet",
      description: "Recharge coins easily, first chat free",
      price: "3 min free",
      badge: "Easy Recharge",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: "💕",
      title: "Love & Marriage",
      description: "Compatibility analysis and relationship guidance",
      price: "₹199",
      badge: "Popular",
      color: "from-rose-400 to-pink-500",
    },
    {
      icon: "💼",
      title: "Career Guidance",
      description: "Professional growth and job opportunities",
      price: "₹299",
      badge: "Expert Advice",
      color: "from-indigo-400 to-blue-500",
    },
    {
      icon: "🏠",
      title: "Vastu Consultation",
      description: "Home and office energy optimization",
      price: "₹399",
      badge: "Home Visit",
      color: "from-amber-400 to-yellow-500",
    },
    {
      icon: "🔢",
      title: "Numerology",
      description: "Life path numbers and destiny analysis",
      price: "₹149",
      badge: "Quick Report",
      color: "from-purple-400 to-violet-500",
    },
  ];

  return (
    <section className="py-20 bg-[#FFF7E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="bg-[#FFB300] text-[#0A1A2F] px-4 py-1 rounded-full text-sm font-semibold">
              Service
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">
            We Provide Best Astro Services For You
          </h2>
          <p className="text-xl text-[#0A1A2F]/70 max-w-2xl mx-auto">
            Everything you need to navigate life with the wisdom of the stars
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#F1F1F1] shadow-md bg-white rounded-[20px]"
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFA726] to-[#FFB300] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <CardTitle className="text-lg font-semibold text-[#0A1A2F] group-hover:text-[#FFA726] transition-colors duration-200">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-[#0A1A2F]/70">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-[#0A1A2F]">
                    {service.price}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-[#FFF7E6] text-[#FFA726] border border-[#FFD56B] hover:bg-[#FFD56B]"
                  >
                    {service.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Astrousers Section */}
        <div className="mt-24">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-[#0A1A2F] mb-6">
            Why Astrousers?
          </h3>

          <p className="text-lg text-center text-[#0A1A2F]/70 mb-12 max-w-3xl mx-auto">
            Astrousers blends time-tested astrological wisdom with modern
            clarity — helping you make confident decisions in love, career,
            health, and life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Accuracy */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#F1F1F1] text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#FFF7E6] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/social/accuracy.png"
                  alt="Astrology Accuracy"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                High Accuracy
              </h4>
              <p className="text-[#0A1A2F]/70 text-sm leading-relaxed">
                Precise birth chart calculations using verified astronomical
                data and proven astrological methods.
              </p>
            </div>

            {/* Experts */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#F1F1F1] text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#FFF7E6] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/social/experts.png"
                  alt="Experienced Astrologers"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                Trusted Experts
              </h4>
              <p className="text-[#0A1A2F]/70 text-sm leading-relaxed">
                Consult with carefully vetted astrologers having years of
                real-world experience and deep domain expertise.
              </p>
            </div>

            {/* Actionable */}
            <div className="group bg-white rounded-[24px] p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#F1F1F1] text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-[#FFF7E6] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/social/actionable.png"
                  alt="Actionable Guidance"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <h4 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                Actionable Guidance
              </h4>
              <p className="text-[#0A1A2F]/70 text-sm leading-relaxed">
                Clear remedies, practical steps, and follow-up guidance that you
                can apply in daily life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
