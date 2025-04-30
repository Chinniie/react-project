import React, { useState, useEffect } from "react";
import Card from "./Card";

export default function CardGrid() {
  const [earthquakes, setEarthquakes] = useState([]);
  const URL ="https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2025-04-01&endtime=2025-04-25&minmagnitude=5";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setEarthquakes(data.features.slice(0, 10));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {earthquakes.length > 0 ? (
        earthquakes.map((quake, index) => (
          <Card
            key={index}
            location={quake.properties.place}
            magnitude={quake.properties.mag}
            time={new Date(quake.properties.time).toLocaleString()}
          />
        ))
      ) : (
        <p>Loading earthquake data...</p>
      )}
    </div>
  );
}