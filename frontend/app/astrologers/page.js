'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const AstrologersPage = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (filters.category) params.append('category', filters.category);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.language) params.append('language', filters.language);
        if (filters.expertise) params.append('expertise', filters.expertise);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/astrologers?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch astrologers');
        }
        const data = await response.json();
        setAstrologers(data.data || []);
      } catch (err) {
        console.error('Error fetching astrologers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologers();
  }, [searchTerm, filters, sortBy, sortOrder]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      gender: '',
      language: '',
      expertise: ''
    });
    setSortBy('rating');
    setSortOrder('desc');
  };

  const categories = [
    'Vedic Astrology', 'Tarot & Numerology', 'Vastu & Palmistry', 
    'Spiritual Healing', 'Love & Family', 'Business & Finance',
    'Gemology & Remedies', 'Numerology', 'Palmistry', 'Vastu Shastra', 'Tarot Reading'
  ];

  const languages = ['Hindi', 'English', 'Tamil', 'Punjabi', 'Sanskrit', 'Bengali', 'Gujarati', 'Telugu', 'Marathi', 'Kannada'];
  const expertises = ['Vedic Astrology', 'Tarot Reading', 'Vastu Shastra', 'Spiritual Guidance', 'Love & Relationships', 'Business Astrology', 'Vedic Gemology', 'Vedic Numerology', 'Vedic Palmistry', 'Vedic Vastu', 'Tarot Angel Card Reading'];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 gradient-text">
            Talk to India's Best Astrologers
          </h1>
          <p className="text-xl text-orange-100 mb-8">
            Connect with verified astrologers for personalized guidance
          </p>
          
          {/* Balance and Recharge */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-white font-semibold">Available Balance ₹ 0</span>
            </div>
            <Button className="bg-white text-orange-600 hover:bg-orange-50 border-2 border-white btn-glow">
              Recharge
            </Button>
            <Button 
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/astrologers/make-online`, {
                    method: 'POST'
                  });
                  const data = await response.json();
                  if (data.success) {
                    alert('All astrologers are now online!');
                    window.location.reload();
                  }
                } catch (error) {
                  console.error('Error making astrologers online:', error);
                }
              }}
              className="bg-green-500 text-white hover:bg-green-600 border-2 border-green-400 btn-glow"
            >
              Make All Online
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-visible">
        {/* Search and Filter Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70">
                  🔍
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.language} onValueChange={(value) => handleFilterChange('language', value)}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.expertise} onValueChange={(value) => handleFilterChange('expertise', value)}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Expertise</SelectItem>
                  {expertises.map(expertise => (
                    <SelectItem key={expertise} value={expertise}>{expertise}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="pricePerMin">Price</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/80">
            Showing {astrologers.length} astrologer{astrologers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Astrologers Grid */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Error: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Retry
            </Button>
          </div>
        ) : astrologers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">No astrologers found matching your criteria.</p>
            <Button 
              onClick={clearFilters}
              className="mt-4 bg-orange-500 hover:bg-orange-600"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astrologer) => (
              <Card key={astrologer._id} className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white/10 backdrop-blur-sm astrologer-card ${astrologer.online ? 'glow-border' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar and Status */}
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white/20 shadow-lg">
                        <AvatarImage src={astrologer.image} alt={astrologer.name} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white text-lg">
                          {astrologer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Online Status */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white/20 bg-green-500">
                        <div className="w-full h-full rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Name and Expertise */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors duration-200">
                        {astrologer.name}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {astrologer.expertise}
                      </p>
                    </div>

                    {/* Experience and Rating */}
                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-orange-400">⭐</span>
                        <span className="font-semibold text-white">{astrologer.rating}</span>
                        <span className="text-white/60">({astrologer.reviews})</span>
                      </div>
                      <div className="text-white/60">•</div>
                      <div className="text-white/80">{astrologer.experience} years</div>
                    </div>

                    {/* Languages */}
                    <div className="text-sm text-white/80">
                      {Array.isArray(astrologer.languages) ? astrologer.languages.join(', ') : astrologer.languages}
                    </div>

                    {/* Price and Badges */}
                    <div className="flex items-center justify-center space-x-2">
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                        ₹{astrologer.pricePerMin}/min
                      </Badge>
                      {astrologer.verified && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
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
                        Call
                      </Button>
                      <Link href={`/astrologers/${astrologer._id}`} scroll={false}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AstrologersPage;
