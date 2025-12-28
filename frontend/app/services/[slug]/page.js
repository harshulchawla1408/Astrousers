"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPujaBySlug, getRandomPujas } from "@/lib/pujaData";
import { useCart } from "@/contexts/CartContext";

export default function PujaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [puja, setPuja] = useState(null);
  const [relatedPujas, setRelatedPujas] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const slug = params.slug;
    const foundPuja = getPujaBySlug(slug);
    
    if (foundPuja) {
      setPuja(foundPuja);
      // Get 3 random related pujas
      const related = getRandomPujas(slug, 3);
      setRelatedPujas(related);
    }
  }, [params.slug]);

  const handleBookNow = () => {
    if (!puja) return;
    
    setIsAddingToCart(true);
    addToCart(puja);
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setIsAddingToCart(false);
    }, 2000);
    
    // Optionally redirect to cart page after a delay
    // setTimeout(() => {
    //   router.push('/cart');
    // }, 2000);
  };

  if (!puja) {
    return (
      <div className="min-h-screen bg-[#FFF7E6]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-20">
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white text-center py-12">
            <CardContent>
              <h1 className="text-3xl font-bold text-[#0A1A2F] mb-4">
                Puja Not Found
              </h1>
              <p className="text-lg text-[#0A1A2F]/70 mb-6">
                The puja you're looking for doesn't exist.
              </p>
              <Link href="/services">
                <Button className="bg-[#FFA726] hover:bg-[#FF8F00] text-white">
                  Browse All Pujas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-0 opacity-100">
          <p className="font-semibold">✓ Added to cart successfully!</p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-14 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A1A2F]">
            {puja.name}
          </h1>
          <p className="text-lg md:text-xl text-[#0A1A2F]/70 max-w-3xl mx-auto leading-relaxed">
            Experience the divine power of this sacred Vedic ritual performed by
            expert pandits with utmost devotion and traditional protocols.
          </p>
        </section>

        {/* Puja Image Section */}
        <section className="w-full">
          <div className="relative w-full h-[500px] md:h-[650px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={puja.image}
              alt={puja.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </section>

        {/* Description Section */}
        <section>
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                About This Puja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-[#0A1A2F]/80 leading-relaxed">
                {puja.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-justify">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section>
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                Benefits of {puja.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-[#0A1A2F]/80 leading-relaxed">
                {puja.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#FFA726] font-bold text-lg">•</span>
                    <span className="text-justify">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Puja Details Card */}
        <section>
          <Card className="rounded-2xl border border-[#F1F1F1] shadow-md bg-white">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-[#0A1A2F]">
                Puja Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Price
                    </h3>
                    <p className="text-3xl font-bold text-[#FFA726]">
                      ₹{puja.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Duration
                    </h3>
                    <p className="text-lg text-[#0A1A2F]/80">{puja.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Ideal For
                    </h3>
                    <p className="text-lg text-[#0A1A2F]/80">{puja.idealFor}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Performed By
                    </h3>
                    <p className="text-lg text-[#0A1A2F]/80">
                      Expert pandits with years of experience
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Mode
                    </h3>
                    <p className="text-lg text-[#0A1A2F]/80">
                      Online / Temple-based
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                      Language
                    </h3>
                    <p className="text-lg text-[#0A1A2F]/80">Sanskrit</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call To Action */}
        <section className="flex justify-center">
          <Button
            onClick={handleBookNow}
            disabled={isAddingToCart}
            className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-12 py-6 text-lg font-semibold"
          >
            {isAddingToCart ? "Adding to Cart..." : "Book Now"}
          </Button>
        </section>

        {/* Related Pujas Section */}
        {relatedPujas.length > 0 && (
          <section className="space-y-6 pt-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] text-center">
              Explore Other Pujas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPujas.map((relatedPuja) => (
                <Link
                  key={relatedPuja.slug}
                  href={`/services/${relatedPuja.slug}`}
                  className="group"
                >
                  <div className="relative h-[340px] rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                    <Image
                      src={relatedPuja.image}
                      alt={relatedPuja.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 w-full bg-white/95 py-4 text-center">
                      <h3 className="text-lg font-semibold text-[#FFA726] group-hover:text-[#0A1A2F] transition-colors duration-300">
                        {relatedPuja.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

