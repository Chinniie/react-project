import { useState, useEffect } from "react";
import FetchEarthquakes from "./component/FetchEarthquakes";
import "leaflet/dist/leaflet.css";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App min-h-screen bg-gray-100"> 
      <h1 className="text-3xl font-bold text-center p-4">!!Latest Earthquakes Report!!</h1>
      <h2 className="text-2xl font-bold text-center p-4 text-red-500">Important !!" date and time may be different according to the time zone."</h2>
      <h2 className="text-2xl font-bold text-center p-4 text-red-500">สำคัญ !!" วันที่และเวลาอาจแตกต่างกันไปตามเขตเวลา"</h2>
      <p className="text-center text-gray-600 mb-4">Current Time: {currentTime}</p>

      <div className="text-center mb-6">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Country or Province"
          className="border border-gray-400 rounded p-2 mr-2 w-80"
        />
      </div>

      <div className="text-center mb-5">
        <p className="text-center xl">Select date</p>
        <input 
          type="date" 
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-gray-400 rounded p-2 mr-2 w-23"
        />
      </div>

      <FetchEarthquakes searchTerm={searchTerm} searchDate={searchDate} />
    </div>
  );
}

export default App;
