"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { zodiacs } from "@/data/zodiacs";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Heart,
  Calendar,
  Flame,
  Orbit,
  ArrowLeft,
} from "lucide-react";

// Helper function to get element and ruling planet
const getZodiacInfo = (slug) => {
  const infoMap = {
    aries: { element: "Fire", planet: "Mars" },
    taurus: { element: "Earth", planet: "Venus" },
    gemini: { element: "Air", planet: "Mercury" },
    cancer: { element: "Water", planet: "Moon" },
    leo: { element: "Fire", planet: "Sun" },
    virgo: { element: "Earth", planet: "Mercury" },
    libra: { element: "Air", planet: "Venus" },
    scorpio: { element: "Water", planet: "Pluto" },
    sagittarius: { element: "Fire", planet: "Jupiter" },
    capricorn: { element: "Earth", planet: "Saturn" },
    aquarius: { element: "Air", planet: "Uranus" },
    pisces: { element: "Water", planet: "Neptune" },
  };
  return infoMap[slug] || { element: "Unknown", planet: "Unknown" };
};

// Helper function to extract compatible signs from text
const extractCompatibleSigns = (text) => {
  const matches = text.match(/\*\*([^*]+)\*\*/g);
  if (!matches) return [];
  return matches
    .map((match) => match.replace(/\*\*/g, ""))
    .join(", ")
    .split(/[,\s]+and\s+|,\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

// Helper function to get color class from color name
const getColorClass = (colorName) => {
  const colorMap = {
    Red: "bg-red-500",
    Scarlet: "bg-red-600",
    "Bright Yellow": "bg-yellow-400",
    Green: "bg-green-500",
    Pink: "bg-pink-500",
    "Earthy Brown": "bg-amber-700",
    Yellow: "bg-yellow-400",
    "Light Green": "bg-green-300",
    "Sky Blue": "bg-sky-400",
    White: "bg-white border-2 border-gray-300",
    Silver: "bg-gray-300",
    "Sea Blue": "bg-blue-400",
    Gold: "bg-yellow-500",
    Orange: "bg-orange-500",
    "Sunset Yellow": "bg-yellow-500",
    Beige: "bg-amber-100",
    "Olive Green": "bg-green-600",
    "Soft Grey": "bg-gray-400",
    Lavender: "bg-purple-300",
    Maroon: "bg-red-800",
    Black: "bg-black",
    "Dark Red": "bg-red-900",
    Purple: "bg-purple-500",
    "Royal Blue": "bg-blue-600",
    "Deep Red": "bg-red-700",
    Grey: "bg-gray-500",
    "Dark Green": "bg-green-800",
    "Electric Blue": "bg-blue-500",
    Turquoise: "bg-cyan-400",
    "Sea Green": "bg-green-400",
    Lilac: "bg-purple-300",
    Aquamarine: "bg-cyan-300",
  };
  return colorMap[colorName] || "bg-gray-400";
};

export default function ZodiacDetailPage() {
  const params = useParams();
  const sign = params.sign?.toLowerCase();

  const zodiac = zodiacs.find((z) => z.slug === sign);

  if (!zodiac) {
    return (
      <div className="min-h-screen bg-[#FFF7E6] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#0A1A2F] mb-4">
            Zodiac Sign Not Found
          </h1>
          <Link href="/" className="text-[#FFA726] hover:text-[#FF8F00]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { element, planet } = getZodiacInfo(sign);
  const compatibleSigns = extractCompatibleSigns(zodiac.compatibility);
  const strengths = Array.isArray(zodiac.strengths) ? zodiac.strengths : [];
  const weaknesses = Array.isArray(zodiac.weaknesses) ? zodiac.weaknesses : [];
  const luckyNumbers = Array.isArray(zodiac.luckyNumbers)
    ? zodiac.luckyNumbers
    : [];
  const luckyColors = Array.isArray(zodiac.luckyColors)
    ? zodiac.luckyColors
    : [];

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-white relative overflow-hidden border-b border-[#E5E5E5]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back Button */}
            <Link href="/">
              <Button
                variant="outline"
                className="mb-6 group hover:bg-[#FFF7E6] border-[#E5E5E5] text-[#0A1A2F] rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Zodiac Signs
              </Button>
            </Link>

            {/* Zodiac Header */}
            {/* Zodiac Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
              {/* Icon */}
              <Card
                className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-0 p-0 flex items-center justify-center bg-white`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Image
                    src={`/icons/${zodiac.name.toLowerCase()}.png`}
                    alt={zodiac.name}
                    width={180}
                    height={180}
                    className="object-contain p-4"
                  />
                </div>
              </Card>

              {/* Title and Date */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {zodiac.name}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-4 font-medium">
                  {zodiac.dates}
                </p>

                {/* Info Panel */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <Card className="px-4 py-2 bg-white/60 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {zodiac.dates}
                      </span>
                    </div>
                  </Card>
                  <Card className="px-4 py-2 bg-white/60 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {element}
                      </span>
                    </div>
                  </Card>
                  <Card className="px-4 py-2 bg-white/60 backdrop-blur-sm border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2">
                      <Orbit className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        {planet}
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Overview Card */}
                <Card className="border border-[#E5E5E5] shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.01] rounded-[20px] border-l-4 border-l-[#FFA726]">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br from-[#FFA726] to-[#FFB300] bg-opacity-20`}
                    >
                      <Sparkles className={`w-5 h-5 text-[#FFA726]`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-[#0A1A2F]">
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0A1A2F]/70 leading-relaxed text-base">
                      {zodiac.overview}
                    </p>
                  </CardContent>
                </Card>

                {/* Personality Card */}
                <Card className="border border-[#E5E5E5] shadow-md bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.01] rounded-[20px]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#0A1A2F]">
                      Personality
                    </CardTitle>
                    <Separator className="my-3" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0A1A2F]/70 leading-relaxed text-base">
                      {zodiac.personality}
                    </p>
                  </CardContent>
                </Card>

                {/* Strengths / Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-green-500">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {strength}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Weaknesses Card */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-600" />
                        Weaknesses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {weakness}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                      {zodiac.image && zodiac.image !== "/placeholder.png" ? (
                        <Image
                          src={zodiac.image}
                          alt={zodiac.name}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <div
                            className={`w-32 h-32 bg-gradient-to-br ${zodiac.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
                          >
                            <span className="text-6xl text-white">
                              {zodiac.symbol}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            Zodiac Illustration
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Compatibility Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      Compatibility
                    </CardTitle>
                    <Separator className="my-3" />
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      {compatibleSigns.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {compatibleSigns.map((signName, index) => (
                            <Badge
                              key={index}
                              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 shadow-md hover:scale-105 transition-transform duration-200"
                            >
                              {signName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                      {zodiac.compatibility.replace(/\*\*/g, "")}
                    </p>
                  </CardContent>
                </Card>

                {/* Lucky Numbers Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Lucky Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {luckyNumbers.map((number, index) => (
                        <div
                          key={index}
                          className={`px-6 py-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-default`}
                        >
                          {number}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lucky Colors Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Lucky Colors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {luckyColors.map((color, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${getColorClass(
                              color
                            )} shadow-md flex-shrink-0`}
                          ></div>
                          <span className="text-gray-700 font-medium text-sm">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
