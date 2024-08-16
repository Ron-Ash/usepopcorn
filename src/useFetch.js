import { useEffect, useState } from "react";

export function useFetch(url) {
  const [database, setDatabase] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoading, setErrorLoading] = useState(null);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetching() {
        setDatabase([]);
        setIsLoading(true);
        setErrorLoading(null);
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res.ok) {
            throw new Error("Something went wrong while fetching");
          }
          const data = await res.json();
          if (data.Response === "False") throw new Error("Data Not Found");
          setDatabase(data.Search ?? []);
          setErrorLoading(null);
        } catch (err) {
          if (err.name !== "Abort") setErrorLoading(err.message);
        }
        setIsLoading(false);
      }
      fetching();
      return function () {
        controller.abort();
      };
    },
    [url]
  );
  return { isLoading, errorLoading, database };
}
