"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Helper function to convert puja name to URL-friendly slug
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

// Puja data array with all 20 pujas
const pujaList = [
  {
    name: "Kaal Sarp Dosha Puja",
    image: "/services/kaal-sarp-dosha-puja.png",
    slug: "kaal-sarp-dosha-puja",
  },
  {
    name: "Pitra Dosha Puja",
    image: "/services/pitra-dosha-puja.png",
    slug: "pitra-dosha-puja",
  },
  {
    name: "Maha Mrityunjaya Mantra Jaap",
    image: "/services/maha-mrityunjaya-mantra-jaap.png",
    slug: "maha-mrityunjaya-mantra-jaap",
  },
  {
    name: "Guru Chandal Dosha Puja",
    image: "/services/guru-chandal-dosha-puja.png",
    slug: "guru-chandal-dosha-puja",
  },
  {
    name: "Navagraha Shanti Puja",
    image: "/services/navagraha-shanti-puja.png",
    slug: "navagraha-shanti-puja",
  },
  {
    name: "Gandmool Shanti Puja",
    image: "/services/gandmool-shanti-puja.png",
    slug: "gandmool-shanti-puja",
  },
  {
    name: "Kala Shanti Puja",
    image: "/services/kala-shanti-puja.png",
    slug: "kala-shanti-puja",
  },
  {
    name: "Grah Pravesh Poojan",
    image: "/services/grah-pravesh-poojan.png",
    slug: "grah-pravesh-poojan",
  },
  {
    name: "Rudra Abhishek Puja",
    image: "/services/rudra-abhishek-puja.png",
    slug: "rudra-abhishek-puja",
  },
  {
    name: "Manglik Dosha Puja",
    image: "/services/manglik-dosha-puja.png",
    slug: "manglik-dosha-puja",
  },
  {
    name: "Satya Narayan Katha",
    image: "/services/satya-narayan-katha.png",
    slug: "satya-narayan-katha",
  },
  {
    name: "Ganpati Poojan",
    image: "/services/ganpati-poojan.png",
    slug: "ganpati-poojan",
  },
  {
    name: "Shani Puja",
    image: "/services/shani-puja.png",
    slug: "shani-puja",
  },
  {
    name: "Shukra Jaap",
    image: "/services/shukra-jaap.png",
    slug: "shukra-jaap",
  },
  {
    name: "Chandra Jaap",
    image: "/services/chandra-jaap.png",
    slug: "chandra-jaap",
  },
  {
    name: "Budh Jaap",
    image: "/services/budh-jaap.png",
    slug: "budh-jaap",
  },
  {
    name: "Naag Puja",
    image: "/services/naag-puja.png",
    slug: "naag-puja",
  },
  {
    name: "Baglamukhi Havan",
    image: "/services/baglamukhi-havan.png",
    slug: "baglamukhi-havan",
  },
  {
    name: "Vishnu Puja",
    image: "/services/vishnu-puja.png",
    slug: "vishnu-puja",
  },
  {
    name: "Lakshmi Puja",
    image: "/services/lakshmi-puja.png",
    slug: "lakshmi-puja",
  },
  {
    name: "Puja on Demand",
    image: "/services/puja-on-demand.png",
    slug: "puja-on-demand",
  },
];


