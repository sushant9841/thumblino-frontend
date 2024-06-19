import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState(1920); // Default width
  const [height, setHeight] = useState(1080); // Default height
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [quality, setQuality] = useState(80); // Default quality

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/get/width/${width}/height/${height}/quality/${quality}/${encodeURIComponent(
          url
        )}`
      );
      const data = await response.json();
      setImageData(data.imageUrl);
    } catch (error) {
      console.error("Error fetching image:", error);
    } finally {
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
          <button type="submit" disabled={loading}>
            Capture
          </button>
        </form>
        {loading && <div className="loader">Loading...</div>}
        {imageData && (
          <img
            src={imageData}
            alt="Screenshot"
            style={{ maxWidth: "100%", height: "auto" }} // Ensure image responsiveness
            loading="lazy" // Lazy loading for better performance
          />
        )}
      </header>
    </div>
  );
}

export default App;
