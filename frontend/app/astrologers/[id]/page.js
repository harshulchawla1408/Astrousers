'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const AstrologerDetailPage = () => {
  const params = useParams();
  const [astrologer, setAstrologer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/v1/astrologers/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch astrologer');
        }
        const data = await response.json();
        setAstrologer(data.data);
      } catch (err) {
        console.error('Error fetching astrologer:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAstrologer();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !astrologer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Astrologer Not Found</h1>
            <p className="text-white/80 mb-8">
              {error || 'The astrologer you are looking for does not exist.'}
            </p>
            <Link href="/astrologers">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Back to Astrologers
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-visible">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/astrologers">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
              ← Back to Astrologers
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  {/* Avatar and Status */}
                  <div className="relative mx-auto w-32 h-32">
                    <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                      <AvatarImage src={astrologer.image} alt={astrologer.name} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-2xl">
                        {astrologer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online Status */}
                    <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white/20 ${
                      astrologer.online ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      <div className={`w-full h-full rounded-full ${
                        astrologer.online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{astrologer.name}</h1>
                    <p className="text-orange-400 text-lg font-semibold">{astrologer.expertise}</p>
                    {astrologer.verified && (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                        ✓ Verified Astrologer
                      </Badge>
                    )}
                  </div>

                  {/* Rating and Reviews */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-3xl">⭐</span>
                      <span className="text-2xl font-bold text-white">{astrologer.rating}</span>
                      <span className="text-white/80">({astrologer.reviews} reviews)</span>
                    </div>
                    <p className="text-white/80">{astrologer.experience} years of experience</p>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-white font-semibold mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.isArray(astrologer.languages) ? astrologer.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                          {lang}
                        </Badge>
                      )) : (
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {astrologer.languages}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-orange-500/20 rounded-lg p-4 border border-orange-500/30">
                    <p className="text-white/80 text-sm">Price per minute</p>
                    <p className="text-3xl font-bold text-orange-400">₹{astrologer.pricePerMin}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg btn-glow"
                    >
                      {astrologer.online ? 'Start Chat' : 'Currently Busy'}
                    </Button>
                    
                    {astrologer.availability?.call && (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
                      >
                        📞 Call Now
                      </Button>
                    )}
                    
                    {astrologer.availability?.video && (
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
                      >
                        📹 Video Call
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">About {astrologer.name}</h2>
                <p className="text-white/90 leading-relaxed text-lg">
                  {astrologer.description || `Meet ${astrologer.name}, a highly experienced ${astrologer.expertise} specialist with ${astrologer.experience} years of dedicated practice. ${astrologer.name} has helped thousands of clients find clarity and guidance in their lives through expert astrological consultations.`}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            {astrologer.specialties && astrologer.specialties.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Specialties</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {astrologer.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-white/90">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Availability</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      astrologer.availability?.chat ? 'bg-green-500/20 border-2 border-green-500/50' : 'bg-gray-500/20 border-2 border-gray-500/50'
                    }`}>
                      <span className="text-2xl">💬</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Chat</h3>
                    <p className={`text-sm ${astrologer.availability?.chat ? 'text-green-400' : 'text-gray-400'}`}>
                      {astrologer.availability?.chat ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      astrologer.availability?.call ? 'bg-green-500/20 border-2 border-green-500/50' : 'bg-gray-500/20 border-2 border-gray-500/50'
                    }`}>
                      <span className="text-2xl">📞</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Call</h3>
                    <p className={`text-sm ${astrologer.availability?.call ? 'text-green-400' : 'text-gray-400'}`}>
                      {astrologer.availability?.call ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                      astrologer.availability?.video ? 'bg-green-500/20 border-2 border-green-500/50' : 'bg-gray-500/20 border-2 border-gray-500/50'
                    }`}>
                      <span className="text-2xl">📹</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">Video</h3>
                    <p className={`text-sm ${astrologer.availability?.video ? 'text-green-400' : 'text-gray-400'}`}>
                      {astrologer.availability?.video ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="bg-white/10 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Client Reviews</h2>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                      <span className="text-white font-semibold">Excellent Service</span>
                    </div>
                    <p className="text-white/80">
                      "Very accurate predictions and helpful guidance. Highly recommended!"
                    </p>
                    <p className="text-white/60 text-sm mt-2">- Anonymous Client</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
                      <span className="text-white font-semibold">Great Experience</span>
                    </div>
                    <p className="text-white/80">
                      "Professional and insightful consultation. Will definitely consult again."
                    </p>
                    <p className="text-white/60 text-sm mt-2">- Anonymous Client</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AstrologerDetailPage;
