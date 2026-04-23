'use client';

import { useState, useEffect, useCallback } from 'react';
import { TripData, Traveler, TripDay, Flight } from '@/types';
import { avatars } from '@/data/locations';
import PlanningForm from './PlanningForm';
import WorldMap from './WorldMap';
import TransitionScreen from './TransitionScreen';
import styles from '@/styles/trip.module.css';

const STORAGE_KEY = 'tripData';

export default function TripPlanner() {
  const [tripData, setTripData] = useState<TripData>({
    travelers: [],
    days: [],
    currentDay: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlanning, setShowPlanning] = useState(true);
  const [showTransition, setShowTransition] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTripData(parsed);
        if (parsed.travelers.length > 0 && parsed.days.length > 0) {
          setShowPlanning(false);
        }
      } catch (e) {
        console.error('Failed to parse saved trip data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded && tripData.travelers.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tripData));
    }
  }, [tripData, isLoaded]);

  const handleStart = (travelers: Traveler[], days: TripDay[]) => {
    setTripData({
      travelers,
      days,
      currentDay: 0
    });
    setShowPlanning(false);
  };

  const goToDay = useCallback((dayIndex: number) => {
    if (tripData.days.length === 0) return;

    const prevDay = tripData.days[tripData.currentDay];
    const newDay = tripData.days[dayIndex];

    if (!prevDay || !newDay) return;

    // Group travelers by route
    const flightMap: Record<string, Flight> = {};

    tripData.travelers.forEach((traveler, i) => {
      const prevLoc = prevDay.travelerLocations?.[i] || prevDay.location;
      const newLoc = newDay.travelerLocations?.[i] || newDay.location;

      if (prevLoc.toLowerCase() !== newLoc.toLowerCase()) {
        const routeKey = `${prevLoc}|${newLoc}`;
        if (!flightMap[routeKey]) {
          flightMap[routeKey] = {
            from: prevLoc,
            to: newLoc,
            passengers: []
          };
        }
        flightMap[routeKey].passengers.push(traveler);
      }
    });

    const flightsList = Object.values(flightMap);

    if (dayIndex !== tripData.currentDay && flightsList.length > 0) {
      setFlights(flightsList);
      setShowTransition(true);

      setTimeout(() => {
        setShowTransition(false);
        setFlights([]);
        setTripData(prev => ({ ...prev, currentDay: dayIndex }));
      }, 3500);
    } else {
      setTripData(prev => ({ ...prev, currentDay: dayIndex }));
    }
  }, [tripData]);

  const nextDay = () => {
    if (tripData.currentDay < tripData.days.length - 1) {
      goToDay(tripData.currentDay + 1);
    }
  };

  const previousDay = () => {
    if (tripData.currentDay > 0) {
      goToDay(tripData.currentDay - 1);
    }
  };

  const editTrip = () => {
    setShowPlanning(true);
  };

  const resetTrip = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTripData({ travelers: [], days: [], currentDay: 0 });
    setShowPlanning(true);
  };

  // Generate background stars
  const [bgStars, setBgStars] = useState<Array<{ left: string; top: string; size: number; delay: string }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 2}s`
    }));
    setBgStars(newStars);
  }, []);

  if (!isLoaded) {
    return <div style={{ minHeight: '100vh', background: '#1a1a2e' }} />;
  }

  const currentDay = tripData.days[tripData.currentDay];
  const progress = tripData.days.length > 0
    ? ((tripData.currentDay + 1) / tripData.days.length) * 100
    : 0;

  return (
    <>
      {/* Background stars */}
      <div className={styles.starsBg}>
        {bgStars.map((star, i) => (
          <div
            key={i}
            className={styles.starBg}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay
            }}
          />
        ))}
      </div>

      {/* Transition screen */}
      <TransitionScreen active={showTransition} flights={flights} />

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Adventure Planner!</h1>
          <p className={styles.subtitle}>Plan your epic journey with friends</p>
        </div>

        {showPlanning ? (
          <PlanningForm
            initialTravelers={tripData.travelers}
            initialDays={tripData.days}
            onStart={handleStart}
          />
        ) : (
          <>
            {/* Trip summary card */}
            <div className={`${styles.card} ${styles.cardDark}`}>
              <div className={styles.tripSummary}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryNumber}>{tripData.travelers.length}</div>
                  <div className={styles.summaryLabel}>Travelers</div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryNumber}>{tripData.days.length}</div>
                  <div className={styles.summaryLabel}>Days</div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryNumber}>
                    {new Set(tripData.days.map(d => d.location.toLowerCase())).size}
                  </div>
                  <div className={styles.summaryLabel}>Locations</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: `${progress}%` }} />
              </div>

              {/* Timeline */}
              <div className={styles.timeline}>
                {tripData.days.map((d, i) => {
                  let className = styles.timelineDay + ' ';
                  if (i < tripData.currentDay) className += styles.past;
                  else if (i === tripData.currentDay) className += styles.current;
                  else className += styles.future;

                  return (
                    <div
                      key={i}
                      className={className}
                      onClick={() => goToDay(i)}
                      title={d.location}
                    >
                      {d.day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* World Map */}
            <WorldMap tripData={tripData} />

            {/* Navigation */}
            <div className={styles.navButtons}>
              <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={previousDay}
                disabled={tripData.currentDay === 0}
              >
                ◀ Previous
              </button>
              <button
                className={styles.btn}
                onClick={nextDay}
                disabled={tripData.currentDay === tripData.days.length - 1}
              >
                Next ▶
              </button>
            </div>

            {/* Edit/Save buttons */}
            <div className={styles.centerButtons}>
              <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={editTrip}>
                Edit Trip
              </button>
              <button className={styles.btn} onClick={resetTrip}>
                Reset Trip
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
