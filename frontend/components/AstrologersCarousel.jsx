'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from 'next/link';

const AstrologersCarousel = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // same query state as /astrologers/page.js
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    language: '',
    expertise: ''
  });
  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filters.category) params.append('category', filters.category);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.language) params.append('language', filters.language);
        if (filters.expertise) params.append('expertise', filters.expertise);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        // Get backend URL and ensure no trailing slash
        const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '');
        const url = `${backendUrl}/api/v1/astrologers?${params.toString()}`;
        
        console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT SET - using fallback');
        console.log('Fetching astrologers from:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', response.status, errorText);
          throw new Error(`Failed to fetch astrologers: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Astrologers data received:', data);
        setAstrologers(data.data || []);
      } catch (err) {
        console.error('Error fetching astrologers:', err);
        setError(err.message || 'Failed to fetch astrologers. Please check if the backend is running.');
        setAstrologers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, [searchTerm, filters, sortBy, sortOrder]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Connect with our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">professional astrologers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Our astrologers are experts in Vedic and modern astrology, tarot, numerology, and remedial therapies.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || astrologers.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Connect with our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">professional astrologers</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Our astrologers are experts in Vedic and modern astrology, tarot, numerology, and remedial therapies.
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              {error ? `Error loading astrologers: ${error}` : 'No astrologers available at the moment.'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
              {astrologers.slice(0, 4).map((astrologer) => (
                <CarouselItem key={astrologer._id || astrologer.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
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
                            {astrologer.expertise}
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
                          <div className="text-gray-600">{astrologer.experience} years</div>
                        </div>

                        {/* Languages */}
                        <div className="text-sm text-gray-600">
                          {Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : astrologer.languages}
                        </div>

                        {/* Price and Badges */}
                        <div className="flex items-center justify-center space-x-2">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            ₹{astrologer.pricePerMin}/min
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
                          >
                            Chat Now
                          </Button>
                          <Link href={`/astrologers/${astrologer._id || astrologer.id}`} scroll={false}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                            >
                              View Profile
                            </Button>
                          </Link>
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
          <Link href="/astrologers" scroll={false}>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Show More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AstrologersCarousel;
