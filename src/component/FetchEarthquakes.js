import React, { useState, useEffect } from "react";
import Card from "./Card";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function InvalidateMapSize() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function FetchEarthquakes({ searchTerm ,searchDate }) {
  const [earthquakes, setEarthquakes] = useState([]);
  const [selectedQuake, setSelectedQuake] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const endDate = new Date().toISOString().split("T")[0];
    const URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&minmagnitude=5`;

    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEarthquakes(data.features.slice(1,10000));
      } catch (error) {
        console.error("Error fetching earthquake data:", error);
        setError("Failed to load earthquake data.");
      }
    };

    fetchData();
  }, []);

  // const filteredEarthquakes = earthquakes.filter((quake) =>
  //   quake.properties.place.toLowerCase().includes(searchTerm.toLowerCase())

  const filteredEarthquakes = earthquakes.filter((quake) => {
    const matchesLocation = quake.properties.place.toLowerCase().includes(searchTerm.toLowerCase());
  
    const quakeDate = new Date(quake.properties.time).toISOString().split("T")[0];
    const matchesDate = searchDate ? quakeDate === searchDate : true; // if searchDate is given, filter by it
  
    return matchesLocation && matchesDate;
  });
  // );
  

  return (
    <>
    {useEffect.endDate}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredEarthquakes.length > 0 ? (
          filteredEarthquakes.map((quake, index) => (
            <Card
              key={index}
              location={quake.properties.place}
              magnitude={quake.properties.mag}
              time={new Date(quake.properties.time).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              depth={quake.geometry.coordinates[2] ?? "Unknown"}
              status={quake.properties.status ?? "Unknown"}
              onClick={() => setSelectedQuake(quake)}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>

      {/* Your modal section (selectedQuake) remains exactly as you wrote it */}
      {selectedQuake && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden w-[90%] max-w-3xl shadow-2xl flex relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedQuake(null)}
              className="absolute top-2 right-2 text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Close
            </button>

            {/* Map Section */}
            <div className="w-2/3 h-[400px]">
              <MapContainer
                center={[
                  selectedQuake.geometry.coordinates[1],
                  selectedQuake.geometry.coordinates[0],
                ]}
                zoom={6}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <InvalidateMapSize />
                <TileLayer
                  attribution='© OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    selectedQuake.geometry.coordinates[1],
                    selectedQuake.geometry.coordinates[0],
                  ]}
                  icon={markerIcon}
                >
                  <Popup>MARK</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Details Sidebar */}
<div className="w-1/3 p-4 bg-white flex flex-col justify-start">
  <h3 className="text-lg font-semibold text-gray-900">
    {selectedQuake.properties.place}
  </h3>
  <p className="text-sm text-gray-600 mt-2">
    <strong>Magnitude:</strong> {selectedQuake.properties.mag}
  </p>
  <p className="text-sm text-gray-600">
    <strong>DateTime:</strong>{" "}
    {new Date(selectedQuake.properties.time)
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone:"UTC"
      })
      .replace("am", "AM")
      .replace("pm", "PM")}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Depth:</strong>{" "}
    {selectedQuake.geometry.coordinates[2] ?? "Unknown"} km
  </p>
  <p className="text-sm text-gray-600">
    <strong>Status:</strong> {selectedQuake.properties.status ?? "Unknown"}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Tsunami Warning:</strong>{" "}
    {selectedQuake.properties.tsunami === 1 ? "Yes" : "No"}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Felt Reports:</strong>{" "}
    {selectedQuake.properties.felt ?? "0"}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Azimuthal Gap:</strong>{" "}
    {selectedQuake.properties.gap ?? "Unknown"}°
  </p>
  <p className="text-sm text-gray-600">
    <strong>Alert Level:</strong>{" "}
    {selectedQuake.properties.alert ?? "None"}
  </p>
  <p className="text-sm text-gray-600">
    <strong>Type:</strong>{" "}
    {selectedQuake.properties.type ?? "None"}
  </p>

  {/* 🌎 Google Maps Link */}
  <p className="text-sm text-gray-600">
    <strong>Coordinates:</strong>{""}
    {selectedQuake.geometry.coordinates ? (
      <a
        href={`https://www.google.com/maps?q=${selectedQuake.geometry.coordinates[1]},${selectedQuake.geometry.coordinates[0]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        View on Google Maps
      </a>
    ) : (
      "None"
    )}
  </p>
          <p className="text-sm text-gray-600">
          <strong>Area:</strong>{" "}
            {selectedQuake.geometry.coordinates ? (
              <a
                href={`https://earth.google.com/web/search/${selectedQuake.geometry.coordinates[1]},${selectedQuake.geometry.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline hover:text-green-800"
              >
                View on Google Earth
              </a>
            ) : (
              "No coordinates available"
            )}
          </p>


        {/* 📰 USGS Detail URL */}
        <p className="text-sm text-gray-600">
          <strong>Detail (URL):</strong>{" "}
          {selectedQuake.properties.url ? (
            <a
              href={selectedQuake.properties.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              View More
            </a>
          ) : (
            "None"
          )}
        </p>
      </div>

          </div>
        </div>
        
      )}
    </>
  );
}
