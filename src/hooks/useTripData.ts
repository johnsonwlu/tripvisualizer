'use client';

import { useState, useEffect, useCallback } from 'react';
import { TripData, Traveler, TripDay } from '@/types';
import { avatars } from '@/data/locations';

const STORAGE_KEY = 'tripData';
const LAST_VISIT_KEY = 'lastVisitDay';

const initialTripData: TripData = {
  travelers: [],
  days: [],
  currentDay: 0
};

export function useTripData() {
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionData, setTransitionData] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTripData(parsed);
      } catch (e) {
        console.error('Failed to parse saved trip data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (isLoaded && tripData.travelers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tripData));
      localStorage.setItem(LAST_VISIT_KEY, new Date().toDateString());
    }
  }, [tripData, isLoaded]);

  const updateTravelers = useCallback((travelers: Traveler[]) => {
    setTripData(prev => ({ ...prev, travelers }));
  }, []);

  const updateDays = useCallback((days: TripDay[]) => {
    setTripData(prev => ({ ...prev, days }));
  }, []);

  const setCurrentDay = useCallback((day: number) => {
    setTripData(prev => ({ ...prev, currentDay: day }));
  }, []);

  const goToDay = useCallback((dayIndex: number) => {
    if (tripData.days.length === 0) return;

    const prevDay = tripData.days[tripData.currentDay];
    const newDay = tripData.days[dayIndex];

    if (!prevDay || !newDay) return;

    // Check if any traveler is changing location
    let hasLocationChange = false;
    tripData.travelers.forEach((_, i) => {
      const prevLoc = prevDay.travelerLocations?.[i] || prevDay.location;
      const newLoc = newDay.travelerLocations?.[i] || newDay.location;
      if (prevLoc.toLowerCase() !== newLoc.toLowerCase()) {
        hasLocationChange = true;
      }
    });

    if (dayIndex !== tripData.currentDay && hasLocationChange) {
      // Show transition
      const prevLoc = prevDay.location;
      const newLoc = newDay.location;
      setTransitionData({ from: prevLoc, to: newLoc });
      setShowTransition(true);

      setTimeout(() => {
        setShowTransition(false);
        setTransitionData(null);
        setCurrentDay(dayIndex);
      }, 3500);
    } else {
      setCurrentDay(dayIndex);
    }
  }, [tripData, setCurrentDay]);

  const nextDay = useCallback(() => {
    if (tripData.currentDay < tripData.days.length - 1) {
      goToDay(tripData.currentDay + 1);
    }
  }, [tripData.currentDay, tripData.days.length, goToDay]);

  const previousDay = useCallback(() => {
    if (tripData.currentDay > 0) {
      goToDay(tripData.currentDay - 1);
    }
  }, [tripData.currentDay, goToDay]);

  const resetTrip = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_VISIT_KEY);
    setTripData(initialTripData);
  }, []);

  const createTraveler = useCallback((index: number, name?: string, photo?: string): Traveler => {
    return {
      name: name || `Traveler ${index + 1}`,
      avatar: avatars[index % avatars.length],
      photo: photo || ''
    };
  }, []);

  return {
    tripData,
    isLoaded,
    showTransition,
    transitionData,
    setTripData,
    updateTravelers,
    updateDays,
    setCurrentDay,
    goToDay,
    nextDay,
    previousDay,
    resetTrip,
    createTraveler
  };
}