export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter pujas based on search query
  const filteredPujas = pujaList.filter((puja) =>
    puja.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-14 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F]">
            Our Sacred Puja Services
          </h1>
          <p className="text-lg md:text-xl text-[#0A1A2F]/70 max-w-3xl mx-auto leading-relaxed">
            Experience the divine power of authentic Vedic rituals performed by
            expert pandits. Our online puja services bring ancient wisdom to
            your doorstep, ensuring spiritual fulfillment and positive energy in
            your life.
          </p>
        </section>

        {/* Search Bar Section */}
        <section className="max-w-2xl mx-auto">
          <Input
            type="text"
            placeholder="Search puja by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 text-base border-2 border-[#E5E5E5] focus:border-[#FFA726] rounded-xl px-4"
          />
        </section>

        {/* Puja Cards Grid */}
        <section>
          {filteredPujas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPujas.map((puja) => (
                <Link
                  key={puja.slug}
                  href={`/services/${puja.slug}`}
                  className="group"
                >
                  <div className="relative h-[340px] rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">

                    {/* Image */}
                    <Image
                      src={puja.image}
                      alt={puja.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Bottom Title Strip */}
                    <div className="absolute bottom-0 w-full bg-white/95 py-4 text-center">
                      <h3 className="text-lg font-semibold text-[#FFA726] group-hover:text-[#0A1A2F] transition-colors duration-300">
                        {puja.name}
                      </h3>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#0A1A2F]/70">
                No pujas found matching your search.
              </p>
            </div>
          )}
        </section>

        {/* Informational Content Sections */}
        <section className="space-y-12 pt-8">
          {/* What is Online Puja? */}
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                What is Online Puja?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#0A1A2F]/80 leading-relaxed">
              <p>
                Online Puja is a modern approach to traditional Vedic rituals
                that allows devotees to participate in sacred ceremonies
                remotely while maintaining the authenticity and spiritual essence
                of ancient practices. Through our platform, you can book pujas
                that are performed by qualified and experienced pandits at
                designated sacred locations, following all traditional protocols
                and mantras.
              </p>
              <p>
                The pandit performs the complete puja with proper rituals,
                chanting of mantras, and offerings, while you can witness the
                ceremony live through video streaming or receive detailed updates
                and photos. This innovative approach ensures that distance or
                time constraints do not prevent you from seeking divine
                blessings and spiritual remedies.
              </p>
              <p>
                Our online puja services are conducted with the same devotion,
                precision, and adherence to Vedic scriptures as traditional
                in-person ceremonies, ensuring that the spiritual benefits and
                divine grace remain intact.
              </p>
            </CardContent>
          </Card>

          {/* Importance of Online Puja */}
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                Importance of Online Puja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-[#0A1A2F]/80 leading-relaxed">
              <p>
                In today's fast-paced world, online puja has emerged as a
                significant solution for maintaining spiritual practices while
                balancing modern life commitments. The importance of online puja
                extends beyond convenience—it represents a bridge between ancient
                wisdom and contemporary needs.
              </p>
              <p>
                According to Vedic philosophy, the power of puja lies in the
                intention, devotion, and the proper execution of rituals by
                qualified priests. The physical presence of the devotee, while
                beneficial, is not always mandatory for the puja to be effective.
                When performed with genuine devotion and proper mantras by
                experienced pandits, online pujas carry the same spiritual
                significance and divine blessings as traditional ceremonies.
              </p>
              <p>
                Online puja is particularly valuable for those who cannot travel
                to specific temples or sacred sites, have health constraints, or
                live in areas where access to qualified pandits is limited. It
                ensures that everyone, regardless of their location or
                circumstances, can access authentic Vedic rituals and seek divine
                intervention for their spiritual and material well-being.
              </p>
            </CardContent>
          </Card>

          {/* Benefits of Online Puja */}
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                Benefits of Online Puja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#0A1A2F]/80 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Accessibility:</strong>{" "}
                    Access authentic Vedic rituals from anywhere in the world,
                    eliminating geographical barriers and travel expenses.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Expert Pandits:</strong>{" "}
                    All pujas are performed by qualified, experienced pandits
                    who follow traditional Vedic protocols and mantras with
                    utmost devotion.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Time Flexibility:</strong>{" "}
                    Book pujas at your convenience, with flexible scheduling
                    options that fit your busy lifestyle.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Live Participation:</strong>{" "}
                    Witness the puja ceremony in real-time through live video
                    streaming, allowing you to participate spiritually from
                    wherever you are.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Documentation:</strong>{" "}
                    Receive detailed photos, videos, and certificates of the
                    performed puja for your records and peace of mind.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Spiritual Benefits:</strong>{" "}
                    Experience the same divine blessings, positive energy, and
                    spiritual remedies as traditional in-person pujas, as
                    the power lies in proper rituals and devotion.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FFA726] font-bold mt-1">•</span>
                  <span>
                    <strong className="text-[#0A1A2F]">Cost-Effective:</strong>{" "}
                    Save on travel expenses, accommodation, and other associated
                    costs while still receiving authentic spiritual services.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* FAQs Section */}
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                Frequently Asked Questions about Online Puja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-[#E5E5E5]">
                  <AccordionTrigger className="text-left font-semibold text-[#0A1A2F] hover:text-[#FFA726]">
                    Is online puja effective?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0A1A2F]/80 leading-relaxed">
                    Yes, online puja is absolutely effective. According to Vedic
                    scriptures, the power of puja comes from proper execution of
                    rituals, correct chanting of mantras, and genuine devotion.
                    When performed by qualified pandits following traditional
                    protocols, online pujas carry the same spiritual significance
                    and divine blessings as in-person ceremonies. Your intention
                    and faith are what matter most, and these transcend physical
                    distance.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-[#E5E5E5]">
                  <AccordionTrigger className="text-left font-semibold text-[#0A1A2F] hover:text-[#FFA726]">
                    How do I participate in an online puja?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0A1A2F]/80 leading-relaxed">
                    Participating in an online puja is simple. After booking a
                    puja service, you will receive a confirmation with the date
                    and time. On the scheduled day, you can join the live video
                    stream to witness the ceremony in real-time. You can also
                    participate spiritually by offering prayers, lighting a lamp
                    at your home, and maintaining a devotional mindset during the
                    puja. After completion, you will receive photos, videos, and
                    a certificate of the performed puja.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-[#E5E5E5]">
                  <AccordionTrigger className="text-left font-semibold text-[#0A1A2F] hover:text-[#FFA726]">
                    Who performs the puja?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0A1A2F]/80 leading-relaxed">
                    All pujas are performed by qualified, experienced, and
                    verified pandits who have extensive knowledge of Vedic
                    scriptures, mantras, and rituals. Our pandits are carefully
                    selected based on their expertise, years of experience, and
                    adherence to traditional practices. They perform the pujas at
                    designated sacred locations or temples, following all
                    traditional protocols to ensure authenticity and spiritual
                    efficacy.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b border-[#E5E5E5]">
                  <AccordionTrigger className="text-left font-semibold text-[#0A1A2F] hover:text-[#FFA726]">
                    Is prasad provided after the puja?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0A1A2F]/80 leading-relaxed">
                    Yes, prasad (blessed offerings) is an integral part of our
                    online puja services. After the puja is completed, the
                    prasad is prepared and blessed during the ceremony. Depending
                    on the puja type and your location, we can arrange for
                    prasad to be delivered to your address, or you can collect it
                    from designated centers. The prasad carries the divine
                    blessings of the puja and should be consumed with devotion
                    and gratitude.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-b border-[#E5E5E5]">
                  <AccordionTrigger className="text-left font-semibold text-[#0A1A2F] hover:text-[#FFA726]">
                    Can I book a customized puja?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#0A1A2F]/80 leading-relaxed">
                    Absolutely! We offer "Puja on Demand" service that allows you
                    to request customized pujas based on your specific needs,
                    intentions, or astrological requirements. You can specify
                    your purpose, preferred deity, special mantras, or any other
                    requirements, and our team will coordinate with expert
                    pandits to arrange a personalized puja ceremony tailored to
                    your spiritual goals. Customized pujas are particularly
                    beneficial for specific dosha remedies, career growth,
                    health issues, or other personal concerns.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}

