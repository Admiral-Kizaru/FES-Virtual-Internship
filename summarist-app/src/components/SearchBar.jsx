import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim() === "") {
        setResults([]);
        return;
      }

      fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${search}`
      )
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
        })
        .catch((err) => {
          console.error("Search failed:", err);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-results">
          {results.map((book) => (
            <Link
              key={book.id}
              to={`/book/${book.id}`}
              className="search-result"
            >
              <img
                src={book.imageLink}
                alt={book.title}
                width="50"
              />

              <div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;