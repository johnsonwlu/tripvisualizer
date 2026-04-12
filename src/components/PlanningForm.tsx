'use client';

import { useState, useEffect } from 'react';
import { Traveler, TripDay } from '@/types';
import { avatars } from '@/data/locations';
import styles from '@/styles/trip.module.css';

interface PlanningFormProps {
  initialTravelers: Traveler[];
  initialDays: TripDay[];
  onStart: (travelers: Traveler[], days: TripDay[]) => void;
}

export default function PlanningForm({ initialTravelers, initialDays, onStart }: PlanningFormProps) {
  const [numTravelers, setNumTravelers] = useState(initialTravelers.length || 2);
  const [numDays, setNumDays] = useState(initialDays.length || 3);
  const [travelers, setTravelers] = useState<Traveler[]>(initialTravelers);
  const [days, setDays] = useState<TripDay[]>(initialDays);

  // Initialize travelers when count changes
  useEffect(() => {
    setTravelers(prev => {
      const newTravelers: Traveler[] = [];
      for (let i = 0; i < numTravelers; i++) {
        newTravelers.push(prev[i] || {
          name: '',
          avatar: avatars[i % avatars.length],
          photo: ''
        });
      }
      return newTravelers;
    });
  }, [numTravelers]);

  // Initialize days when count changes
  useEffect(() => {
    setDays(prev => {
      const newDays: TripDay[] = [];
      for (let i = 0; i < numDays; i++) {
        newDays.push(prev[i] || {
          day: i + 1,
          async: false,
          location: '',
          travelerLocations: Array(numTravelers).fill('')
        });
      }
      return newDays;
    });
  }, [numDays, numTravelers]);

  const handlePhotoUpload = (index: number, file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('Image too large! Please choose an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setTravelers(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], photo: base64 };
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTravelerNameChange = (index: number, name: string) => {
    setTravelers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], name };
      return updated;
    });
  };

  const handleDayLocationChange = (dayIndex: number, location: string) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], location };
      return updated;
    });
  };

  const handleAsyncToggle = (dayIndex: number, isAsync: boolean) => {
    setDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = { ...updated[dayIndex], async: isAsync };
      if (isAsync && !updated[dayIndex].travelerLocations?.length) {
        updated[dayIndex].travelerLocations = travelers.map(() => updated[dayIndex].location);
      }
      return updated;
    });
  };

  const handleTravelerLocationChange = (dayIndex: number, travelerIndex: number, location: string) => {
    setDays(prev => {
      const updated = [...prev];
      const travelerLocations = [...(updated[dayIndex].travelerLocations || [])];
      travelerLocations[travelerIndex] = location;
      updated[dayIndex] = { ...updated[dayIndex], travelerLocations };
      return updated;
    });
  };

  const handleStart = () => {
    const finalTravelers = travelers.map((t, i) => ({
      ...t,
      name: t.name || `Traveler ${i + 1}`
    }));

    const finalDays = days.map((d, i) => ({
      ...d,
      day: i + 1,
      location: d.location || 'Unknown Location',
      travelerLocations: d.async
        ? d.travelerLocations?.map(loc => loc || 'Unknown Location') || []
        : finalTravelers.map(() => d.location || 'Unknown Location')
    }));

    onStart(finalTravelers, finalDays);
  };

  return (
    <div>
      {/* Who's Going */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Who&apos;s Going?</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Travelers</label>
          <input
            type="number"
            className={styles.input}
            min="1"
            max="10"
            value={numTravelers}
            onChange={(e) => setNumTravelers(parseInt(e.target.value) || 1)}
          />
        </div>

        <div className={styles.travelersList}>
          {travelers.map((traveler, index) => (
            <div key={index} className={styles.travelerInput}>
              <div className={styles.profileUpload}>
                <div
                  className={styles.profilePreview}
                  onClick={() => document.getElementById(`photo-${index}`)?.click()}
                >
                  {traveler.photo ? (
                    <img src={traveler.photo} alt="Profile" />
                  ) : (
                    <span className={styles.placeholderText}>Click to add photo</span>
                  )}
                </div>
                <input
                  type="file"
                  id={`photo-${index}`}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(index, e.target.files[0])}
                />
                <span className={styles.uploadHint}>Click circle to upload photo</span>
              </div>
              <input
                type="text"
                className={styles.input}
                placeholder={`Traveler ${index + 1}'s name`}
                value={traveler.name}
                onChange={(e) => handleTravelerNameChange(index, e.target.value)}
                style={{ marginTop: '10px' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Trip Duration */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Trip Duration</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>Number of Days</label>
          <input
            type="number"
            className={styles.input}
            min="1"
            max="30"
            value={numDays}
            onChange={(e) => setNumDays(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      {/* Daily Locations */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Daily Locations</h2>

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className={styles.daySchedule}>
            <div className={styles.dayScheduleHeader}>
              <h3 className={styles.dayScheduleTitle}>Day {dayIndex + 1}</h3>
              <label className={styles.asyncToggle}>
                <input
                  type="checkbox"
                  checked={day.async}
                  onChange={(e) => handleAsyncToggle(dayIndex, e.target.checked)}
                />
                Different locations
              </label>
            </div>

            {!day.async ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Everyone&apos;s Location</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g., Tokyo, Paris, New York..."
                  value={day.location}
                  onChange={(e) => handleDayLocationChange(dayIndex, e.target.value)}
                />
              </div>
            ) : (
              <div className={styles.travelerLocations}>
                {travelers.map((traveler, travelerIndex) => (
                  <div key={travelerIndex} className={styles.travelerLocationRow}>
                    <div className={styles.travelerAvatarSmall}>
                      {traveler.photo ? (
                        <img src={traveler.photo} alt={traveler.name} />
                      ) : (
                        traveler.avatar
                      )}
                    </div>
                    <span className={styles.travelerNameLabel}>
                      {traveler.name || `Traveler ${travelerIndex + 1}`}
                    </span>
                    <input
                      type="text"
                      className={styles.travelerLocationInput}
                      placeholder="e.g., Tokyo, Paris..."
                      value={day.travelerLocations?.[travelerIndex] || ''}
                      onChange={(e) => handleTravelerLocationChange(dayIndex, travelerIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.centerButtons}>
        <button className={styles.btn} onClick={handleStart}>
          Start Adventure!
        </button>
      </div>
    </div>
  );
}
