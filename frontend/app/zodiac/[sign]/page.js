"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodiacs } from "@/data/zodiacs";
import {
  CheckCircle2,
  XCircle,
  Heart,
  Calendar,
  Flame,
  Orbit,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";

// Helper function to get Hindi name for zodiac sign
const getHindiName = (slug) => {
  const hindiNames = {
    aries: "मेष",
    taurus: "वृषभ",
    gemini: "मिथुन",
    cancer: "कर्क",
    leo: "सिंह",
    virgo: "कन्या",
    libra: "तुला",
    scorpio: "वृश्चिक",
    sagittarius: "धनु",
    capricorn: "मकर",
    aquarius: "कुम्भ",
    pisces: "मीन",
  };
  return hindiNames[slug] || "";
};

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

// Helper function to get tips for each zodiac sign
const getZodiacTips = (slug) => {
  const tipsMap = {
    aries: [
      "Channel your leadership energy into team projects and initiatives",
      "Practice patience and mindfulness to balance your impulsive nature",
      "Set clear goals and break them into manageable steps",
      "Take time to listen before making quick decisions",
      "Use your courage to help others overcome their fears"
    ],
    taurus: [
      "Embrace change gradually rather than resisting it completely",
      "Create a comfortable workspace that inspires productivity",
      "Practice flexibility in relationships and daily routines",
      "Indulge in self-care but maintain healthy boundaries",
      "Trust your instincts while staying open to new perspectives"
    ],
    gemini: [
      "Focus on one task at a time to improve productivity",
      "Use your communication skills to build meaningful connections",
      "Create a routine that includes time for learning and exploration",
      "Practice decision-making by setting small deadlines",
      "Balance social activities with quiet reflection time"
    ],
    cancer: [
      "Set healthy emotional boundaries to protect your energy",
      "Express your feelings openly with trusted loved ones",
      "Create a peaceful home environment that nurtures your soul",
      "Trust your intuition but verify facts before acting",
      "Practice self-care to maintain emotional balance"
    ],
    leo: [
      "Share the spotlight and celebrate others' achievements",
      "Use your creativity to inspire and motivate others",
      "Balance confidence with humility in interactions",
      "Take time for self-reflection and personal growth",
      "Channel your passion into meaningful projects"
    ],
    virgo: [
      "Accept that perfection is not always necessary",
      "Practice self-compassion and reduce self-criticism",
      "Delegate tasks to others and trust their abilities",
      "Take breaks to prevent burnout and maintain health",
      "Celebrate small wins and progress, not just final results"
    ],
    libra: [
      "Make decisions based on your own values, not just others' opinions",
      "Balance social activities with personal time for reflection",
      "Practice assertiveness while maintaining your diplomatic nature",
      "Create harmony in your environment through organization",
      "Trust your judgment and avoid overthinking choices"
    ],
    scorpio: [
      "Open up gradually to build trust in relationships",
      "Channel your intensity into creative or professional pursuits",
      "Practice forgiveness to release emotional burdens",
      "Balance your need for privacy with meaningful connections",
      "Use your intuition to guide important life decisions"
    ],
    sagittarius: [
      "Balance adventure with stability in your life",
      "Complete projects before starting new ones",
      "Practice active listening in conversations",
      "Set realistic expectations for yourself and others",
      "Use your optimism to inspire and motivate others"
    ],
    capricorn: [
      "Schedule time for relaxation and fun activities",
      "Celebrate achievements and acknowledge your progress",
      "Express emotions openly with close friends and family",
      "Balance work responsibilities with personal relationships",
      "Allow yourself to make mistakes and learn from them"
    ],
    aquarius: [
      "Connect with others on an emotional level, not just intellectual",
      "Balance your independence with collaboration",
      "Take breaks from technology to reconnect with nature",
      "Express your unique ideas while respecting others' perspectives",
      "Practice patience when others don't understand your vision"
    ],
    pisces: [
      "Set clear boundaries to protect your emotional energy",
      "Ground yourself in reality while maintaining your dreams",
      "Express your creativity through art, music, or writing",
      "Practice self-care to avoid emotional overwhelm",
      "Trust your intuition but verify important information"
    ],
  };
  return tipsMap[slug] || [];
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
  const [imageError, setImageError] = useState(false);

  const zodiac = zodiacs.find((z) => z.slug === sign);

  // Reset image error when zodiac changes
  useEffect(() => {
    setImageError(false);
  }, [sign]);

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
  const tips = getZodiacTips(sign);

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="pt-20">
        {/* Header Section */}
        <section className="bg-white border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-6 group text-[#0A1A2F] hover:text-[#FFA726] hover:bg-[#FFF7E6]"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Zodiac Signs
              </Button>
            </Link>

            {/* Zodiac Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Icon */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center flex-shrink-0">
                <Image
                  src={`/icons/${zodiac.name.toLowerCase()}.png`}
                  alt={zodiac.name}
                  width={96}
                  height={96}
                  className="object-contain p-2"
                />
              </div>

              {/* Title and Metadata */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A1A2F] mb-2">
                  {zodiac.name} {getHindiName(sign) && (
                    <span className="text-3xl md:text-4xl lg:text-5xl text-[#FFA726] font-normal">
                      ({getHindiName(sign)})
                    </span>
                  )}
                </h1>
                <p className="text-xl text-[#0A1A2F]/70 mb-6 font-medium">
                  {zodiac.dates}
                </p>

                {/* Metadata Chips */}
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF7E6] rounded-full border border-[#E5E5E5]">
                    <Calendar className="w-4 h-4 text-[#FFA726]" />
                    <span className="text-sm font-semibold text-[#0A1A2F]">
                      {zodiac.dates}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF7E6] rounded-full border border-[#E5E5E5]">
                    <Flame className="w-4 h-4 text-[#FFA726]" />
                    <span className="text-sm font-semibold text-[#0A1A2F]">
                      {element}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#FFF7E6] rounded-full border border-[#E5E5E5]">
                    <Orbit className="w-4 h-4 text-[#FFA726]" />
                    <span className="text-sm font-semibold text-[#0A1A2F]">
                      {planet}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8">
              {/* Left Column - Content */}
              <div className="space-y-6">
                {/* Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">
                    Overview
                  </h2>
                  <p className="text-[#0A1A2F]/80 leading-relaxed text-base text-justify">
                    {zodiac.overview}
                  </p>
                </div>

                {/* Personality */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-[#0A1A2F] mb-4">
                    Personality
                  </h2>
                  <p className="text-[#0A1A2F]/80 leading-relaxed text-base text-justify">
                    {zodiac.personality}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-green-500">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-[#0A1A2F]/80 text-sm leading-relaxed">
                            {strength}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-orange-500">
                    <h3 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-orange-600" />
                      Weaknesses
                    </h3>
                    <ul className="space-y-3">
                      {weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <XCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                          <span className="text-[#0A1A2F]/80 text-sm leading-relaxed">
                            {weakness}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#FFA726]">
                  <h3 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-[#FFA726]" />
                    Tips for {zodiac.name}
                  </h3>
                  <ul className="space-y-3">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#FFA726] mt-2 flex-shrink-0"></div>
                        <span className="text-[#0A1A2F]/80 text-sm leading-relaxed">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column - Image & Compact Info */}
              <div className="space-y-6">
                {/* Zodiac Image - Hero Style */}
                <div className="relative w-full h-[500px] md:h-[550px] rounded-2xl overflow-hidden shadow-lg">
                  {zodiac.image &&
                  zodiac.image !== "/placeholder.png" &&
                  typeof zodiac.image === "string" &&
                  zodiac.image.trim() !== "" &&
                  !imageError ? (
                    <Image
                      src={
                        zodiac.image.startsWith("/")
                          ? zodiac.image
                          : `/${zodiac.image}`
                      }
                      alt={zodiac.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                      <div
                        className={`w-32 h-32 bg-gradient-to-br ${zodiac.color} rounded-full flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <span className="text-6xl text-white">
                          {zodiac.symbol}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-500">
                        Zodiac Illustration
                      </span>
                    </div>
                  )}
                </div>

                {/* Compatibility */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-[#0A1A2F] mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    Compatibility
                  </h3>
                  {compatibleSigns.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {compatibleSigns.map((signName, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0 px-3 py-1 text-sm font-medium hover:scale-105 transition-transform duration-200"
                        >
                          {signName}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-[#0A1A2F]/70 leading-relaxed text-sm whitespace-pre-line text-justify">
                    {zodiac.compatibility.replace(/\*\*/g, "")}
                  </p>
                </div>

                {/* Lucky Numbers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">
                    Lucky Numbers
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {luckyNumbers.map((number, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-lg flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lucky Colors */}
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-[#0A1A2F] mb-4">
                    Lucky Colors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {luckyColors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FFF7E6] hover:bg-[#FFE0A3] transition-colors duration-200"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${getColorClass(
                            color
                          )} shadow-sm flex-shrink-0`}
                        ></div>
                        <span className="text-[#0A1A2F] font-medium text-sm whitespace-nowrap">
                          {color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
