import React from "react";

const Card = ({ location, magnitude, time, depth, status, onClick }) => (
  <div
    className="bg-white p-4 shadow-md rounded-lg cursor-pointer"
    onClick={onClick}
  >
    <p className="text-lg font-semibold">
      <strong>Location:</strong> {location}
    </p>
    <p className="text-gray-600">
      <strong>Magnitude:</strong> {magnitude}
    </p>
    <p className="text-gray-600">
      <strong>Time:</strong>{" "}
      {new Date(time)
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace("am", "AM")
        .replace("pm", "PM")}
    </p>

    <p className="text-gray-600">
      <strong>Depth:</strong> {depth} km
    </p>
    <p className="text-gray-600">
      <strong>Status:</strong> {status}
    </p>
  </div>
);

export default Card;