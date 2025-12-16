"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ReviewsCarousel = () => {
  const reviews = [
    {
      id: 1,
      name: "Ritika Sharma",
      location: "Delhi, India",
      rating: 5,
      review:
        "The guidance felt genuine and calming. I received clear direction instead of generic predictions.",
      category: "Career Guidance",
      avatar: "/avatars/user1.png",
    },
    {
      id: 2,
      name: "Aman Verma",
      location: "Noida, India",
      rating: 5,
      review:
        "Very patient explanation and accurate insights. The session helped clear my confusion.",
      category: "Career",
      avatar: "/avatars/user2.png",
    },
    {
      id: 3,
      name: "Neha Kapoor",
      location: "Jaipur, India",
      rating: 5,
      review:
        "Accurate kundli analysis with practical advice. It felt reassuring and balanced.",
      category: "Kundli",
      avatar: "/avatars/user3.png",
    },
    {
      id: 4,
      name: "Rahul Mehta",
      location: "Ahmedabad, India",
      rating: 5,
      review:
        "Simple, honest, and not fear-driven. The astrologer explained everything clearly.",
      category: "General",
      avatar: "/avatars/user4.png",
    },
    {
      id: 5,
      name: "Pooja Malhotra",
      location: "Chandigarh, India",
      rating: 5,
      review:
        "The consultation helped me emotionally and mentally. Very calming experience.",
      category: "Wellness",
      avatar: "/avatars/user5.png",
    },
    {
      id: 6,
      name: "Kunal Arora",
      location: "Gurgaon, India",
      rating: 5,
      review:
        "Professional service with clear remedies and realistic expectations.",
      category: "Life Guidance",
      avatar: "/avatars/user6.png",
    },
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-base ${
          i < rating ? "text-[#FFD56B]" : "text-[#E5E5E5]"
        }`}
      >
        ★
      </span>
    ));

  return (
    <section className="py-20 bg-[#FFF7E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A1A2F] mb-4">
            What Our Early Users Say
          </h2>
          <p className="text-lg text-[#0A1A2F]/70 max-w-2xl mx-auto">
            Honest feedback from users who trusted Astrousers for guidance.
          </p>
        </div>

        {/* Carousel */}
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="bg-white rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Review */}
                    <p className="text-[#0A1A2F]/70 leading-relaxed mb-6 flex-1">
                      “{review.review}”
                    </p>

                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      {renderStars(review.rating)}
                    </div>

                    {/* User */}
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Avatar className="w-12 h-12 border border-[#FFD56B]">
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback className="bg-[#FFF7E6] text-[#0A1A2F] font-semibold">
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-center">
                        <div className="font-semibold text-[#0A1A2F]">
                          {review.name}
                        </div>
                        <div className="text-sm text-[#0A1A2F]/60">
                          {review.location}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex justify-center">
                      <Badge className="bg-[#FFF7E6] text-[#FFA726] border border-[#FFD56B]">
                        {review.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 bg-white text-[#0A1A2F]" />
          <CarouselNext className="right-2 bg-white text-[#0A1A2F]" />
        </Carousel>

        {/* Early Trust Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <div className="text-3xl font-bold text-[#0A1A2F] mb-2">50+</div>
            <div className="text-[#0A1A2F]/70">Verified Astrologers</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <div className="text-3xl font-bold text-[#0A1A2F] mb-2">1,200+</div>
            <div className="text-[#0A1A2F]/70">Consultations Completed</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm">
            <div className="text-3xl font-bold text-[#0A1A2F] mb-2">98%</div>
            <div className="text-[#0A1A2F]/70">Positive Feedback</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[#0A1A2F]/70 mb-3">
            More reviews coming as our community grows
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;
