import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("google.com"); // Default URL input
  const [width, setWidth] = useState(1920); // Default width
  const [height, setHeight] = useState(1080); // Default height
  const [quality, setQuality] = useState(80); // Default quality
  const [scale, setScale] = useState(1); // Default scale factor
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [fetchTime, setFetchTime] = useState(null); // State to store fetch time

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFetchTime(null);

    const startTime = performance.now(); // Start timer

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/get/width/${width}/height/${height}/quality/${quality}/scale/${scale}/${encodeURIComponent(
          url
        )}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setImageData(data.imageUrl);
      } else {
        const textData = await response.text();
        console.error("Non-JSON response:", textData);
        throw new Error("Received non-JSON response");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
      const endTime = performance.now(); // End timer
      setFetchTime((endTime - startTime).toFixed(2)); // Calculate and set fetch time
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            placeholder="Viewport Width"
            required
          />
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            placeholder="Viewport Height (0 for full)"
            required
          />
          <input
            type="number"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            placeholder="JPEG Quality (1-100)"
            required
          />
          <input
            type="number"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            placeholder="Device Scale Factor (1-3)"
            required
          />
          <button type="submit" disabled={loading}>
            Capture
          </button>
        </form>
        {loading && <div className="loader">Loading...</div>}
        {fetchTime && <div>Fetch time: {fetchTime} ms</div>}
        {imageData && (
          <img
            src={imageData}
            alt="Screenshot"
            style={{ maxWidth: "100%", height: "auto" }}
            loading="lazy"
          />
        )}
      </header>
    </div>
  );
}

export default App;
