import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "c5cfe913";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Box({ itemList, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {children}
      {isOpen && <ul className="list">{itemList}</ul>}
    </div>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchStatistics({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function SearchBar({ query, setQueryF }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQueryF(e.target.value)}
    />
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelecteMovie(movie) {
    setSelectedId((selectedId) =>
      movie.imdbID === selectedId ? null : movie.imdbID
    );
  }

  function handleAddMovieToWatched(movie) {
    handleSelecteMovie(movie);
    if (
      !watched.reduce(
        (acc, m) => (m.imdbID === movie.imdbID ? true : acc),
        false
      )
    )
      setWatched((watched) => [...watched, movie]);
    console.log(movie);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        setIsLoading(true);
        setMovies([]);
        setError(null);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok) {
            console.log(res);
            throw new Error("Something went wrong while fetching movies");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovies(data.Search ?? []);
        } catch (err) {
          console.log(err);
          setError(err.message);
        }
        setIsLoading(false);
      }
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQueryF={setQuery} />
        <SearchStatistics movies={movies} />
      </NavBar>
      <Main>
        <Box
          itemList={
            <>
              {isLoading && <Loader />}
              {error && <ErrorMessage message={error} />}
              {!isLoading &&
                !error &&
                movies?.map((movie) => (
                  <MovieReleaseCard
                    key={movie.imdbID}
                    movie={movie}
                    handleAddMovieToWatchedF={handleAddMovieToWatched}
                  />
                ))}
            </>
          }
        />
        {selectedId ? (
          <SelectedMovie selectedId={selectedId} />
        ) : (
          <Box
            itemList={watched.map((movie) => (
              <MoviewReviewCard key={movie.imdbID} movie={movie} />
            ))}
          >
            <WatchedSummary watched={watched} />
          </Box>
        )}
      </Main>
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function SelectedMovie({ selectedId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [movie, setMovie] = useState(null);
  useEffect(
    function () {
      async function fetchMovie() {
        setIsLoading(true);
        setErrorLoading(false);
        try {
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) {
            console.log(res);
            throw new Error("Something went wrong while fetching movies");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovie(data);
          console.log(data);
        } catch (err) {
          console.log(err);
          setErrorLoading(true);
        }
        setIsLoading(false);
      }
      fetchMovie();
    },
    [selectedId]
  );

  return (
    <Box>
      {isLoading ? (
        <p>...</p>
      ) : (
        movie &&
        !errorLoading && (
          <div className="details">
            <div className="header">
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <div className="details-overview">
                <h2>{movie.Title}</h2>
                <p>
                  <span>🗓</span>
                  <span>{movie.Year}</span>
                </p>
              </div>
            </div>
          </div>
        )
      )}
    </Box>
  );
}

function MovieReleaseCard({ movie, handleAddMovieToWatchedF }) {
  return (
    <li onClick={() => handleAddMovieToWatchedF(movie)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MoviewReviewCard({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
