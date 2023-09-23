// src/components/ActorList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ActorList() {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/home/')
      .then(response => {
        setActors(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Actor List</h1>
      <ul>
        {actors.map(actor => (
          <ol key={actor.actor_id}>
            {actor.first_name} {actor.last_name}
          </ol>
        ))}
      </ul>
    </div>
  );
}

export default ActorList;
