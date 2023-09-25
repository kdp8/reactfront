import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [movieData, setMovieData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actorData, setActorData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actorMovies, setActorMovies] = useState([]);

  const fetchMovieData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/top-rented-movies/');
      const data = response.data;
      setMovieData(data);
      setSelectedMovie(null);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const fetchActorData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/top-actors/');
      const data = response.data;
      setActorData(data);
      setSelectedMovie(null);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching actor data:', error);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const clearData = () => {
    setMovieData([]);
    setActorData([]);
    setActorMovies([]);
  };

  const handleActorClick = async (actorId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/top-actors/${actorId}/top-rented-movies/`);
      const data = response.data;
      setActorMovies(data);
    } catch (error) {
      console.error('Error fetching actor movies:', error);
    }
  };

  return (
    <div>
      <div>
        Buttons:
        <button onClick={() => { fetchMovieData(); clearData(); }}>
          Top 5 Rented Movies
        </button>
        <button onClick={() => { fetchActorData(); clearData(); }}>
          Top 5 Actors by No. of Films
        </button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {selectedMovie ? (
              <>
                <h2>{selectedMovie.title}</h2>
                <p>Release Year: {selectedMovie.release_year}</p>
                <p>Description: {selectedMovie.description}</p>
              </>
            ) : (
              <>
                {movieData.length > 0 && (
                  <>
                    <h2>Top 5 Rented Movies</h2>
                    <ul>
                      {movieData.map((movie, index) => (
                        <li
                          key={movie.film_id}
                          onClick={() => handleMovieClick(movie)}
                          style={{ cursor: 'pointer' }}
                        >
                          {`${index + 1}. ${movie.title}`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {actorData.length > 0 && (
                  <>
                    <h2>Top 5 Actors by No. of Films</h2>
                    <ul>
                      {actorData.map((actor, index) => (
                        <li
                          key={actor.actor_id}
                          onClick={() => handleActorClick(actor.actor_id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {`${index + 1}. ${actor.first_name} ${actor.last_name} (Films: ${actor.film_count})`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {actorMovies.length > 0 && (
                  <>
                    <h2>Top 5 Movies for Selected Actor</h2>
                    <ul>
                      {actorMovies.map((movie, index) => (
                        <li key={movie.film_id}>
                          {`${index + 1}. ${movie.title}`}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            <button onClick={handleModalClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
