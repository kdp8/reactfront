import React, { useState } from 'react';

function Movies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/film-search/?search=${searchQuery}`);
      const data = await response.json();
      setMovies(data);
      setSearched(true);
    } catch (error) {
      console.error('Error searching for movies:', error);
    }
  };

  return (
    <div>
      <h1>Movie Search</h1>
      <input
        type="text"
        placeholder="Search for a movie, actor, or genre..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {searched && movies.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li key={movie.film_id}>
              {movie.title} - {movie.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Movies;
