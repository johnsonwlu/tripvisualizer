export interface Traveler {
  name: string;
  avatar: string;
  photo: string;
}

export interface TripDay {
  day: number;
  async: boolean;
  location: string;
  travelerLocations: string[];
}

export interface TripData {
  travelers: Traveler[];
  days: TripDay[];
  currentDay: number;
}

export interface LocationCoord {
  x: number;
  y: number;
  name: string;
}

export interface Flight {
  from: string;
  to: string;
  passengers: Traveler[];
}
