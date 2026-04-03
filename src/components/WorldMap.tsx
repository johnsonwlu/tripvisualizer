'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { TripData, Traveler } from '@/types';
import { getLocationCoords } from '@/data/locations';
import styles from '@/styles/worldMap.module.css';

interface WorldMapProps {
  tripData: TripData;
}

interface LocationGroup {
  location: string;
  travelers: Traveler[];
}

export default function WorldMap({ tripData }: WorldMapProps) {
  const [currentZoom, setCurrentZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const minZoom = 0.4;
  const maxZoom = 2.5;
  const zoomStep = 0.15;

  const day = tripData.days[tripData.currentDay];

  // Group travelers by location
  const locationGroups: Record<string, LocationGroup> = {};

  if (day) {
    tripData.travelers.forEach((traveler, index) => {
      const location = day.travelerLocations?.[index] || day.location;
      const locationKey = location.toLowerCase().trim();

      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = {
          location: location,
          travelers: []
        };
      }
      locationGroups[locationKey].travelers.push(traveler);
    });
  }

  const locationKeys = Object.keys(locationGroups);
  const isAsync = locationKeys.length > 1;

  // Get display name
  const displayLocation = isAsync
    ? locationKeys.map(key => getLocationCoords(locationGroups[key].location).name).join(' & ')
    : day ? getLocationCoords(day.location).name : '';

  // Calculate globe effect
  const globeAmount = Math.max(0, 1 - (currentZoom - minZoom) / (1 - minZoom));
  const rotateX = globeAmount * 15;
  const borderRadius = globeAmount * 50;

  const zoomIn = () => setCurrentZoom(z => Math.min(maxZoom, z + zoomStep));
  const zoomOut = () => setCurrentZoom(z => Math.max(minZoom, z - zoomStep));

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setCurrentZoom(z => Math.min(maxZoom, z + zoomStep));
    } else {
      setCurrentZoom(z => Math.max(minZoom, z - zoomStep));
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Generate space stars
  const [stars, setStars] = useState<Array<{ left: string; top: string; size: number; opacity: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 150 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }));
    setStars(newStars);
  }, []);

  // Get flight paths
  const getFlightPaths = () => {
    if (tripData.currentDay === 0 || !tripData.days[tripData.currentDay - 1]) return [];

    const prevDay = tripData.days[tripData.currentDay - 1];
    const currentDay = tripData.days[tripData.currentDay];
    const drawnPaths = new Set<string>();
    const paths: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    tripData.travelers.forEach((_, index) => {
      const prevLocation = prevDay.travelerLocations?.[index] || prevDay.location;
      const currLocation = currentDay.travelerLocations?.[index] || currentDay.location;

      const prevCoords = getLocationCoords(prevLocation);
      const currCoords = getLocationCoords(currLocation);

      const pathKey = `${prevCoords.x},${prevCoords.y}-${currCoords.x},${currCoords.y}`;

      if (prevCoords.x !== currCoords.x || prevCoords.y !== currCoords.y) {
        if (!drawnPaths.has(pathKey)) {
          drawnPaths.add(pathKey);
          paths.push({ x1: prevCoords.x, y1: prevCoords.y, x2: currCoords.x, y2: currCoords.y });
        }
      }
    });

    return paths;
  };

  const flightPaths = getFlightPaths();

  if (!day) return null;

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      style={{ perspective: `${1000 - globeAmount * 500}px` }}
    >
      {/* Space stars */}
      <div className={`${styles.spaceStars} ${currentZoom < 0.7 ? styles.visible : ''}`}>
        {stars.map((star, i) => (
          <div
            key={i}
            className={styles.spaceStar}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity
            }}
          />
        ))}
      </div>

      {/* Map wrapper */}
      <div
        className={styles.mapWrapper}
        style={{ transform: `scale(${currentZoom})` }}
      >
        <div
          className={styles.worldMap}
          style={{
            transform: `rotateX(${rotateX}deg)`,
            borderRadius: `${borderRadius}%`,
            overflow: borderRadius > 20 ? 'hidden' : 'visible'
          }}
        >
          {/* SVG World Map */}
          <svg viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="oceanGradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" style={{ stopColor: '#1a3a5c' }} />
                <stop offset="100%" style={{ stopColor: '#0c1929' }} />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="2000" height="1000" fill="url(#oceanGradient)" />

            <g filter="url(#glow)">
              {/* North America */}
              <path className={styles.continent} d="M130,120 L180,100 L240,95 L300,100 L350,120 L380,150 L400,200 L420,250 L400,300 L350,340 L300,360 L280,400 L260,380 L240,340 L200,320 L160,340 L140,380 L120,360 L100,300 L80,250 L60,200 L80,160 L100,140 Z" />
              <path className={styles.continent} d="M380,60 L420,50 L470,55 L500,80 L490,120 L450,140 L400,130 L370,100 Z" />
              <path className={styles.continent} d="M200,400 L230,410 L250,440 L240,470 L220,490 L200,480 L180,450 L190,420 Z" />

              {/* South America */}
              <path className={styles.continent} d="M280,500 L340,480 L400,500 L420,560 L430,620 L420,700 L380,780 L340,840 L300,860 L270,820 L250,750 L260,680 L250,620 L260,560 Z" />

              {/* Europe */}
              <path className={styles.continent} d="M900,100 L950,90 L1000,100 L1050,120 L1080,150 L1100,200 L1080,240 L1040,260 L1000,250 L960,260 L920,240 L900,200 L880,160 L890,130 Z" />
              <path className={styles.continent} d="M860,140 L880,130 L895,145 L890,170 L870,180 L855,165 Z" />
              <path className={styles.continent} d="M845,150 L855,145 L860,160 L850,170 L840,160 Z" />
              <path className={styles.continent} d="M940,50 L980,40 L1020,50 L1040,80 L1030,120 L1000,140 L970,130 L950,100 L940,70 Z" />
              <path className={styles.continent} d="M780,80 L810,75 L830,90 L820,110 L790,115 L770,100 Z" />

              {/* Africa */}
              <path className={styles.continent} d="M920,280 L980,270 L1040,280 L1100,320 L1140,400 L1150,500 L1130,600 L1080,680 L1020,720 L960,700 L920,640 L900,560 L880,480 L890,400 L900,340 Z" />
              <path className={styles.continent} d="M1160,580 L1180,560 L1195,580 L1190,640 L1170,660 L1155,640 Z" />

              {/* Asia */}
              <path className={styles.continent} d="M1100,100 L1200,80 L1320,70 L1450,80 L1550,120 L1620,180 L1650,260 L1640,340 L1580,380 L1500,360 L1420,380 L1350,400 L1280,380 L1220,340 L1180,280 L1140,220 L1100,180 L1080,140 Z" />
              <path className={styles.continent} d="M1100,280 L1150,300 L1180,340 L1200,400 L1180,440 L1140,460 L1100,440 L1080,400 L1060,340 L1080,300 Z" />
              <path className={styles.continent} d="M1280,380 L1340,400 L1380,460 L1400,540 L1380,600 L1340,620 L1300,600 L1280,540 L1260,460 L1260,420 Z" />
              <path className={styles.continent} d="M1420,420 L1480,400 L1540,420 L1560,480 L1540,540 L1500,560 L1460,540 L1440,500 L1420,460 Z" />

              {/* Japan */}
              <path className={styles.continent} d="M1700,200 L1720,180 L1740,190 L1750,230 L1740,280 L1720,300 L1700,280 L1690,240 Z" />
              <path className={styles.continent} d="M1680,300 L1700,290 L1710,310 L1700,340 L1680,350 L1670,330 Z" />

              {/* Korea */}
              <path className={styles.continent} d="M1640,240 L1660,230 L1675,250 L1670,290 L1650,310 L1635,290 L1635,260 Z" />

              {/* Taiwan */}
              <path className={styles.continent} d="M1620,400 L1635,390 L1645,410 L1635,440 L1620,445 L1610,425 Z" />

              {/* Philippines */}
              <path className={styles.continent} d="M1640,480 L1660,470 L1680,490 L1675,540 L1655,560 L1635,545 L1630,510 Z" />

              {/* Indonesia */}
              <path className={styles.continent} d="M1480,580 L1540,560 L1600,570 L1660,590 L1700,620 L1680,660 L1620,680 L1560,670 L1500,650 L1460,620 L1470,590 Z" />

              {/* Australia */}
              <path className={styles.continent} d="M1580,720 L1680,680 L1780,700 L1850,760 L1860,840 L1820,900 L1740,920 L1660,900 L1600,840 L1570,780 Z" />
              <path className={styles.continent} d="M1720,920 L1745,915 L1755,940 L1740,960 L1715,950 Z" />

              {/* New Zealand */}
              <path className={styles.continent} d="M1900,840 L1920,820 L1940,840 L1935,890 L1915,920 L1895,900 Z" />
              <path className={styles.continent} d="M1920,920 L1940,910 L1955,940 L1945,970 L1925,975 L1915,950 Z" />

              {/* Sri Lanka */}
              <path className={styles.continent} d="M1340,540 L1355,530 L1365,550 L1355,580 L1340,585 L1330,565 Z" />
            </g>

            {/* Grid lines */}
            <g stroke="rgba(78,205,196,0.08)" strokeWidth="1" fill="none">
              <line x1="0" y1="500" x2="2000" y2="500" />
              <line x1="0" y1="380" x2="2000" y2="380" strokeDasharray="10,10" />
              <line x1="0" y1="620" x2="2000" y2="620" strokeDasharray="10,10" />
              <line x1="1000" y1="0" x2="1000" y2="1000" />
            </g>
          </svg>

          {/* Markers */}
          <div
            className={styles.markers}
            style={{ transform: `scale(${1 / currentZoom})` }}
          >
            {/* Flight paths */}
            <svg className={styles.flightPath}>
              {flightPaths.map((path, i) => (
                <line
                  key={i}
                  x1={`${path.x1}%`}
                  y1={`${path.y1}%`}
                  x2={`${path.x2}%`}
                  y2={`${path.y2}%`}
                />
              ))}
            </svg>

            {/* Location markers */}
            {Object.values(locationGroups).map((group, groupIndex) => {
              const coords = getLocationCoords(group.location);
              return (
                <div
                  key={groupIndex}
                  className={styles.locationMarker}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                >
                  <div className={styles.markerPulse} />
                  <div className={styles.markerTravelers}>
                    {group.travelers.map((t, i) => (
                      <div key={i} className={styles.markerAvatar}>
                        {t.photo ? (
                          <img src={t.photo} alt={t.name} />
                        ) : (
                          t.avatar
                        )}
                      </div>
                    ))}
                  </div>
                  <div className={styles.markerLabel}>{coords.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Globe overlay */}
      <div
        className={`${styles.globeOverlay} ${globeAmount > 0.3 ? styles.active : ''}`}
        style={{ opacity: globeAmount }}
      />

      {/* Day info */}
      <div className={styles.dayInfo}>
        <h2 className={styles.dayCounter}>Day {day.day}</h2>
        <p className={styles.locationName}>{displayLocation}</p>
      </div>

      {/* Zoom controls */}
      <div className={styles.zoomControls}>
        <button className={styles.zoomBtn} onClick={zoomIn}>+</button>
        <div className={styles.zoomLevel}>{Math.round(currentZoom * 100)}%</div>
        <button className={styles.zoomBtn} onClick={zoomOut}>−</button>
      </div>
    </div>
  );
}
