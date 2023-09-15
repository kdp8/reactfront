import React, { useState, useEffect } from 'react';

function HelloWorld() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hello/') 
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Response from Django: {message}</p>
    </div>
  );
}

export default HelloWorld;