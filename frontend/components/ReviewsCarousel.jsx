'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const ReviewsCarousel = () => {
  const reviews = [
    {
      id: 1,
      name: "Ananya R.",
      location: "Mumbai, India",
      rating: 5,
      review: "Astrousers gave me the clarity I needed to switch careers. The reading was precise and the remedies worked.",
      category: "Career",
      avatar: "/login.jpg"
    },
    {
      id: 2,
      name: "Anushka P.",
      location: "Srinagar, India",
      rating: 5,
      review: "I had a 3-month consultation and my relationship improved dramatically. Grateful for the practical suggestions.",
      category: "Relationship",
      avatar: "/signup.jpg"
    },
    {
      id: 3,
      name: "Meera S.",
      location: "Bangalore, India",
      rating: 5,
      review: "Fast, accurate chart & a caring astrologer. Their gemstone advice was spot on.",
      category: "Remedies",
      avatar: "/slider-01.jpg"
    },
    {
      id: 4,
      name: "Arjun P.",
      location: "Chennai, India",
      rating: 5,
      review: "The Vastu consultation helped transform my home energy. Highly recommend their services.",
      category: "Vastu",
      avatar: "/slider-02.png"
    },
    {
      id: 5,
      name: "Priya M.",
      location: "Kolkata, India",
      rating: 5,
      review: "Amazing numerology reading that helped me understand my life path better.",
      category: "Numerology",
      avatar: "/logo.jpg"
    },
    {
      id: 6,
      name: "Vikram S.",
      location: "Pune, India",
      rating: 5,
      review: "Professional service with detailed explanations. The astrologer was very patient and knowledgeable.",
      category: "General",
      avatar: "/login.jpg"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CUSTOMERS REVIEWS
          </h2>
          <p className="text-xl text-white/90 mb-2">
            Top Astrologers. 24x7 customer support. Happy to help.
          </p>
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
              {reviews.map((review) => (
                <CarouselItem key={review.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Quote Mark */}
                      <div className="text-6xl text-gray-200 font-serif leading-none mb-4">
                        "
                      </div>
                      
                      {/* Review Content */}
                      <div className="flex-1 flex flex-col">
                        <p className="text-gray-700 leading-relaxed mb-6 flex-1">
                          {review.review}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-center mb-4">
                          {renderStars(review.rating)}
                        </div>
                        
                        {/* User Info */}
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <Avatar className="w-12 h-12 border-2 border-orange-200">
                            <AvatarImage src={review.avatar} alt={review.name} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{review.name}</div>
                            <div className="text-sm text-gray-600">{review.location}</div>
                          </div>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="flex justify-center">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            {review.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-gray-900 border-gray-200" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white text-gray-900 border-gray-200" />
          </Carousel>
        </div>

        {/* Trust Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">2000+</div>
            <div className="text-white/90">Verified Astrologers</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">15Cr+</div>
            <div className="text-white/90">Call/Chat Minutes</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-2">1Cr+</div>
            <div className="text-white/90">Happy Customers</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-white/90 mb-4">See more success stories</p>
          <button className="text-white underline hover:text-white/80 transition-colors duration-200">
            All Reviews →
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;
