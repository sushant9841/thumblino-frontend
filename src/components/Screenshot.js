import React, { useEffect, useState } from "react";
import socket from "../socket";

const Screenshot = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on("screenshot", (data) => {
      setImage(`data:image/gif;base64,${data}`);
      setLoading(false);
    });

    return () => {
      socket.off("screenshot");
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div className="spinner">Loading...</div>
      ) : (
        <img src={image} alt="Screenshot" />
      )}
    </div>
  );
};

export default Screenshot;
