import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useFetch } from "./useFetch";
import { useLocalStorageState } from "./useLocalStorageState";

import { useKey } from "./useKey";

const KEY = "c5cfe913";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Box({ truncatedChildren, children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {children}
      {isOpen && truncatedChildren}
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
  const refEl = useRef(null);

  function callback(e) {
    if (document.activeElement !== refEl.current && e.code === "Enter") {
      refEl.current.focus();
      setQueryF("");
    }
  }
  useKey("Enter", "keydown", callback, [setQueryF]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQueryF(e.target.value)}
      ref={refEl}
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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIdSelfRating, setSelectedIdSelfRating] = useState(null);
  const { isLoading, errorLoading, database } = useFetch(
    `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
  );
  const movies = database;
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelecteMovie(movie) {
    setSelectedIdSelfRating(
      watched.reduce(
        (acc, m) => (m.imdbID === movie.imdbID ? m.userRating : acc),
        null
      )
    );
    setSelectedId((selectedId) =>
      movie.imdbID === selectedId ? null : movie.imdbID
    );
  }

  function handleAddMovieToWatched(movie) {
    if (
      !watched.reduce(
        (acc, m) => (m.imdbID === movie.imdbID ? true : acc),
        false
      )
    ) {
      setWatched((watched) => [...watched, movie]);
    } else {
      setWatched((watched) =>
        movie.userRating
          ? watched.map((m) =>
              m.imdbID === movie.imdbID
                ? { ...m, userRating: movie.userRating }
                : m
            )
          : watched.filter((m) => m.imdbID !== movie.imdbID)
      );
    }
  }

  function handleRemoveMovieToWatched(movie) {
    setWatched((watched) => watched.filter((m) => m.imdbID !== movie.imdbID));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQueryF={setQuery} />
        <SearchStatistics movies={movies} />
      </NavBar>
      <Main>
        <Box
          truncatedChildren={
            <ul className="list">
              {isLoading && <Loader />}
              {errorLoading && <ErrorMessage message={errorLoading} />}
              {!isLoading &&
                !errorLoading &&
                movies?.map((movie) => (
                  <MovieReleaseCard
                    key={movie.imdbID}
                    movie={movie}
                    handleSelecteMovieF={handleSelecteMovie}
                  />
                ))}
            </ul>
          }
        />
        {selectedId ? (
          <SelectedMovie
            selectedId={selectedId}
            handleSelecteMovieF={handleSelecteMovie}
            handleAddMovieToWatchedF={handleAddMovieToWatched}
            defaultRating={selectedIdSelfRating}
          />
        ) : (
          <Box
            truncatedChildren={
              <ul className="list">
                {watched.map((movie) => (
                  <MoviewReviewCard
                    key={movie.imdbID}
                    movie={movie}
                    handleRemoveMovieToWatchedF={handleRemoveMovieToWatched}
                  />
                ))}
              </ul>
            }
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

function SelectedMovie({
  selectedId,
  handleSelecteMovieF,
  handleAddMovieToWatchedF,
  defaultRating = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [movie, setMovie] = useState({});
  const [selfRating, setSelfRating] = useState(defaultRating);

  function handleRateMovie() {
    const ratedMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      runtime: movie.Runtime,
      imdbRating: movie.imdbRating,
      userRating: selfRating,
    };
    selfRating && handleAddMovieToWatchedF(ratedMovie);
    handleSelecteMovieF(selectedId);
  }

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
            throw new Error("Something went wrong while fetching movies");
          }

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not Found");
          setMovie(data);
        } catch (err) {
          setErrorLoading(true);
        }
        setIsLoading(false);
      }
      fetchMovie();
    },
    [selectedId]
  );

  useEffect(
    function () {
      document.title = (movie && `Movie | ${movie.Title}`) ?? "UsePopcorn";
      return function () {
        document.title = "UsePopcorn";
      };
    },
    [movie]
  );

  function callback(e) {
    if (e.code === "Escape") {
      handleSelecteMovieF(selectedId);
    }
  }
  useKey("Escape", "keydown", callback, [handleSelecteMovieF, selectedId]);

  return (
    <Box
      truncatedChildren={
        isLoading ? (
          <Loader />
        ) : (
          <div className="details">
            <section>
              <div className="rating">
                <StarRating
                  maxRating={10}
                  defaultRating={defaultRating}
                  onSetRating={setSelfRating}
                />
                {selfRating !== defaultRating && (
                  <button className="btn-add" onClick={handleRateMovie}>
                    + Add to list
                  </button>
                )}
              </div>
              <p>
                <em>{movie.Plot}</em>
              </p>
              <p>Actors {movie.Actors}</p>
              <p>Directed by {movie.Director}</p>
              <p>Written by {movie.Writer}</p>
            </section>
          </div>
        )
      }
    >
      <button
        className="btn-back"
        onClick={() => handleSelecteMovieF(selectedId)}
      >
        &larr;
      </button>
      {isLoading ? (
        <></>
      ) : (
        movie &&
        !errorLoading && (
          <div className="details">
            <header>
              <img src={movie.Poster} alt={`${movie.Title} poster`} />
              <div className="details-overview">
                <h2>{movie.Title}</h2>
                <p>
                  {movie.Released} &bull; {movie.Runtime}
                </p>
                <p>{movie.Genre}</p>
                <p>
                  <span>⭐ {movie.imdbRating} IMDb Rating</span>
                </p>
              </div>
            </header>
          </div>
        )
      )}
    </Box>
  );
}

function MovieReleaseCard({ movie, handleSelecteMovieF }) {
  return (
    <li onClick={() => handleSelecteMovieF(movie)}>
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

function MoviewReviewCard({ movie, handleRemoveMovieToWatchedF }) {
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
        <button
          className="btn-delete"
          onClick={() => handleRemoveMovieToWatchedF(movie)}
        >
          &times;
        </button>
      </div>
    </li>
  );
}
