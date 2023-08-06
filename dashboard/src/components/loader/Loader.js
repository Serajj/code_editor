import React, { useState, useEffect } from 'react';
import './loader.css'; // Import the CSS file with the loader styles
import LoaderImage from './LoaderImage';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous operation (e.g., data fetching)
    setTimeout(() => {
      setLoading(false);
    }, 900); // Simulated loading time of 2 seconds
  }, []);

  return (
    <>
      {loading && (
        <div className="loader-container">
          <LoaderImage/>
        </div>
      )}
    </>
  );
};

export default Loader;
