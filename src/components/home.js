import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [movieData, setMovieData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMovieData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/top-rented-movies/');
      const data = response.data;
      setMovieData(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div>
        Buttons:
        <button onClick={fetchMovieData}>
          Top 5 Rented Movies
        </button>
        <button>
          Top 5 Actors by No. of Films
        </button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Top 5 Rented Movies</h2>
            <button onClick={handleModalClose}>OK</button>
            <ul>
              {movieData.map((movie, index) => (
                <ol>{`${index + 1}. ${movie.title}`}</ol>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
