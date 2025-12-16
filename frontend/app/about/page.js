import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
function AboutTestimonial({ name, location, avatar, quote }) {
  return (
    <div className="rounded-[20px] p-6 bg-white border border-[#E5E5E5] shadow-md hover:shadow-xl transition-all duration-300 h-full">

      <p className="text-[#0A1A2F]/70 mb-6 leading-relaxed">
        “{quote}”
      </p>

      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="rounded-full object-cover border border-[#FFD56B]"
        />
        <div>
          <div className="font-semibold text-[#0A1A2F]">{name}</div>
          <div className="text-sm text-[#0A1A2F]/60">{location}</div>
        </div>
      </div>

    </div>
  );
}

// Local image path (provided in conversation assets)
const HERO_IMAGE = "/mnt/data/8c390b18-bdfc-4bdc-aa7a-bdc84436a8ce.png";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFF7E6] text-[#0A1A2F]">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pt-16">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Badge className="bg-[#FFB300] text-[#0A1A2F]">About Astrousers</Badge>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#0A1A2F]">Your personalized portal to moderstrology</h1>
              <p className="text-lg text-[#0A1A2F]/70 max-w-2xl">
                We blend timeless Vedic wisdom with modern technology — giving you clear, accurate and actionable insights that help you take better decisions. From instant kundli generation to live consultations with verified experts, Astrousers makes astrology accessible and trustworthy.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white rounded-xl">Talk to an Astrologer</Button>
                <Button variant="outline" className="border border-[#0A1A2F] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white rounded-xl">Generate Your Kundli</Button>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard number="500+" label="Verified Astrologers" />
                <StatCard number="10M+" label="Chat & Call Minutes" />
                <StatCard number="1M+" label="Happy Users" />
                <StatCard number="4.8/5" label="Average Rating" />
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-100">
                <Image src={HERO_IMAGE} alt="Astrousers" width={640} height={480} className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* VISION / MISSION / VALUES */}
        <section className="bg-white py-20 border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-4">
                What Drives Astrousers
              </h2>
              <p className="text-lg text-[#0A1A2F]/70 max-w-3xl mx-auto">
                Our purpose, promise, and principles guide everything we build — for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Vision */}
              <div className="bg-[#FFF7E6] rounded-[24px] p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white flex items-center justify-center">
                  <Image
                    src="/social/vision.png"
                    alt="Our Vision"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1A2F] mb-3">
                  Our Vision
                </h3>
                <p className="text-[#0A1A2F]/70 leading-relaxed">
                  To make astrology a trusted companion for people seeking clarity,
                  direction, and emotional balance in everyday life.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-[#FFF7E6] rounded-[24px] p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white flex items-center justify-center">
                  <Image
                    src="/social/mission.png"
                    alt="Our Mission"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1A2F] mb-3">
                  Our Mission
                </h3>
                <p className="text-[#0A1A2F]/70 leading-relaxed">
                  Deliver reliable Vedic astrology through modern technology, verified
                  experts, and transparent guidance.
                </p>
              </div>

              {/* Values */}
              <div className="bg-[#FFF7E6] rounded-[24px] p-8 text-center shadow-md hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-white flex items-center justify-center">
                  <Image
                    src="/social/values.png"
                    alt="Our Values"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1A2F] mb-3">
                  Core Values
                </h3>
                <p className="text-[#0A1A2F]/70 leading-relaxed">
                  Authenticity · Simplicity · Transparency · Empathy · Innovation
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6 text-[#0A1A2F]">What you can do on Astrousers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard title="Talk to Astrologers" desc="Instant chat, call or video with verified astrologers." emoji="🗣️" />
              <FeatureCard title="Generate Kundli" desc="Accurate Vedic chart generation and downloadable reports." emoji="🧭" />
              <FeatureCard title="Match Making" desc="Detailed kundli milan & compatibility reports for couples." emoji="💞" />
              <FeatureCard title="Horoscope Insights" desc="Daily, weekly, monthly and yearly horoscopes tailored for you." emoji="📅" />
              <FeatureCard title="Tarot & Spreads" desc="Instant tarot card readings for clarity and guidance." emoji="🔮" />
              <FeatureCard title="Astro Store" desc="Gemstones, yantras and remedies recommended by experts." emoji="🛍️" />
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="bg-white py-16 border-t border-[#E5E5E5]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h3 className="text-2xl font-semibold mb-8 text-[#0A1A2F]">How Astrousers Works</h3>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <WorkflowStep step="1" title="Create Account" desc="Sign up quickly with email or social providers." />
              <WorkflowStep step="2" title="Add Profile" desc="(Optional) Add birth details for personalized readings." />
              <WorkflowStep step="3" title="Connect" desc="Choose an astrologer by expertise, rating and price." />
              <WorkflowStep step="4" title="Get Insights" desc="Receive clear, actionable answers and records." />
            </ol>
          </div>
        </section>

        {/* STORY */}
        <section className="py-16 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[#0A1A2F]">Our Story</h3>
              <p className="text-[#0A1A2F]/70 mb-4">Astrousers began with a simple question: Why should astrology be vague and inaccessible? We started building a platform that combines verified astrologers, transparent pricing and tech-first delivery so people can get reliable guidance—fast.</p>
              <p className="text-[#0A1A2F]/70">Today we serve thousands of users every day, focusing on accuracy, trust, and a delightful user experience. Our team blends deep Vedic knowledge with modern engineering to make insights meaningful.</p>
              <div className="mt-6 flex gap-3">
                <Button className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white rounded-xl">Explore Services</Button>
                <Button variant="outline" className="border border-[#0A1A2F] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white rounded-xl">Meet the Team</Button>
              </div>
            </div>
            <div>
              <Card className="bg-white border border-[#E5E5E5] shadow-md rounded-[20px]">
                <CardContent>
                  <CardTitle className="text-[#0A1A2F]">Verified Experts</CardTitle>
                  <CardDescription className="text-[#0A1A2F]/70">All astrologers on Astrousers go through a verification and interview process to ensure quality and authenticity.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 bg-[#FFF7E6] border-t border-[#E5E5E5]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">

            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-[#0A1A2F] mb-3">
                What Our Users Say
              </h3>
              <p className="text-[#0A1A2F]/70 max-w-2xl mx-auto">
                Honest feedback from users who trusted Astrousers for guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <AboutTestimonial
                name="Ritika Sharma"
                location="Delhi, India"
                avatar="/avatars/user1.jpg"
                quote="The guidance felt genuine and calming. I received clear direction instead of generic predictions."
              />

              <AboutTestimonial
                name="Aman Verma"
                location="Noida, India"
                avatar="/avatars/user2.jpg"
                quote="Very patient explanation and accurate insights. The session helped clear my confusion."
              />

              <AboutTestimonial
                name="Neha Kapoor"
                location="Jaipur, India"
                avatar="/avatars/user3.jpg"
                quote="Accurate kundli analysis with practical advice. It felt reassuring and balanced."
              />

            </div>
          </div>
        </section>


        {/* CALL TO ACTION */}
        <section className="py-16 bg-white border-t border-[#E5E5E5]">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-4 text-[#0A1A2F]">Ready to discover your cosmic self?</h3>
            <p className="text-[#0A1A2F]/70 mb-6">Start with a quick kundli or talk to an expert right now. Clear insights, zero guesswork.</p>
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white rounded-xl">Talk to an Astrologer</Button>
              <Button variant="outline" className="border border-[#0A1A2F] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white rounded-xl">Generate Kundli</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Small component helpers (in-file for simplicity) ---------- */

function StatCard({ number, label }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-[#E5E5E5] text-center">
      <div className="text-2xl font-extrabold text-[#0A1A2F]">{number}</div>
      <div className="text-sm text-[#0A1A2F]/70 mt-1">{label}</div>
    </div>
  );
}

function ValueCard({ title, description, iconEmoji }) {
  return (
    <Card className="bg-white border border-[#E5E5E5] shadow-md rounded-[20px]">
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="text-3xl">{iconEmoji}</div>
          <div>
            <h4 className="font-semibold text-[#0A1A2F]">{title}</h4>
            <p className="text-sm text-[#0A1A2F]/70 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ title, desc, emoji }) {
  return (
    <div className="rounded-[20px] p-6 border border-[#E5E5E5] shadow-md bg-white">
      <div className="text-3xl mb-4">{emoji}</div>
      <h4 className="font-semibold mb-1 text-[#0A1A2F]">{title}</h4>
      <p className="text-sm text-[#0A1A2F]/70">{desc}</p>
    </div>
  );
}

function WorkflowStep({ step, title, desc }) {
  return (
    <div className="p-4 bg-white rounded-[20px] border border-[#E5E5E5] shadow-md text-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFA726] to-[#FFB300] text-white mx-auto flex items-center justify-center font-bold mb-3">{step}</div>
      <h5 className="font-semibold text-[#0A1A2F]">{title}</h5>
      <p className="text-sm text-[#0A1A2F]/70 mt-1">{desc}</p>
    </div>
  );
}

function Testimonial({ name, title, quote }) {
  return (
    <div className="rounded-[20px] p-6 bg-white border border-[#E5E5E5] shadow-md">
      <p className="text-[#0A1A2F]/70 mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFA726] to-[#FFB300]" />
        <div>
          <div className="font-medium text-[#0A1A2F]">{name}</div>
          <div className="text-xs text-[#0A1A2F]/60">{title}</div>
        </div>
      </div>
    </div>
  );
}
