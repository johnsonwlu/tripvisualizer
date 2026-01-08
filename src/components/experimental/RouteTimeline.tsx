// WIP — roughing out a timeline view for the route, not wired up yet

import React from 'react';

interface TimelineStop {
  city: string;
  days: number;
  highlights: string[];
}

interface RouteTimelineProps {
  stops: TimelineStop[];
}

// TODO: style this properly
const RouteTimeline: React.FC<RouteTimelineProps> = ({ stops }) => {
  return (
    <div className="route-timeline">
      {stops.map((stop, i) => (
        <div key={i} className="stop">
          <h3>{stop.city}</h3>
          <span>{stop.days} days</span>
          <ul>
            {stop.highlights.map((h, j) => (
              <li key={j}>{h}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RouteTimeline;
