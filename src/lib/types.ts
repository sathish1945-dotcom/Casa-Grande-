export type City = 'Chennai' | 'Coimbatore' | 'Bengaluru';

export type PropertyType = 'Apartment' | 'Sky Villa' | 'Penthouse' | 'Row Villa';

export type ProjectStatus = 'Ready to Move' | 'Under Construction' | 'New Launch';

export interface Configuration {
  id: string;
  type: string; // e.g. "2 BHK", "3 BHK Luxe", "4 BHK Sky Villa"
  bhk: number;
  carpetAreaSqFt: number;
  superBuiltUpSqFt: number;
  bathrooms: number;
  balconies: number;
  indicativePrice: number; // in INR
  priceDisplay: string; // e.g. "₹85 Lakh*"
  floorPlanUrl: string;
  availableUnits: number;
}

export interface Amenity {
  id: string;
  name: string;
  category: 'Wellness & Sport' | 'Leisure & Social' | 'Security & Tech' | 'Green Living';
  icon: string;
  description?: string;
}

export interface NearbyLandmark {
  name: string;
  type: 'Metro' | 'Airport' | 'IT Corridor' | 'School' | 'Hospital' | 'Beach';
  distanceKm: number;
  commuteTimeMins: number;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: City;
  locality: string;
  address: string;
  propertyType: PropertyType;
  status: ProjectStatus;
  possessionDate: string; // e.g. "Dec 2026" or "Immediate"
  reraId: string;
  startingPrice: number; // in INR
  startingPriceDisplay: string; // e.g. "₹1.45 Cr*"
  maxPrice: number;
  totalAcreage: number; // e.g. 8.5
  totalTowers: number;
  totalUnits: number;
  openSpacePercentage: number; // e.g. 78%
  heroImage: string;
  galleryImages: string[];
  description: string;
  longDescription: string;
  featured: boolean;
  configurations: Configuration[];
  amenities: string[]; // amenity IDs or names
  nearbyLandmarks: NearbyLandmark[];
  constructionUpdates?: {
    date: string;
    stage: string;
    percentComplete: number;
  };
  brochureFileName: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  preferredCity?: City;
  projectId?: string;
  projectName?: string;
  budgetRange: string;
  purchaseTimeline: string;
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Qualified' | 'Closed' | 'Archived';
  source: 'HomeFinder AI' | 'Homepage Hero' | 'Site Visit Form' | 'Brochure Download' | 'Project Details';
  notes?: string;
  consent: boolean;
  scheduledVisitDate?: string;
  scheduledVisitSlot?: string;
}

export interface SiteVisitBookingRequest {
  projectId: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTimeSlot: 'Morning (10:00 AM - 12:00 PM)' | 'Afternoon (02:00 PM - 04:00 PM)' | 'Evening (04:30 PM - 06:30 PM)';
  cabAssistanceRequired: boolean;
  pickupLocation?: string;
  accompanyingGuests: number;
  consent: boolean;
}

export interface PropertyFilterParams {
  city?: City | 'All';
  locality?: string;
  bhk?: number | 'All';
  minBudget?: number;
  maxBudget?: number;
  propertyType?: PropertyType | 'All';
  status?: ProjectStatus | 'All';
  searchQuery?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'possession' | 'featured';
}

export interface AssistantChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProjectIds?: string[];
  suggestedPrompts?: string[];
}
