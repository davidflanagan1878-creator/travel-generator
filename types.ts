export interface TravelPreferences {
  destination: string;
  travelers: string;
  duration: string;
  occasion: string;
  budget: 'Economy' | 'Standard' | 'Luxury' | 'Ultra-Luxury';
  interests: string[];
}

export interface OfferPackage {
  id: string;
  title: string;
  tagline: string;
  description: string;
  price: string;
  currency: string;
  perks: string[];
  roomType: string;
  cancellationPolicy: string;
  matchScore: number; // 0-100
  tags: string[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING_OFFERS = 'GENERATING_OFFERS',
  GENERATING_VISUALS = 'GENERATING_VISUALS',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
