import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const normalizedSearch = search.trim();

  useEffect(() => {
    if (!normalizedSearch) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(
            normalizedSearch
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!res.ok) {
          throw new Error("Failed to search books");
        }

        const data = await res.json();

        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to search books:", error);
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalizedSearch]);

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for books"
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      <FaSearch className="searchbar__icon" />

      {normalizedSearch && (
        <div className="searchbar__results">
          {loading ? (
            <div className="searchbar__state">
              Searching...
            </div>
          ) : results.length ? (
            results.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="searchbar__result"
                onClick={() => setSearch("")}
              >
                <img
                  src={book.imageLink}
                  alt={book.title}
                />

                <div>
                  <div className="searchbar__result-title">
                    {book.title}
                  </div>

                  <div className="searchbar__result-author">
                    {book.author}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="searchbar__state">
              No books found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
