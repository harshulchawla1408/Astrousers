"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { zodiacs } from "@/data/zodiacs";

const services = [
  {
    title: "Love and Marriage concerns",
    img: "/services/love.jpg",
  },
  {
    title: "Kundli and Matchmaking",
    img: "/services/kundli.jpg",
  },
  {
    title: "Business and Career growth",
    img: "/services/business.jpg",
  },
  {
    title: "Health and Wellness",
    img: "/services/health.jpg",
  },
  {
    title: "Guidance on Family and Relationships",
    img: "/services/family.jpg",
  },
  {
    title: "Financial Advice and Solutions",
    img: "/services/finance.jpg",
  },
];

const ZodiacGrid = () => {
  return (
    <section className="py-20 bg-[#FFF7E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">
            Choose your{" "}
            <span className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] bg-clip-text text-transparent">
              Zodiac Sign
            </span>
          </h2>
          <p className="text-xl text-[#0A1A2F]/70 max-w-2xl mx-auto">
            Discover your personalized horoscope and cosmic guidance based on
            your zodiac sign
          </p>
        </div>

        {/* ---------- Zodiac Grid ---------- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {zodiacs.map((sign, index) => (
            <Link key={index} href={`/zodiac/${sign.slug}`} className="block">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#F1F1F1] shadow-md bg-white cursor-pointer h-full rounded-[20px]">
                <CardContent className="p-6 text-center">
                  {/* Zodiac Icon */}
                  <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 flex items-center justify-center bg-white">
                    <Image
                      src={`/icons/${sign.name.toLowerCase()}.png`}
                      alt={sign.name}
                      width={120}
                      height={120}
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Zodiac Name */}
                  <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2 group-hover:text-[#FFA726] transition-colors duration-200">
                    {sign.name}
                  </h3>

                  {/* Date */}
                  <p className="text-sm text-[#0A1A2F]/70">{sign.dates}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

{/* ---------- Services Section (Full Image Cards, No White Borders) ---------- */}
<div className="mt-20 px-2 sm:px-4">
  <h3 className="text-3xl md:text-4xl font-bold text-center text-[#0A1A2F] mb-8">
    Our Expert Services
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
    {services.map((service, idx) => (
      <Link
        key={idx}
        href={`/services/${service.title.toLowerCase().replace(/ /g, "-")}`}
        className="block"
      >
        <div className="relative w-full h-80 rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
          <Image
            src={service.img}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
      </Link>
    ))}
  </div>

  <p className="text-md text-center text-[#0A1A2F]/70 mt-6 max-w-2xl mx-auto">
    Trusted guidance from experienced astrologers — accurate insights with complete privacy.
  </p>
</div>

      </div>
    </section>
  );
};

export default ZodiacGrid;
