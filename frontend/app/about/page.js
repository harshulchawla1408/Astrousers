import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Local image path (provided in conversation assets)
const HERO_IMAGE = "/mnt/data/8c390b18-bdfc-4bdc-aa7a-bdc84436a8ce.png";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <Badge className="bg-violet-100 text-violet-700">About Astrousers</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Your personalized portal to moderstrology</h1>
            <p className="text-lg text-slate-700 max-w-2xl">
              We blend timeless Vedic wisdom with modern technology — giving you clear, accurate and actionable insights that help you take better decisions. From instant kundli generation to live consultations with verified experts, Astrousers makes astrology accessible and trustworthy.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-orange-500 to-rose-500 hover:opacity-95 text-white">Talk to an Astrologer</Button>
              <Button variant="ghost" className="border border-slate-200">Generate Your Kundli</Button>
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard title="Our Vision" description="To make astrology a trusted companion for people seeking clarity, direction and emotional balance." iconEmoji="🔭" />
            <ValueCard title="Our Mission" description="Deliver reliable Vedic astrology via modern interfaces, verified experts and transparent methods." iconEmoji="🚀" />
            <ValueCard title="Core Values" description="Authenticity · Simplicity · Transparency · Empathy · Innovation" iconEmoji="✨" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">What you can do on Astrousers</h2>
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
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h3 className="text-2xl font-semibold mb-8">How Astrousers Works</h3>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <WorkflowStep step="1" title="Create Account" desc="Sign up quickly with email or social providers." />
            <WorkflowStep step="2" title="Add Profile" desc="(Optional) Add birth details for personalized readings." />
            <WorkflowStep step="3" title="Connect" desc="Choose an astrologer by expertise, rating and price." />
            <WorkflowStep step="4" title="Get Insights" desc="Receive clear, actionable answers and records." />
          </ol>
        </div>
      </section>

      {/* STORY */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-slate-700 mb-4">Astrousers began with a simple question: Why should astrology be vague and inaccessible? We started building a platform that combines verified astrologers, transparent pricing and tech-first delivery so people can get reliable guidance—fast.</p>
            <p className="text-slate-700">Today we serve thousands of users every day, focusing on accuracy, trust, and a delightful user experience. Our team blends deep Vedic knowledge with modern engineering to make insights meaningful.</p>
            <div className="mt-6 flex gap-3">
              <Button className="bg-emerald-600 text-white">Explore Services</Button>
              <Button variant="ghost">Meet the Team</Button>
            </div>
          </div>
          <div>
            <Card>
              <CardContent>
                <CardTitle>Verified Experts</CardTitle>
                <CardDescription>All astrologers on Astrousers go through a verification and interview process to ensure quality and authenticity.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h3 className="text-2xl font-semibold mb-8">What our users say</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial name="Ritika" title="Life Coach" quote="Accurate readings and kind guidance. The astrologer recommended steps that really helped me." />
            <Testimonial name="Aman" title="Designer" quote="Fast, clear and trustworthy. I used the kundli generation and shared it with my family." />
            <Testimonial name="Neha" title="Student" quote="The chat experience is smooth and the wallet makes payments easy." />
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to discover your cosmic self?</h3>
          <p className="text-slate-600 mb-6">Start with a quick kundli or talk to an expert right now. Clear insights, zero guesswork.</p>
          <div className="flex items-center justify-center gap-4">
            <Button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">Talk to an Astrologer</Button>
            <Button variant="ghost">Generate Kundli</Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} Astrousers. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <a className="text-sm text-slate-600">Privacy</a>
            <a className="text-sm text-slate-600">Terms</a>
            <a className="text-sm text-slate-600">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Small component helpers (in-file for simplicity) ---------- */

function StatCard({ number, label }) {
  return (
    <div className="bg-gradient-to-r from-white to-slate-50 rounded-lg p-4 shadow-sm border border-slate-100 text-center">
      <div className="text-2xl font-extrabold">{number}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function ValueCard({ title, description, iconEmoji }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="text-3xl">{iconEmoji}</div>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ title, desc, emoji }) {
  return (
    <div className="rounded-2xl p-6 border border-slate-100 shadow-sm bg-white">
      <div className="text-3xl mb-4">{emoji}</div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function WorkflowStep({ step, title, desc }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold mb-3">{step}</div>
      <h5 className="font-semibold">{title}</h5>
      <p className="text-sm text-slate-600 mt-1">{desc}</p>
    </div>
  );
}

function Testimonial({ name, title, quote }) {
  return (
    <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
      <p className="text-slate-700 mb-4">“{quote}”</p>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100" />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-slate-500">{title}</div>
        </div>
      </div>
    </div>
  );
}
