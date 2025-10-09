'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const AstrologersCarousel = () => {
  const astrologers = [
    {
      id: 1,
      name: "Pandit Rohit Sharma",
      specialty: "Kundli, Marriage Compatibility, Career Guidance",
      experience: "15+ years",
      rating: 4.9,
      reviews: 1200,
      languages: "Hindi, English",
      price: "₹5/min",
      image: "/login.jpg", // Using available image
      verified: true,
      online: true
    },
    {
      id: 2,
      name: "Dr. Priya Singh",
      specialty: "Vedic Astrology, Tarot, Numerology",
      experience: "12+ years",
      rating: 4.8,
      reviews: 980,
      languages: "Hindi, English, Tamil",
      price: "₹7/min",
      image: "/signup.jpg", // Using available image
      verified: true,
      online: true
    },
    {
      id: 3,
      name: "Acharya Vikram",
      specialty: "Vastu, Palmistry, Remedies",
      experience: "20+ years",
      rating: 4.9,
      reviews: 1500,
      languages: "Hindi, Punjabi, English",
      price: "₹6/min",
      image: "/slider-01.jpg", // Using available image
      verified: true,
      online: false
    },
    {
      id: 4,
      name: "Swami Ananda",
      specialty: "Spiritual Guidance, Chakra Healing",
      experience: "18+ years",
      rating: 4.7,
      reviews: 850,
      languages: "Hindi, English, Sanskrit",
      price: "₹8/min",
      image: "/slider-02.png", // Using available image
      verified: true,
      online: true
    },
    {
      id: 5,
      name: "Mata Rani Devi",
      specialty: "Love Problems, Family Issues",
      experience: "25+ years",
      rating: 4.9,
      reviews: 2000,
      languages: "Hindi, Bengali, English",
      price: "₹4/min",
      image: "/logo.jpg", // Using available image
      verified: true,
      online: true
    },
    {
      id: 6,
      name: "Guru Maharaj",
      specialty: "Business Astrology, Stock Market",
      experience: "22+ years",
      rating: 4.8,
      reviews: 1200,
      languages: "Hindi, English, Gujarati",
      price: "₹10/min",
      image: "/login.jpg", // Using available image
      verified: true,
      online: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Connect with our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">professional astrologers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Our astrologers are experts in Vedic and modern astrology, tarot, numerology, and remedial therapies. Each profile includes verified credentials, client ratings, specialties, and availability.
          </p>
          <div className="text-sm text-gray-500">
            All consultations are recorded for quality and delivered with confidentiality.
          </div>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {astrologers.map((astrologer) => (
                <CarouselItem key={astrologer.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {/* Avatar and Status */}
                        <div className="relative">
                          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                            <AvatarImage src={astrologer.image} alt={astrologer.name} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-xl">
                              {astrologer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Online Status */}
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                            astrologer.online ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            <div className={`w-full h-full rounded-full ${
                              astrologer.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          </div>
                        </div>

                        {/* Name and Specialty */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                            {astrologer.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {astrologer.specialty}
                          </p>
                        </div>

                        {/* Experience and Rating */}
                        <div className="flex items-center justify-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-orange-500">⭐</span>
                            <span className="font-semibold text-gray-900">{astrologer.rating}</span>
                            <span className="text-gray-500">({astrologer.reviews})</span>
                          </div>
                          <div className="text-gray-500">•</div>
                          <div className="text-gray-600">{astrologer.experience}</div>
                        </div>

                        {/* Languages */}
                        <div className="text-sm text-gray-600">
                          {astrologer.languages}
                        </div>

                        {/* Price and Badges */}
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {astrologer.price}
                          </Badge>
                          {astrologer.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 w-full">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            data-cursor="pointer"
                          >
                            Chat Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                            data-cursor="pointer"
                          >
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            data-cursor="pointer"
          >
            View All Astrologers
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AstrologersCarousel;
