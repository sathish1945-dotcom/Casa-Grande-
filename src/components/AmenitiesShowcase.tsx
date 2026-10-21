import React, { useState } from 'react';
import {
  Waves,
  Trees,
  Dumbbell,
  Shield,
  Zap,
  Coffee,
  Sparkles,
  HeartPulse,
} from 'lucide-react';

export const AmenitiesShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'wellness' | 'social' | 'sports'>('all');

  const lifestylePillars = [
    {
      id: 'coastal-clubhouse',
      title: 'Grand 30,000 sq.ft Clubhouses',
      category: 'social',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      description: 'Double-height social atriums featuring private screening rooms, cigar lounges, banquet halls, and gourmet resident bistros.',
      tag: 'Social & Hospitality',
    },
    {
      id: 'infinity-horizon',
      title: 'Cantilevered Ocean & Sky Pools',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
      description: 'Suspended temperature-controlled ozone swimming pools with panoramic deck views, heated jacuzzis, and shallow kids splash pads.',
      tag: 'Aquatics & Leisure',
    },
    {
      id: 'zen-botanical',
      title: '78%+ Landscaped Botanical Canopy',
      category: 'wellness',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
      description: 'Zero-vehicle ground podiums featuring Japanese Zen rock gardens, oxygen-rich fragrance groves, and private reflexology pathways.',
      tag: 'Green Living',
    },
    {
      id: 'sports-arena',
      title: 'Championship Sports Complex',
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      description: 'World-class glass-backed squash courts, floodlit tennis arena, full-size futsal turf, and air-conditioned badminton pavilions.',
      tag: 'Active Recreation',
    },
  ];

  const filteredPillars = activeTab === 'all'
    ? lifestylePillars
    : lifestylePillars.filter((p) => p.category === activeTab);

  return (
    <section id="amenities-section" className="py-20 bg-[#FAF8F5] border-t border-[#E8E2D7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9C7A4A] block mb-2">
              Resort-Inspired Living
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0D2818] tracking-tight">
              Curated for the Discerning Lifestyle
            </h2>
            <p className="text-sm text-[#55615B] mt-2 max-w-xl">
              From Olympic-standard sporting facilities to private seaside boardwalks, every amenity is
              engineered to elevate your everyday well-being.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'all'
                  ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
              }`}
            >
              All Amenities
            </button>
            <button
              onClick={() => setActiveTab('wellness')}
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'wellness'
                  ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
              }`}
            >
              Wellness & Aquatics
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'social'
                  ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
              }`}
            >
              Clubhouse & Social
            </button>
            <button
              onClick={() => setActiveTab('sports')}
              className={`px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === 'sports'
                  ? 'bg-[#0D2818] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#FFFFFF] border border-[#DDD6C8] text-[#55615B] hover:bg-[#F2ECE1]'
              }`}
            >
              Sports & Active
            </button>
          </div>
        </div>

        {/* 4 Architectural Lifestyle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPillars.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#FFFFFF] rounded border border-[#E5DFD3] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#ECE5D8]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded bg-[#0D2818]/85 backdrop-blur-sm text-[11px] font-semibold text-[#DFCCA8] uppercase tracking-wider">
                  {item.tag}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0D2818] group-hover:text-[#2A5E3F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#55615B] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs text-[#7A8680]">
                  <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                    Included in All Masterplans
                  </span>
                  <span className="text-[11px]">100% Operational Guarantee</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
