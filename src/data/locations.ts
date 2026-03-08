import { LocationCoord } from '@/types';

export const locationCoords: Record<string, LocationCoord> = {
  // Japan
  'tokyo': { x: 86, y: 24, name: 'Tokyo, Japan' },
  'kyoto': { x: 84, y: 26, name: 'Kyoto, Japan' },
  'osaka': { x: 84, y: 27, name: 'Osaka, Japan' },
  'hiroshima': { x: 82, y: 28, name: 'Hiroshima, Japan' },
  'fukuoka': { x: 81, y: 29, name: 'Fukuoka, Japan' },
  'sapporo': { x: 87, y: 19, name: 'Sapporo, Japan' },
  'nara': { x: 84, y: 27, name: 'Nara, Japan' },
  'hakone': { x: 85, y: 25, name: 'Hakone, Japan' },

  // USA
  'new york': { x: 19, y: 30, name: 'New York, USA' },
  'los angeles': { x: 9, y: 36, name: 'Los Angeles, USA' },
  'san francisco': { x: 8, y: 33, name: 'San Francisco, USA' },
  'las vegas': { x: 10, y: 35, name: 'Las Vegas, USA' },
  'miami': { x: 17, y: 42, name: 'Miami, USA' },
  'chicago': { x: 16, y: 30, name: 'Chicago, USA' },
  'seattle': { x: 8, y: 25, name: 'Seattle, USA' },
  'hawaii': { x: 3, y: 48, name: 'Hawaii, USA' },
  'honolulu': { x: 3, y: 48, name: 'Honolulu, Hawaii' },

  // Europe
  'london': { x: 43, y: 15, name: 'London, UK' },
  'paris': { x: 45, y: 18, name: 'Paris, France' },
  'rome': { x: 51, y: 22, name: 'Rome, Italy' },
  'barcelona': { x: 45, y: 22, name: 'Barcelona, Spain' },
  'amsterdam': { x: 47, y: 14, name: 'Amsterdam, Netherlands' },
  'berlin': { x: 51, y: 14, name: 'Berlin, Germany' },
  'munich': { x: 50, y: 17, name: 'Munich, Germany' },
  'vienna': { x: 53, y: 17, name: 'Vienna, Austria' },
  'prague': { x: 52, y: 15, name: 'Prague, Czech Republic' },
  'zurich': { x: 48, y: 18, name: 'Zurich, Switzerland' },
  'switzerland': { x: 48, y: 18, name: 'Switzerland' },
  'venice': { x: 51, y: 19, name: 'Venice, Italy' },
  'florence': { x: 50, y: 20, name: 'Florence, Italy' },
  'madrid': { x: 43, y: 22, name: 'Madrid, Spain' },
  'lisbon': { x: 41, y: 24, name: 'Lisbon, Portugal' },
  'athens': { x: 55, y: 26, name: 'Athens, Greece' },
  'santorini': { x: 56, y: 27, name: 'Santorini, Greece' },
  'iceland': { x: 40, y: 9, name: 'Iceland' },
  'reykjavik': { x: 40, y: 9, name: 'Reykjavik, Iceland' },

  // Asia
  'beijing': { x: 78, y: 22, name: 'Beijing, China' },
  'shanghai': { x: 80, y: 28, name: 'Shanghai, China' },
  'hong kong': { x: 78, y: 36, name: 'Hong Kong' },
  'seoul': { x: 82, y: 24, name: 'Seoul, South Korea' },
  'bangkok': { x: 74, y: 46, name: 'Bangkok, Thailand' },
  'singapore': { x: 75, y: 56, name: 'Singapore' },
  'bali': { x: 79, y: 62, name: 'Bali, Indonesia' },
  'vietnam': { x: 76, y: 44, name: 'Vietnam' },
  'hanoi': { x: 76, y: 40, name: 'Hanoi, Vietnam' },
  'ho chi minh': { x: 76, y: 48, name: 'Ho Chi Minh City, Vietnam' },
  'taipei': { x: 81, y: 42, name: 'Taipei, Taiwan' },
  'manila': { x: 82, y: 50, name: 'Manila, Philippines' },
  'kuala lumpur': { x: 74, y: 54, name: 'Kuala Lumpur, Malaysia' },
  'mumbai': { x: 66, y: 44, name: 'Mumbai, India' },
  'delhi': { x: 67, y: 38, name: 'Delhi, India' },
  'dubai': { x: 60, y: 40, name: 'Dubai, UAE' },

  // Oceania
  'sydney': { x: 89, y: 82, name: 'Sydney, Australia' },
  'melbourne': { x: 87, y: 86, name: 'Melbourne, Australia' },
  'auckland': { x: 96, y: 86, name: 'Auckland, New Zealand' },
  'queenstown': { x: 95, y: 92, name: 'Queenstown, New Zealand' },

  // South America
  'rio de janeiro': { x: 30, y: 68, name: 'Rio de Janeiro, Brazil' },
  'buenos aires': { x: 27, y: 80, name: 'Buenos Aires, Argentina' },
  'lima': { x: 21, y: 62, name: 'Lima, Peru' },
  'machu picchu': { x: 22, y: 62, name: 'Machu Picchu, Peru' },
  'bogota': { x: 20, y: 54, name: 'Bogota, Colombia' },
  'santiago': { x: 24, y: 78, name: 'Santiago, Chile' },

  // Africa
  'cairo': { x: 56, y: 38, name: 'Cairo, Egypt' },
  'cape town': { x: 52, y: 78, name: 'Cape Town, South Africa' },
  'marrakech': { x: 44, y: 36, name: 'Marrakech, Morocco' },
  'nairobi': { x: 58, y: 56, name: 'Nairobi, Kenya' },
  'johannesburg': { x: 55, y: 72, name: 'Johannesburg, South Africa' },

  // Canada
  'toronto': { x: 17, y: 26, name: 'Toronto, Canada' },
  'vancouver': { x: 8, y: 22, name: 'Vancouver, Canada' },
  'montreal': { x: 19, y: 24, name: 'Montreal, Canada' },

  // Mexico & Central America
  'cancun': { x: 16, y: 44, name: 'Cancun, Mexico' },
  'mexico city': { x: 13, y: 44, name: 'Mexico City, Mexico' },

  // Caribbean
  'jamaica': { x: 18, y: 46, name: 'Jamaica' },
  'cuba': { x: 17, y: 44, name: 'Cuba' },

  // Default
  'default': { x: 50, y: 50, name: 'Unknown Location' }
};

export const avatars = [
  '👧', '👦', '👨', '👩', '🧑', '🐧', '🐱', '🐵', '🦄', '🐝'
];

export function getLocationCoords(location: string): LocationCoord {
  const key = location.toLowerCase().trim();
  return locationCoords[key] || { ...locationCoords['default'], name: location };
}
