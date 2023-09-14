import React, { useEffect, useState } from 'react';

function HealthCheck() {
  const [health, setHealth] = useState('');

  useEffect(() => {
    fetch('/api/health').then((response) => response.text()).then((data) => setHealth(data));
  }, []);

  return (
    <div>
      <h1>Health Check</h1>
      <p>{health}</p>
    </div>
  );
}
export default HealthCheck;
