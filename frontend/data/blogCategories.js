export const blogCategories = [
  {
    slug: "kundli",
    title: "Kundli & Birth Chart",
    description: "Janam kundli, lagna, houses, grah sthitiyan aur kundli analysis ke baare mein jankari",
    icon: "🔮"
  },
  {
    slug: "dosha",
    title: "Dosha & Yog",
    description: "Mangal dosha, kaal sarp dosha, pitra dosha aur various yogon ka detailed analysis",
    icon: "⚡"
  },
  {
    slug: "rashifal",
    title: "Rashifal (Horoscope)",
    description: "Daily, weekly, monthly rashifal aur moon sign, rising sign ke baare mein",
    icon: "⭐"
  },
  {
    slug: "grah",
    title: "Grah (Planet-wise)",
    description: "Surya, Chandra, Mangal, Budh, Guru, Shukra, Shani, Rahu, Ketu ka jeevan par prabhav",
    icon: "🪐"
  },
  {
    slug: "gochar",
    title: "Gochar & Transit",
    description: "Grah gochar, shani gochar, rahu-ketu gochar aur vakri grahon ka effect",
    icon: "🌌"
  },
  {
    slug: "marriage",
    title: "Marriage & Relationship",
    description: "Shaadi ke yog, kundli matching, gun milan, love marriage, arranged marriage analysis",
    icon: "💑"
  },
  {
    slug: "career",
    title: "Career Astrology",
    description: "Career house, job vs business, government job yog, career growth aur promotion ke yog",
    icon: "💼"
  },
  {
    slug: "money",
    title: "Money & Wealth",
    description: "Dhan yog, paisa kundli mein, business profit, investment timing, financial remedies",
    icon: "💰"
  },
  {
    slug: "love",
    title: "Love & Romance",
    description: "Love life analysis, relationship problems, breakup yog, compatibility checking",
    icon: "💕"
  },
  {
    slug: "health",
    title: "Health Astrology",
    description: "Health house, chronic illness, mental health, accidents, surgery yog, health remedies",
    icon: "🏥"
  },
  {
    slug: "gemstone",
    title: "Gemstone Astrology",
    description: "Ratna astrology, neelam, pukhraj, moonga, panna aur gemstone remedies",
    icon: "💎"
  },
  {
    slug: "remedies",
    title: "Remedies & Upay",
    description: "Grah shanti, mantra jaap, daan, rudraksha, yantra aur simple upay",
    icon: "🕉️"
  },
  {
    slug: "muhurat",
    title: "Muhurat & Festivals",
    description: "Vivah muhurat, griha pravesh, naamkaran, business muhurat, festival astrology",
    icon: "📅"
  },
  {
    slug: "beginner",
    title: "Beginner Astrology",
    description: "Astrology basics, Vedic vs Western, nakshatra, dasha system, learning roadmap",
    icon: "📚"
  },
  {
    slug: "awareness",
    title: "Astrology Awareness & Myths",
    description: "Astrology facts vs myths, fake astrologers, ethical astrology, responsible practice",
    icon: "🔍"
  }
];

export function getCategoryBySlug(slug) {
  return blogCategories.find(cat => cat.slug === slug);
}

export function getAllCategories() {
  return blogCategories;
}

