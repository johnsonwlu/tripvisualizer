'use client';

import { useEffect, useState } from 'react';
import { Flight } from '@/types';
import styles from '@/styles/transition.module.css';

interface TransitionScreenProps {
  active: boolean;
  flights: Flight[];
}

export default function TransitionScreen({ active, flights }: TransitionScreenProps) {
  const [stars, setStars] = useState<Array<{ left: string; top: string; size: number; delay: string }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: `${Math.random() * 2}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <div className={`${styles.transitionScreen} ${active ? styles.active : ''}`}>
      <div className={styles.stars}>
        {stars.map((star, i) => (
          <div
            key={i}
            className={styles.star}
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

      <div className={styles.flightsContainer}>
        {flights.map((flight, index) => (
          <div key={index} className={styles.flightRow}>
            <div className={styles.planeWithPassengers}>
              <div className={styles.planePassengers}>
                {flight.passengers.map((p, i) => (
                  <div key={i} className={styles.planePassenger}>
                    {p.photo ? (
                      <img src={p.photo} alt={p.name} />
                    ) : (
                      p.avatar
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.airplane}>✈</div>
            </div>
            <div className={styles.flightRoute}>{flight.from} → {flight.to}</div>
          </div>
        ))}
      </div>

      <div className={styles.transitionText}>Traveling to your next adventure!</div>
    </div>
  );
}
